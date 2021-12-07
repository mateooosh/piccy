import React, {useCallback, useEffect, useState} from 'react'
import './EditProfileDialog.scss'
import {useSelector, useStore} from "react-redux"
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  useMediaQuery, useTheme
} from "@mui/material"
import {LoadingButton} from "@mui/lab"
import {useSnackbar} from 'notistack'
import {useHistory} from "react-router-dom"
import ImagePicker from "../image-picker/ImagePicker"
import {t} from "../../translations/translations"

export default function EditProfileDialog({open, setOpen, profile, getProfile}) {
  const history = useHistory()
  const store = useStore()
  const {enqueueSnackbar} = useSnackbar()
  const lang = useSelector(state => state.lang)

  const [avatar, setAvatar] = useState(null)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')


  const [croppedImage, setCroppedImage] = useState(null)
  const [src, setSrc] = useState(null)

  const [loading, setLoading] = useState(false)

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    if (profile) {
      setAvatar(profile.photo)
      setEmail(profile.email)
      setUsername(profile.username)
      setName(profile.name)
      setDescription(profile.description)
    }
  }, [profile])


  function closeDialog() {
    setOpen(false)
    setCroppedImage(null)
    setSrc(null)
  }

  function saveChanges() {
    const url = `${process.env.REACT_APP_API_URL}/users/${store.getState().id}`

    const index = getAvatar()?.indexOf(',')
    let base64 = (index && index !== -1) ? getAvatar().slice(index + 1, (getAvatar().length)) : null

    const obj = {
      name: name,
      description: description,
      photo: base64,
      token: store.getState().token
    }

    if (loading)
      return

    setLoading(true)

    fetch(url, {
      method: "PUT",
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': store.getState().token
      },
    })
      .then(response => response.json())
      .then(response => {
        enqueueSnackbar(response.message[lang], {
          variant: 'success'
        })
        setOpen(false)
        getProfile()
        store.dispatch({type: 'avatarSet', payload: getAvatar()})
      })
      .catch(err => enqueueSnackbar(t.somethingWentWrong[lang]))
      .finally(() => setLoading(false))
  }

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setSrc(reader.result)
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function getAvatar() {
    return croppedImage ? croppedImage : profile.photo ? profile.photo : null
  }

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={closeDialog}
      className="edit"
      fullScreen={fullScreen}
    >


      <ImagePicker setCroppedImage={setCroppedImage} src={src} setSrc={setSrc}/>

      {!!profile &&
      <>
        <DialogTitle style={{fontWeight: '600'}}>{t.editProfile[lang]}</DialogTitle>
        <DialogContent className="edit__content">
          {getAvatar() !== null ? (
            <>
              <input accept="image/*" style={{display: 'none'}} id="icon-button-file" type="file" onChange={onSelectFile}/>
              <label htmlFor="icon-button-file">
                <IconButton color="primary" component="span">
                  <Avatar className="edit__avatar" src={getAvatar()}/>
                </IconButton>
              </label>
            </>
          ) : (
            <>
              <input accept="image/*" style={{display: 'none'}} id="icon-button-file" type="file" onChange={onSelectFile}/>
              <label htmlFor="icon-button-file">
                <IconButton color="primary" component="span">
                  <Avatar className="edit__avatar"></Avatar>
                </IconButton>
              </label>
            </>
          )}
          <TextField className="edit__input"
                     label="E-mail"
                     variant="standard"
                     value={email}
                     onChange={e => setEmail(e.target.value)}
                     disabled
          />

          <TextField className="edit__input"
                     label={t.username[lang]}
                     variant="standard"
                     value={username}
                     onChange={e => setUsername(e.target.value)}
                     disabled
          />

          <TextField className="edit__input"
                     label={t.name[lang]}
                     variant="standard"
                     value={name || ''}
                     onChange={e => setName(e.target.value)}
          />

          <TextField className="edit__input"
                     label={t.description[lang]}
                     variant="standard"
                     value={description || ''}
                     onChange={e => setDescription(e.target.value)}
                     multiline
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            className="edit__button edit__button--disabled"
            disableRipple
            onClick={closeDialog}
          >
            {t.cancel[lang]}
          </Button>
          <LoadingButton
            loading={loading}
            variant="contained"
            className="edit__button"
            disableRipple
            onClick={saveChanges}
          >
            {t.saveChanges[lang]}
          </LoadingButton>
        </DialogActions>
      </>
      }
    </Dialog>
  )
}
