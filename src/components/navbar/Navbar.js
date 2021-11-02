import React, {useEffect, useState} from 'react'
import './Navbar.scss'
import {useStore} from "react-redux"
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import {useHistory} from "react-router-dom"
import {io} from "socket.io-client";

export default function Navbar() {

  const store = useStore()
  const history = useHistory()
  const [socket, setSocket] = useState(io(process.env.REACT_APP_API_URL_WS, {transports: ['websocket']}))


  const [pageScrolled, setPageScrolled] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', (e) => {
      if(window.pageYOffset > 50) {
        setPageScrolled(true)
      }
      else {
        setPageScrolled(false)
      }
    })
  }, [])

  function getClassesOfNavbar() {
    return pageScrolled ? 'navbar navbar--scrolled' : 'navbar'
  }

  function logOut() {
    socket.emit('log-out', store.getState().username)
    store.dispatch({type: 'resetStore'})
  }

  return(
    <div className={getClassesOfNavbar()}>
      <img className="navbar__logo" src="piccy.svg" alt="Piccy" onClick={() => history.push('')}/>
      <div className="navbar__actions">
        <ChatBubbleOutlineOutlinedIcon className="navbar__actions__icon"/>
        <AccountCircleOutlinedIcon className="navbar__actions__icon" onClick={() => history.push('/account')}/>
        <SettingsSharpIcon className="navbar__actions__icon" onClick={() => history.push('/settings')}/>
        <LogoutOutlinedIcon className="navbar__actions__icon"
                            onClick={logOut}/>
      </div>
    </div>
  )
}
