import React, {useEffect, useState} from 'react'
import './Navbar.scss'
import {useStore} from "react-redux"
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import {useHistory} from "react-router-dom"

export default function Navbar() {

  const store = useStore()
  const history = useHistory()

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

  return(
    <div className={getClassesOfNavbar()}>
      <img className="navbar__logo" src="piccy.svg" alt="Piccy" onClick={() => history.push('')}/>
      <div className="navbar__actions">
        <ChatBubbleOutlineOutlinedIcon className="navbar__actions__icon"/>
        <AccountCircleOutlinedIcon className="navbar__actions__icon" onClick={() => history.push('/account')}/>
        <LogoutOutlinedIcon className="navbar__actions__icon"
                            onClick={() => store.dispatch({type: 'resetStore'})}/>
      </div>
    </div>
  )
}
