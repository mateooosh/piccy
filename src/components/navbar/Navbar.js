import React, {useEffect, useState} from 'react'
import './Navbar.scss'
import {useSelector, useStore} from "react-redux"
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import {useHistory} from "react-router-dom"
import {io} from "socket.io-client"
import {Avatar, Badge, Divider, ListItemIcon, MenuItem, Menu, IconButton, Popover} from "@mui/material"
import NewPost from "../new-post/NewPost"
import {Logout, Settings, Search, Close} from "@mui/icons-material"
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import {useSnackbar} from "notistack"
import SendIcon from "@mui/icons-material/Send";

export default function Navbar() {

  const store = useStore()
  const history = useHistory()
  const [socket, setSocket] = useState(io(process.env.REACT_APP_API_URL_WS, {transports: ['websocket']}))
  const {enqueueSnackbar} = useSnackbar();

  const notificationAmount = useSelector(state => state.notificationAmount)

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event?.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [pageScrolled, setPageScrolled] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', (e) => {
      if (window.pageYOffset > 50) {
        setPageScrolled(true)
      } else {
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
    history.push('/')
    enqueueSnackbar('You have been logged out')
  }

  return (
    <div className={getClassesOfNavbar()}>

      <img className="navbar__logo" src="piccy.svg" alt="Piccy" onClick={() => history.push('')}/>
      <div className="navbar__actions">
        <NewPost/>

        <Search onClick={() => history.push('/search')} className="navbar__actions__icon"/>

        <Badge badgeContent={notificationAmount} color="primary"
               sx={{"& .MuiBadge-badge": {color: 'white'}}}
        >
          <ChatBubbleOutlineOutlinedIcon className="navbar__actions__icon" onClick={() => history.push('/messages')}/>
        </Badge>
        {/*<AccountCircleOutlinedIcon className="navbar__actions__icon" onClick={() => history.push('/account')}/>*/}
        <IconButton onClick={handleClick} style={{padding: 0}}>
          <Avatar className="navbar__actions__avatar"
                  src={store.getState().avatar}/>
        </IconButton>

        {/*<SettingsSharpIcon className="navbar__actions__icon" onClick={() => history.push('/settings')}/>*/}
        {/*<LogoutOutlinedIcon className="navbar__actions__icon"*/}
        {/*                    onClick={logOut}/>*/}

      </div>

      {/*account*/}
      <Menu
        className="menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
      >
        <MenuItem className="menu__item" onClick={() => history.push('/account')}>
          <Avatar className="menu__avatar" src={store.getState().avatar}/>My account
        </MenuItem>
        <Divider/>
        <MenuItem className="menu__item">
          <ListItemIcon className="menu__item__icon">
            <AdminPanelSettingsOutlinedIcon/>
          </ListItemIcon>
          Admin dashboard
        </MenuItem>
        <MenuItem className="menu__item" onClick={() => history.push('/settings')}>
          <ListItemIcon className="menu__item__icon">
            <Settings/>
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem className="menu__item" onClick={logOut}>
          <ListItemIcon className="menu__item__icon">
            <Logout/>
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

    </div>
  )
}
