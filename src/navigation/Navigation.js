import {
  BrowserRouter as Router,
  Switch,
  Route, useHistory
} from "react-router-dom"

import '../App.scss'
import LoginView from "../views/LoginView/LoginView"
import {useSelector, useStore} from "react-redux"
import RegisterView from "../views/RegisterView/RegisterView"
import HomeView from "../views/HomeView/HomeView"
import PostView from "../views/PostView/PostView"
import ProfileView from "../views/ProfileView/ProfileView"
import Navbar from "../components/navbar/Navbar"
import React, {useEffect, useState} from "react"
import AccountView from "../views/AccountView/AccountView"
import SettingsView from "../views/SettingsView/SettingsView"
import {io} from "socket.io-client"
import MessagesView from "../views/MessagesView/MessagesView"
import {useSnackbar} from "notistack"
import SearchView from "../views/SearchView/SearchView"
import TagView from "../views/TagView/TagView"
import AdminDashboard from "../views/AdminDashboard/AdminDashboard"
import {t} from '../translations/translations'

export default function Navigation() {
  return (
    <Router>
      <NavigationContent/>
    </Router>
  )

}

function NavigationContent() {
  const store = useStore()
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const lang = useSelector(state => state.lang)

  const logged = useSelector(state => state.logged)
  const role = useSelector(state => state.role)

  const [socket, setSocket] = useState(null)

  useEffect(() => {
    setSocket(io(process.env.REACT_APP_API_URL_WS, {transports: ['websocket']}))
    const id = store.getState().id
    const log = store.getState().logged
    const username = store.getState().username

    if(log) {
      console.log('turn on: ', `message-to-user-${id}`)
      socket.emit('new-user', username)
      socket.on(`message-to-user-${id}`, handleMessage)
      socket.on(`invalid-token-${id}`, handleInvalidToken)
    }

    return function cleanup() {

      if(log) {
        console.log('turn off: ', `message-to-user-${id}`)
        socket.off(`message-to-user-${id}`, handleMessage)
        socket.off(`invalid-token-${id}`, handleInvalidToken)
        setSocket(null)
      }
    }
  }, [logged])

  const handleMessage = (message) => {
    console.log('new message -> ', message)
    const pathname = window.location.pathname

    if(!pathname.includes('messages')) {
      enqueueSnackbar(`${message.usernameSender}: ${message.message}`)
      store.dispatch({type: 'notificationAmountSet', payload: store.getState().notificationAmount + 1})
    }
  }

  const handleInvalidToken = message => {
    console.log('invalid token, ', message)
    socket.emit('log-out', store.getState().username)
    localStorage.clear()
    store.dispatch({type: 'resetStore'})
    history.push('/')
    enqueueSnackbar(t.youHaveBeenLoggedOutBecauceOfToken[lang], {
      variant: 'error'
    })
  }

  return (
    <>
      {logged ? (
        <div style={{display: 'flex', flexDirection: 'column'}}>

          <Switch>
            <Route path="/post/:id">
              <Navbar/>
              <PostView/>
            </Route>
            <Route path="/account">
              <Navbar/>
              <AccountView/>
            </Route>
            <Route path="/settings">
              <Navbar/>
              <SettingsView/>
            </Route>
            <Route path="/messages">
              <Navbar/>
              <MessagesView/>
            </Route>
            <Route path="/search">
              <Navbar/>
              <SearchView/>
            </Route>
            <Route path="/tag/:tag">
              <Navbar/>
              <TagView/>
            </Route>
            {role === 'ADMIN' &&
            <Route path="/admin">
              <AdminDashboard/>
            </Route>
            }
            <Route path="/:username">
              <Navbar/>
              <ProfileView/>
            </Route>
            <Route path="/">
              <Navbar/>
              <HomeView/>
            </Route>
          </Switch>
        </div>
      ) : (
        <Switch>
          <Route path="/register">
            <RegisterView/>
          </Route>
          <Route path="/">
            <LoginView/>
          </Route>
        </Switch>
      )}
    </>
  )
}