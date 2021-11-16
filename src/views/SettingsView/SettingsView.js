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

export default function SettingsView() {
  const store = useStore()
  const {enqueueSnackbar} = useSnackbar()
  const history = useHistory()

  const lang = useSelector(state => state.lang)

  const [socket, setSocket] = useState(io(process.env.REACT_APP_API_URL_WS, {transports: ['websocket']}))

  // const [selectedIndex, setSelectedIndex] = React.useState(0)
  //
  // const handleListItemClick = (event, index) => {
  //   setSelectedIndex(index)
  // }

  const [bugDescription, setBugDescription] = useState('')

  const [expanded, setExpanded] = React.useState(false)

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const [loadingDeleteAccount, setLoadingDeleteAccount] = useState(false)
  const [loadingReportBug, setLoadingReportBug] = useState(false)

  const [attachment, setAttachment] = useState(null)

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
        enqueueSnackbar(response.message)
        socket.emit('log-out', store.getState().username)
        store.dispatch({type: 'resetStore'})
        history.push('/')
      })
      .catch(err => enqueueSnackbar('Something went wrong!'))
      .finally(() => setLoadingDeleteAccount(false))
  }

  function reportBug() {
    const url = `${process.env.REACT_APP_API_URL}/report/bug`
    const obj = {
      idReporter: store.getState().id,
      description: bugDescription,
      token: store.getState().token,
      attachment: attachment
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
        enqueueSnackbar(response.message)
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

  function handleLangChange(lang) {
    store.dispatch({type: "langSet", payload: lang})
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
              Delete account
            </div>
          </AccordionSummary>
          <AccordionDetails className="settings__details">
            <div>
              Are you sure You want to delete your account? Your every post, comment, message and many, many others will
              be removed. It will not be possible to restore it.
            </div>
            <div className="settings__details__actions">
              <LoadingButton onClick={deleteAccount} variant="contained" disableRipple loading={loadingDeleteAccount}
                             className="settings__details__button settings__details__button--danger">
                Delete account
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
              Report bug
            </div>
          </AccordionSummary>
          <AccordionDetails className="settings__details">
            <div>
              <div>
                Describe some observation, event, happening or condition we need to resolve
              </div>
              <TextField className="settings__details__input"
                         label="Bug description"
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
                Attach screenshot
              </LoadingButton>
              <LoadingButton onClick={reportBug} variant="contained" disableRipple loading={loadingReportBug}
                             className="settings__details__button">
                Report
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
              Language
            </div>
            <div>
              {(lang === 'en') ? 'English' : 'Polish'}
            </div>
          </AccordionSummary>
          <AccordionDetails className="settings__details settings__details--no-padding">
            <ListItemButton
              className="settings__details__option"
              selected={lang === 'en'}
              onClick={() => handleLangChange('en')}
            >
              English
            </ListItemButton>
            <Divider/>
            <ListItemButton
              className="settings__details__option"
              selected={lang === 'pl'}
              onClick={() => handleLangChange('pl')}
            >
              Polish
            </ListItemButton>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>

  )

//   function getContent() {
//     switch (selectedIndex) {
//       case 0:
//         return (
//           <div>
//             <div>
//               Are you sure You want to delete your account? Your every post, comment, message and many, many others will
//               be removed. It will not be possible to restore it.
//             </div>
//             <div className="settings__content__actions">
//               <LoadingButton onClick={deleteAccount} variant="contained" disableRipple loading={loadingDeleteAccount}
//                              className="settings__content__button settings__content__button--danger">
//                 Delete account
//               </LoadingButton>
//             </div>
//           </div>
//         )
//         break
//       case 1:
//         return (
//           <div>
//             <div>
//               Describe some observation, event, happening or condition we need to resolve
//             </div>
//
//             <div className="settings__content__actions">
//               <LoadingButton className=" settings__content__button--outlined settings__content__button" loading={false}
//                              variant="outlined" disableRipple>
//                 Attach screenshot
//               </LoadingButton>
//               <LoadingButton onClick={reportBug} variant="contained" disableRipple loading={loadingReportBug}
//                              className="settings__content__button">
//                 Report
//               </LoadingButton>
//             </div>
//           </div>
//         )
//         break
//
//       default:
//         return null
//     }
//   }
//
//   return (
//     <div className="settings">
//       <List component="nav" className="settings__nav">
//         <ListItemButton
//           selected={selectedIndex === 0}
//           onClick={(event) => handleListItemClick(event, 0)}
//         >
//           <ListItemIcon>
//             <PersonRemoveRounded className="settings__nav__icon"/>
//           </ListItemIcon>
//           <div className="settings__nav__label">Delete account</div>
//         </ListItemButton>
//         <Divider/>
//         <ListItemButton
//           selected={selectedIndex === 1}
//           onClick={(event) => handleListItemClick(event, 1)}
//         >
//           <ListItemIcon>
//             <BugReportOutlined className="settings__nav__icon"/>
//           </ListItemIcon>
//           <div className="settings__nav__label">Report bug</div>
//         </ListItemButton>
//         <Divider/>
//
//         <ListItemButton
//           selected={selectedIndex === 2}
//           onClick={(event) => handleListItemClick(event, 2)}
//         >
//           <ListItemIcon>
//             <LanguageOutlined className="settings__nav__icon"/>
//           </ListItemIcon>
//           <div className="settings__nav__label">Language</div>
//         </ListItemButton>
//         <Divider/>
//
//         <ListItemButton
//           selected={selectedIndex === 3}
//           onClick={(event) => handleListItemClick(event, 3)}
//         >
//           <ListItemIcon>
//             <LockOutlined className="settings__nav__icon"/>
//           </ListItemIcon>
//           <div className="settings__nav__label">Reset password</div>
//         </ListItemButton>
//         <Divider/>
//
//         <ListItemButton
//           selected={selectedIndex === 4}
//           onClick={(event) => handleListItemClick(event, 4)}
//         >
//           <ListItemIcon>
//             <Logout className="settings__nav__icon"/>
//           </ListItemIcon>
//           <div className="settings__nav__label">Logout</div>
//         </ListItemButton>
//
//       </List>
//
//       <div className="settings__content">
//         {getContent()}
//       </div>
//
//     </div>
//   )
}