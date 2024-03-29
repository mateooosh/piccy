import React, {useState} from 'react'
import './NewPostDialog.scss'
import {useSelector, useStore} from "react-redux"
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material"
import {LoadingButton} from "@mui/lab"
import {useSnackbar} from 'notistack'
import {t} from "../../translations/translations"


export default function NewPostDialog({croppedImage, open, setOpen}) {

  const store = useStore()
  const { enqueueSnackbar } = useSnackbar()
  const lang = useSelector(state => state.lang)


  const [caption, setCaption] = useState('')

  const [loading, setLoading] = useState(false)

  function createPost() {
    const index = croppedImage.indexOf(',')
    let base64 = croppedImage.slice(index + 1, (croppedImage.length))

    let obj = {
      idUser: store.getState().id,
      description: caption,
      photo: base64,
      token: store.getState().token
    }

    console.log(obj)

    setLoading(true)
    const url = `${process.env.REACT_APP_API_URL}/posts`
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': store.getState().token
      }
    })
      .then(response => response.json())
      .then(response => {
        setOpen(false)
        enqueueSnackbar(response.message[lang], {
          variant: 'success'
        })
      })
      .catch(err => {
        enqueueSnackbar(t.somethingWentWrong[lang], {
          variant: 'error'
        })
      })
      .finally(() => setLoading(false))
  }

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={() => setOpen(false)}
      className="new-post"
    >
      <DialogTitle style={{fontWeight: '600'}}>Create new post</DialogTitle>
      <DialogContent style={{margin: 'auto', width: '100%', padding: 0, display: 'flex', flexDirection: 'column'}}>
        {croppedImage !== null &&
        <img src={croppedImage} width='100%' alt="croppedImage"/>
        }
        <TextField className="new-post__input"
                   label="Caption"
                   variant="standard"
                   value={caption}
                   onChange={e => setCaption(e.target.value)}
                   multiline
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          className="new-post__button new-post__button--disabled"
          disableRipple
          onClick={() => setOpen(false)}
        >
          {t.cancel[lang]}
        </Button>
        <LoadingButton
          loading={loading}
          variant="contained"
          className="new-post__button"
          disableRipple
          onClick={createPost}
        >
          {t.create[lang]}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
