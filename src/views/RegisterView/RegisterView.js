import React, {useEffect, useState} from 'react'
import './RegisterView.scss'
import {TextField} from "@mui/material"
import {LoadingButton} from "@mui/lab"

import {validation} from '../../functions/functions'
import {Link, useHistory} from "react-router-dom"
import {useStore} from "react-redux"
import {useSnackbar} from "notistack";

export default function RegisterView() {
  const store = useStore()
  const history = useHistory()
  const {enqueueSnackbar} = useSnackbar()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    return() => {
      setEmail('')
      setUsername('')
      setPassword('')
      setName('')
      setLoading(false)
    }
  }, [])


  function register() {
    if(!allCorrect())
      return

    setLoading(true)

    const obj = {
      email: email,
      username: username,
      password: password,
      name: name
    }

    console.log(obj)

    const url = `${process.env.REACT_APP_API_URL}/users`
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(response => {
        if(response.created) {
          history.push('/')
        }
        else {
          enqueueSnackbar(response.message)
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

  function hasErrorEmail(string) {
    return !validation.email(string) && string.length > 0
  }

  function hasError(string) {
    return !validation.min6Chars(string) && string.length > 0
  }

  function nameHasError() {
    return !validation.min3Chars(name) && name.length > 0
  }

  function helperTextEmail() {
    return hasErrorEmail(email) ? 'E-mail is not valid' : ''
  }

  function helperTextUsername() {
    return hasError(username) ? 'Username must be at least 6 characters long' : ''
  }

  function helperTextPassword() {
    return hasError(password) ? 'Password must be at least 6 characters long' : ''
  }

  function helperTextName() {
    return nameHasError() ? 'Name must be at least 6 characters long' : ''
  }

  function allCorrect() {
    return validation.email(email) && validation.min6Chars(username) && validation.min6Chars(password) && !nameHasError() && name.length !== 0
  }

  function getButtonVariant() {
    return (allCorrect()) ? 'contained' : 'outlined'
  }

  function getButtonClasses() {
    return (allCorrect()) ? 'register__button' : 'register__button register__button--disabled'
  }

  return (
    <div className="register">
      <img className="register__logo" src="piccy.svg" alt="Piccy"/>

      <TextField className="register__input" label="E-mail" variant="standard" error={hasErrorEmail(email)} value={email}
                 onChange={e => setEmail(e.target.value)} helperText={helperTextEmail()}
                 onKeyPress={(ev) => {
                   if (ev.key === 'Enter') {
                     register()
                     ev.preventDefault()
                   }
                 }}/>

      <TextField className="register__input" label="Username" variant="standard" error={hasError(username)} value={username}
                 onChange={e => setUsername(e.target.value)} helperText={helperTextUsername()}
                 onKeyPress={(ev) => {
                   if (ev.key === 'Enter') {
                     register()
                     ev.preventDefault()
                   }
                 }}/>
      <TextField className="register__input" label="Password" variant="standard" error={hasError(password)} value={password}
                 onChange={e => setPassword(e.target.value)} helperText={helperTextPassword()}
                 onKeyPress={(ev) => {
                   if (ev.key === 'Enter') {
                     register()
                     ev.preventDefault()
                   }
                 }}
                 type="password"/>

      <TextField className="register__input" label="Name" variant="standard" error={nameHasError()} value={name}
                 onChange={e => setName(e.target.value)} helperText={helperTextName()}
                 onKeyPress={(ev) => {
                   if (ev.key === 'Enter') {
                     register()
                     ev.preventDefault()
                   }
                 }}/>

      <LoadingButton loading={loading} onClick={register} variant={getButtonVariant()} disabled={!allCorrect()} disableRipple className={getButtonClasses()}>
        Create account
      </LoadingButton>
      <div className="register__divider"></div>
      <p className="register__paragraph">Already a Piccy member? <Link to="/" className="register__paragraph--log-in">Log in here</Link></p>

    </div>
  )
}