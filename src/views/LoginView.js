import React, {useState} from 'react'
import './LoginView.scss'
import {TextField} from "@mui/material"
import {LoadingButton} from "@mui/lab"

import {validation} from '../functions/functions'
import {Link} from "react-router-dom";



export default function LoginView() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function hasError(string) {
    return !validation.min6Chars(string) && string.length > 0
  }

  function helperTextUsername() {
    return hasError(username) ? 'Username must be at least 6 characters long' : ''
  }

  function helperTextPassword() {
    return hasError(password) ? 'Password must be at least 6 characters long' : ''
  }

  return (
    <div className="container">
      <img src="piccy.svg"/>
      <TextField label="Username" variant="standard" error={hasError(username)} value={username} onChange={e => setUsername(e.target.value)} helperText={helperTextUsername()}/>
      <TextField label="Password" variant="standard" error={hasError(password)} value={password} onChange={e => setPassword(e.target.value)} helperText={helperTextPassword()} type="password"/>

      <LoadingButton variant="contained" disableRipple className="container__button">
        Log in
      </LoadingButton>
      <div className="container__divider"></div>
      <p className="container__paragraph">You don't have an account on Piccy? <Link to="register" className="container__paragraph--sign-up">Sign up</Link>
      </p>

    </div>
  )
}