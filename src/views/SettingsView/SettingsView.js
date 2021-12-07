import React, {useEffect, useState} from 'react'
import './SettingsView.scss'

import {useSelector, useStore} from "react-redux"
import {Divider, ListItemButton, TextField} from "@mui/material"
import {BugReportOutlined, LanguageOutlined, PersonRemoveRounded} from "@mui/icons-material"
import {LoadingButton} from "@mui/lab"
import {useSnackbar} from "notistack"
import {useHistory} from "react-router-dom"
import {io} from "socket.io-client"
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import {validation} from "../../functions/functions"
import {t} from '../../translations/translations'

export default function SettingsView() {
  const store = useStore()
  const {enqueueSnackbar} = useSnackbar()
  const history = useHistory()
  const lang = useSelector(state => state.lang)

  const [socket, setSocket] = useState(null)

  // const [selectedIndex, setSelectedIndex] = React.useState(0)
  //
  // const handleListItemClick = (event, index) => {
  //   setSelectedIndex(index)
  // }

  const [bugDescription, setBugDescription] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPassword2, setNewPassword2] = useState('')

  const [expanded, setExpanded] = React.useState(false)

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const [loadingDeleteAccount, setLoadingDeleteAccount] = useState(false)
  const [loadingReportBug, setLoadingReportBug] = useState(false)
  const [loadingResetPassword, setLoadingResetPassword] = useState(false)

  const [attachment, setAttachment] = useState(null)

  useEffect(() => {
    setSocket(io(process.env.REACT_APP_API_URL_WS, {transports: ['websocket']}))
  }, [])

  useEffect(() => {
    console.log(attachment)
  }, [attachment])


  function deleteAccount() {
    console.log('delete')
    setLoadingDeleteAccount(true)
    const url = `${process.env.REACT_APP_API_URL}/users/${store.getState().id}`
    fetch(url, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(response => response.json())
      .then(response => {
        enqueueSnackbar(response.message[lang])
        socket.emit('log-out', store.getState().username)
        store.dispatch({type: 'resetStore'})
        history.push('/')
      })
      .catch(err => enqueueSnackbar(t.somethingWentWrong[lang]))
      .finally(() => setLoadingDeleteAccount(false))
  }

  function reportBug() {
    const url = `${process.env.REACT_APP_API_URL}/report/bug`

    const index = attachment?.indexOf(',')
    let base64 = (index && index !== -1) ? attachment.slice(index + 1, (attachment.length)) : null

    const obj = {
      idReporter: store.getState().id,
      description: bugDescription,
      token: store.getState().token,
      attachment: base64
    }

    setLoadingReportBug(true)
    fetch(url, {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(response => response.json())
      .then(response => {
        enqueueSnackbar(response.message[lang])
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingReportBug(false)
        setBugDescription('')
        setAttachment(null)
      })
  }

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setAttachment(reader.result)
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function handleLangChange(l) {
    store.dispatch({type: "langSet", payload: l})
    localStorage.setItem('lang', l)
  }

  function resetPassword() {
    if (newPassword !== newPassword2) {
      enqueueSnackbar(t.givenPasswordsDoNotMatch[lang], {
        variant: 'error'
      })
      return
    }

    const url = `${process.env.REACT_APP_API_URL}/reset/password`;
    const obj = {
      idUser: store.getState().id,
      oldPassword: oldPassword,
      newPassword: newPassword,
      token: store.getState().token
    }

    setLoadingResetPassword(true);
    fetch(url, {
      method: "PUT",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(response => response.json())
      .then(response => {
        console.log(response.message)
        enqueueSnackbar(response.message[lang], {
          variant: response.message.variant
        })
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingResetPassword(false)
        setNewPassword('')
        setNewPassword2('')
        setOldPassword('')
      })
  }

  function helperTextOldPassword() {
    return hasError(oldPassword) ? t.oldPasswordMustBeAtLeast6[lang] : ''
  }

  function helperTextNewPassword(value) {
    return hasError(value) ? t.newPasswordMustBeAtLeast6[lang] : ''
  }

  function hasError(string) {
    return !validation.min6Chars(string) && string.length > 0
  }

  function activeButton() {
    return validation.min6Chars(oldPassword) && validation.min6Chars(newPassword) && validation.min6Chars(newPassword2);
  }

  return (
    <div className="settings">
      <div>
        <Accordion className="settings__accordion" expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary
            className="settings__accordion__summary"
            expandIcon={<ExpandMoreIcon/>}
            id="panel1bh-header"
          >
            <div>
              <PersonRemoveRounded className="settings__accordion__summary__icon"/>
              {t.deleteAccount[lang]}
            </div>
          </AccordionSummary>
          <AccordionDetails className="settings__details">
            <div>
              {t.areYouSureYouWantToDeleteThisAccount[lang]}
            </div>
            <div className="settings__details__actions">
              <LoadingButton onClick={deleteAccount} variant="contained" disableRipple loading={loadingDeleteAccount}
                             className="settings__details__button settings__details__button--danger">
                {t.deleteAccount[lang]}
              </LoadingButton>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
            className="settings__accordion__summary"
            id="panel2bh-header"
          >
            <div>
              <BugReportOutlined className="settings__accordion__summary__icon"/>
              {t.reportBug[lang]}
            </div>
          </AccordionSummary>
          <AccordionDetails className="settings__details">
            <div>
              <div>
                {t.describeSomeObservation[lang]}
              </div>
              <TextField className="settings__details__input settings__details__input--margin"
                         label={t.typeHere[lang]}
                         variant="standard"
                         value={bugDescription}
                         onChange={e => setBugDescription(e.target.value)}
                         multiline
              />
              {attachment !== null &&
              <img className="settings__details__attachment" src={attachment} width='100%'/>
              }
            </div>
            <div className="settings__details__actions">
              <LoadingButton className=" settings__details__button--outlined settings__details__button" loading={false}
                             variant="outlined" disableRipple component="label">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={onSelectFile}
                />
                {t.attachScreenshot[lang]}
              </LoadingButton>
              <LoadingButton onClick={reportBug} variant="contained" disableRipple loading={loadingReportBug}
                             className="settings__details__button">
                {t.report[lang]}
              </LoadingButton>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
            className="settings__accordion__summary"
            id="panel3bh-header"
          >
            <div>
              <LanguageOutlined className="settings__accordion__summary__icon"/>
              {t.language[lang]}
            </div>
            <div>
              {(lang === 'en') ? t.english[lang] : t.polish[lang]}
            </div>
          </AccordionSummary>
          <AccordionDetails className="settings__details settings__details--no-padding">
            <ListItemButton
              className="settings__details__option"
              selected={lang === 'en'}
              onClick={() => handleLangChange('en')}
            >
              <img
                src="https://flagcdn.com/gb.svg"
                width="40"
                alt="England"/>
              {t.english[lang]}
            </ListItemButton>
            <Divider/>
            <ListItemButton
              className="settings__details__option"
              selected={lang === 'pl'}
              onClick={() => handleLangChange('pl')}
            >
              <img
                src="https://flagcdn.com/pl.svg"
                width="40"
                alt="Poland"/>
              {t.polish[lang]}
            </ListItemButton>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
            className="settings__accordion__summary"
            id="panel4bh-header"
          >
            <div>
              <LockOutlinedIcon className="settings__accordion__summary__icon"/>
              {t.resetPassword[lang]}
            </div>
          </AccordionSummary>
          <AccordionDetails className="settings__details">
            <TextField className="settings__details__input"
                       label={t.oldPassword[lang]}
                       variant="standard"
                       type="password"
                       value={oldPassword}
                       onChange={e => setOldPassword(e.target.value)}
                       error={hasError(oldPassword)}
                       helperText={helperTextOldPassword()}
            />

            <TextField className="settings__details__input settings__details__input--margin"
                       label={t.newPassword[lang]}
                       variant="standard"
                       type="password"
                       value={newPassword}
                       onChange={e => setNewPassword(e.target.value)}
                       error={hasError(newPassword)}
                       helperText={helperTextNewPassword(newPassword)}
            />

            <TextField className="settings__details__input"
                       label={t.reenterPassword[lang]}
                       variant="standard"
                       type="password"
                       value={newPassword2}
                       onChange={e => setNewPassword2(e.target.value)}
                       error={hasError(newPassword2)}
                       helperText={helperTextNewPassword(newPassword2)}
                       style={{marginBottom: 10}}
            />

            <div className="settings__details__actions">
              {activeButton() ? (
                <LoadingButton onClick={resetPassword} variant="contained" disableRipple loading={loadingResetPassword}
                               className="settings__details__button">
                  {t.resetPassword[lang]}
                </LoadingButton>
              ) : (
                <LoadingButton variant="outlined" disableRipple
                               className="settings__details__button   settings__details__button--outlined">
                  {t.resetPassword[lang]}
                </LoadingButton>
              )}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>

  )
}