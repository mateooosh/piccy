import React, {useEffect, useState} from 'react'
import './LoginView.scss'
import {TextField} from "@mui/material"
import {LoadingButton} from "@mui/lab"

import {validation} from '../../functions/functions'
import {Link, useHistory} from "react-router-dom"
import {useStore} from "react-redux"
import {useSnackbar} from "notistack";

export default function LoginView() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const store = useStore()
  const history = useHistory()
  const {enqueueSnackbar} = useSnackbar()

  useEffect(() => {
    return() => {
      setUsername('')
      setPassword('')
      setLoading(false)
    }
  }, [])


  function logIn() {

    if(!allCorrect())
      return

    setLoading(true)

    const obj = {
      username: username,
      password: password,
    }

    console.log(obj)

    const url = `${process.env.REACT_APP_API_URL}/auth`
    fetch(url, {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(response => {
        // alert(response.message)
        console.log('asdasdasd', response)
        store.dispatch({type: "tokenSet", payload: response.token})
        store.dispatch({type: "usernameSet", payload: response.username})
        store.dispatch({type: "idSet", payload: response.id})
        store.dispatch({type: "avatarSet", payload: response.photo})
        store.dispatch({type: "roleSet", payload: response.role})
        store.dispatch({type: "logged/true"})
        history.push('/')
      })
      .catch(err => {
        enqueueSnackbar('Wrong credentials! Try again.')
      })
      .finally(() => setLoading(false))
  }

  function hasError(string) {
    return !validation.min6Chars(string) && string.length > 0
  }

  function helperTextUsername() {
    return hasError(username) ? 'Username must be at least 6 characters long' : ''
  }

  function helperTextPassword() {
    return hasError(password) ? 'Password must be at least 6 characters long' : ''
  }

  function allCorrect() {
    return validation.min6Chars(username) && validation.min6Chars(password)
  }

  function getButtonVariant() {
    return (allCorrect()) ? 'contained' : 'outlined'
  }

  function getButtonClasses() {
    return (allCorrect()) ? 'login__button' : 'login__button login__button--disabled'
  }

  return (
    <div className="login">
      <img src="piccy.svg" alt="Piccy" className="login__logo"/>
      <TextField className="login__input" label="Username" variant="standard" error={hasError(username)} value={username}
                 onChange={e => setUsername(e.target.value)} helperText={helperTextUsername()}
                 onKeyPress={(ev) => {
                   if (ev.key === 'Enter') {
                     logIn()
                     ev.preventDefault()
                   }
                 }}/>
      <TextField className="login__input" label="Password" variant="standard" error={hasError(password)} value={password}
                 onChange={e => setPassword(e.target.value)} helperText={helperTextPassword()}
                 onKeyPress={(ev) => {
                   if (ev.key === 'Enter') {
                     logIn()
                     ev.preventDefault()
                   }
                 }}
                 type="password"/>

      <LoadingButton loading={loading} onClick={logIn} variant={getButtonVariant()} disabled={!allCorrect()} disableRipple className={getButtonClasses()}>
        Log in
      </LoadingButton>
      <div className="login__divider"></div>
      <p className="login__paragraph">You don't have an account on Piccy? <Link to="register" className="login__paragraph--sign-up">Sign up</Link></p>

    </div>
  )
}