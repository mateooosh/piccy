import {
  BrowserRouter as Router,
  Switch,
  Route
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
import SearchView from "../views/SearchView/SearchView";
import TagView from "../views/TagView/TagView";

export default function Navigation() {
  const store = useStore()
  const { enqueueSnackbar } = useSnackbar()

  const logged = useSelector(state => state.logged)

  const [socket, setSocket] = useState(io(process.env.REACT_APP_API_URL_WS, {transports: ['websocket']}))

  useEffect(() => {
    const id = store.getState().id
    const log = store.getState().logged
    const username = store.getState().username

    if(log) {
      console.log('turn on: ', `message-to-user-${id}`)
      socket.emit('new-user', username)
      socket.on(`message-to-user-${id}`, handleMessage)
    }

    return function cleanup() {

      if(log) {
        console.log('turn off: ', `message-to-user-${id}`)
        socket.off(`message-to-user-${id}`, handleMessage)
      }
    }
  }, [logged])

  const handleMessage = (message) => {
    console.log('new message -> ', message)
    const pathname = window.location.pathname

    if(!pathname.includes('messages')) {
      enqueueSnackbar('New message')
      store.dispatch({type: 'notificationAmountSet', payload: store.getState().notificationAmount + 1})
    } else {
      console.log('nie')
    }
  }

  return (
    <Router>
      {logged ? (
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <Navbar/>
          <Switch>
            <Route path="/post/:id">
              <PostView/>
            </Route>
            <Route path="/account">
              <AccountView/>
            </Route>
            <Route path="/settings">
              <SettingsView/>
            </Route>
            <Route path="/messages">
              <MessagesView/>
            </Route>
            <Route path="/search">
              <SearchView/>
            </Route>
            <Route path="/tag/:tag">
              <TagView/>
            </Route>
            <Route path="/:username">
              <ProfileView/>
            </Route>
            <Route path="/">
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
    </Router>
  )
}