import React, {useEffect, useState} from 'react'
import './RegisterView.scss'
import {TextField} from "@mui/material"
import {LoadingButton} from "@mui/lab"

import {validation} from '../../functions/functions'
import {Link, useHistory} from "react-router-dom"
import {useSelector} from "react-redux"
import {useSnackbar} from "notistack"
import {t} from '../../translations/translations'

export default function RegisterView() {
  const history = useHistory()
  const {enqueueSnackbar} = useSnackbar()
  const lang = useSelector(state => state.lang)

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    return () => {
      setEmail('')
      setUsername('')
      setPassword('')
      setPassword2('')
      setName('')
      setLoading(false)
    }
  }, [])


  function register() {
    if (!allCorrect())
      return

    if (password !== password2) {
      enqueueSnackbar(t.givenPasswordsDoNotMatch[lang], {
        variant: 'error'
      })
      return
    }

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
        if (response.created) {
          history.push('/')
          enqueueSnackbar(response.message[lang], {
            variant: response.variant
          })
        } else {
          enqueueSnackbar(response.message[lang], {
            variant: response.variant
          })
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
    return hasErrorEmail(email) ? t.emailIsNotValid[lang] : ''
  }

  function helperTextUsername() {
    return hasError(username) ? t.usernameAtLeast6[lang] : ''
  }

  function helperTextPassword(value) {
    return hasError(value) ? t.passwordAtLeast6[lang] : ''
  }

  function helperTextName() {
    return nameHasError() ? t.nameAtLeast3[lang] : ''
  }

  function allCorrect() {
    return validation.email(email) && validation.min6Chars(username) && validation.min6Chars(password) &&
      !nameHasError() && name.length !== 0
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

      <TextField className="register__input" label="E-mail" variant="standard" error={hasErrorEmail(email)}
                 value={email}
                 onChange={e => setEmail(e.target.value)} helperText={helperTextEmail()}
                 onKeyPress={(ev) => {
                   if (ev.key === 'Enter') {
                     register()
                     ev.preventDefault()
                   }
                 }}/>

      <TextField className="register__input" label={t.username[lang]} variant="standard" error={hasError(username)}
                 value={username}
                 onChange={e => setUsername(e.target.value)} helperText={helperTextUsername()}
                 onKeyPress={(ev) => {
                   if (ev.key === 'Enter') {
                     register()
                     ev.preventDefault()
                   }
                 }}/>
      <TextField className="register__input" label={t.password[lang]} variant="standard" error={hasError(password)}
                 value={password}
                 onChange={e => setPassword(e.target.value)} helperText={helperTextPassword(password)}
                 onKeyPress={(ev) => {
                   if (ev.key === 'Enter') {
                     register()
                     ev.preventDefault()
                   }
                 }}
                 type="password"/>

      <TextField className="register__input" label={t.reenterPassword[lang]} variant="standard" error={hasError(password2)}
                 value={password2}
                 onChange={e => setPassword2(e.target.value)} helperText={helperTextPassword(password2)}
                 onKeyPress={(ev) => {
                   if (ev.key === 'Enter') {
                     register()
                     ev.preventDefault()
                   }
                 }}
                 type="password"/>

      <TextField className="register__input" label={t.name[lang]} variant="standard" error={nameHasError()} value={name}
                 onChange={e => setName(e.target.value)} helperText={helperTextName()}
                 onKeyPress={(ev) => {
                   if (ev.key === 'Enter') {
                     register()
                     ev.preventDefault()
                   }
                 }}/>

      <LoadingButton loading={loading} onClick={register} variant={getButtonVariant()} disabled={!allCorrect()}
                     disableRipple className={getButtonClasses()}>
        {t.createAccount[lang]}
      </LoadingButton>
      <div className="register__divider"></div>
      <p className="register__paragraph">{t.alreadyAPiccyMember[lang]} <Link to="/" className="register__paragraph--log-in">{t.loginHere[lang]}</Link></p>

    </div>
  )
}