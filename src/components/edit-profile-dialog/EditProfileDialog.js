import React, {useCallback, useEffect, useState} from 'react'
import './EditProfileDialog.scss'
import {useStore} from "react-redux"
import {Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material"
import {LoadingButton} from "@mui/lab"
import {useSnackbar} from 'notistack'
import {useHistory} from "react-router-dom"

export default function EditProfileDialog({open, setOpen, profile}) {
  const history = useHistory()
  const store = useStore()
  const {enqueueSnackbar} = useSnackbar()

  const [avatar, setAvatar] = useState(null)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (profile) {
      setAvatar(profile.photo)
      setEmail(profile.email)
      setUsername(profile.username)
      setName(profile.name)
      setDescription(profile.description)
    }
  }, [profile])

  function saveChanges() {
    const url = `${process.env.REACT_APP_API_URL}/users/${store.getState().id}`

    const index = avatar.indexOf(',')
    let base64 = avatar.slice(index + 1, (avatar.length))

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
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(response => {
        enqueueSnackbar(response.message)
        history.push(`/account`)
      })
      .catch(err => enqueueSnackbar('Something went wrong'))
      .finally(() => setLoading(false))
  }

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={() => setOpen(false)}
      className="edit"
    >
      <DialogTitle>Edit profile</DialogTitle>
      <DialogContent className="edit__content">
        <Avatar className="edit__avatar" src={profile.photo}></Avatar>
        <TextField className="edit__input"
                   label="E-mail"
                   variant="standard"
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   disabled
        />

        <TextField className="edit__input"
                   label="Username"
                   variant="standard"
                   value={username}
                   onChange={e => setUsername(e.target.value)}
                   disabled
        />

        <TextField className="edit__input"
                   label="Name"
                   variant="standard"
                   value={name}
                   onChange={e => setName(e.target.value)}
        />

        <TextField className="edit__input"
                   label="Description"
                   variant="standard"
                   value={description}
                   onChange={e => setDescription(e.target.value)}
                   multiline
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          className="edit__button edit__button--disabled"
          disableRipple
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <LoadingButton
          loading={loading}
          variant="contained"
          className="edit__button"
          disableRipple
          onClick={saveChanges}
        >
          Save changes
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
