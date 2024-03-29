import React, {useEffect, useRef, useState} from 'react'
import './MessagesView.scss'

import {useSelector, useStore} from "react-redux"
import {io} from "socket.io-client"
import {Avatar, Chip, CircularProgress} from "@mui/material"
import MessageItem from "../../components/message-item/MessageItem"
import SendIcon from '@mui/icons-material/Send'
import MessagesDrawer from "../../components/messages-drawer/MessagesDrawer"
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'
import {useHistory, useLocation} from "react-router-dom"
import {t} from '../../translations/translations'
export default function MessagesView() {

  const store = useStore()
  const history = useHistory()
  const location = useLocation()
  const lang = useSelector(state => state.lang)

  const messagesRef = useRef()

  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)


  const [activeUserId, setActiveUserId] = useState(null)
  const [idChannel, setIdChannel] = useState(null)
  const [messages, setMessages] = useState([])
  const [userChattingWith, setUserChattingWith] = useState(null)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [noChannels, setNoChannels] = useState(false)
  const [noMessages, setNoMessages] = useState(false)

  const [firstAttempt, setFirstAttempt] = useState(true)

  const [input, setInput] = useState('')

  const [socket, setSocket] = useState(io(process.env.REACT_APP_API_URL_WS, {transports: ['websocket']}))

  const [drawerOpen, setDrawerOpen] = useState(false)

  const refMessages = useRef(messages)
  useEffect(() => {
    refMessages.current = messages
  }, [messages])

  const refFirstAttempt = useRef(firstAttempt)
  useEffect(() => {
    refFirstAttempt.current = firstAttempt
  }, [firstAttempt])

  const refIdChannel = useRef(idChannel)
  useEffect(() => {
    refIdChannel.current = idChannel
  }, [idChannel])

  useEffect(() => {
    store.dispatch({type: 'notificationAmountSet', payload: 0})
    getChannels()
    socket.on(`message-to-user-${store.getState().id}`, handler)

    if (window.innerWidth <= 620 && !location?.state?.idUser) {
      setDrawerOpen(true)
    }
    return () => {
      socket.off(`message-to-user-${store.getState().id}`, handler)
    }
  }, [])

  useEffect(() => {
    setInput('')
    console.log('active', activeUserId)

    if (activeUserId) {
      getMessages(activeUserId)
    }

  }, [activeUserId])

  useEffect(() => {
    console.log('noMessages', messages.length === 0)
    setNoMessages(messages.length === 0)
  }, [messages])

  function handler(response) {
    getChannels()
    // console.log(`message-to-user-${store.getState().id}`, response)

    if (response.idChannel === refIdChannel.current) {
      setMessages(old => [response, ...old])
      markAsRead(store.getState().id, response.idChannel)
      // scrollToEnd('smooth')
    }
  }

  function markAsRead(idUser, idChannel) {
    socket.emit('mark-as-read', idUser, idChannel)
  }

  function getMessages(id) {
    setMessages([])

    const url = `${process.env.REACT_APP_API_URL}/messages/${id}?myIdUser=${store.getState().id}&token=${store.getState().token}`

    setLoadingMessages(true)
    fetch(url)
      .then(response => response.json())
      .then(response => {
        setMessages(response.messages)
        setUserChattingWith(findUserChattingWith(response.users))
        setIdChannel(response.idChannel)
        markAsRead(store.getState().id, response.idChannel)
        markAsReadOnApp(store.getState().id, response.idChannel)
        // scrollToEnd('auto')
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => setLoadingMessages(false))
  }

  function getChannels() {
    const url = `${process.env.REACT_APP_API_URL}/channels?idUser=${store.getState().id}&token=${store.getState().token}`
    fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log(response)
        setChannels(response)

        setNoChannels(response.length === 0)

        if (location.state?.idUser && refFirstAttempt.current) {
          setActiveUserId(location.state?.idUser)
          setFirstAttempt(false)
        } else if (refFirstAttempt.current) {
          setActiveUserId(response[0]?.idUser)
          setFirstAttempt(false)
        }

        const index = response.findIndex(channel => channel.idUser === location.state?.idUser)
        if (index === -1 && location.state?.idUser) {
          setChannels(old => [{
            createdAt: null,
            idChannel: null,
            idUser: location.state?.idUser,
            lastMessage: '',
            name: null,
            photo: location.state?.avatar,
            status: 0,
            username: location.state?.username
          },
            ...old])

          // getMessages(channels.idUser)
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

  function sendMessage() {
    console.log('send', input, activeUserId)

    if (!activeUserId)
      return

    const obj = {
      message: input,
      idSender: store.getState().id,
      usernameSender: store.getState().username,
      idReciever: activeUserId,
      idChannel: idChannel,
      createdAt: new Date()
    }

    setMessages(old => [obj, ...old])

    socket.emit('message-from-user', obj)
    // scrollToEnd('smooth')
    setInput('')
    getChannels()
  }

  function markAsReadOnApp(idUser, idChannel) {
    console.log('mark as read', channels)
    if (messages.length === 0)
      return

    let obj = channels.find(elem => elem.idChannel === idChannel)
    let index = channels.indexOf(obj)

    let deepCopy = JSON.parse(JSON.stringify(channels))
    deepCopy[index].status = 0
    setChannels(deepCopy)
  }

  function handleUserClick(idUser, idChannel) {
    if (!loadingMessages) {
      setActiveUserId(idUser)
      setIdChannel(idChannel)
      setDrawerOpen(false)
    }
  }

  function findUserChattingWith(users) {
    return users.find(elem => elem.idUser !== store.getState().id);
  }

  function getClasses(idUser) {
    return idUser === activeUserId ? 'messages__nav__user messages__nav__user--active' : 'messages__nav__user'
  }

  function getChannelsView(rootClass) {
    return (
      <div className={rootClass}>
        {noChannels && !activeUserId && !loading &&
        <div style={{padding: 20, fontWeight: '600', fontSize: 16}}>{t.noChannels[lang]}</div>
        }
        {channels.map((channel, idx) =>
          <div key={idx} className={getClasses(channel.idUser)}
               onClick={handleUserClick.bind(this, channel.idUser, channel.idChannel)}>
            <Avatar src={channel.photo} sx={{width: 50, height: 50}}/>
            <div style={{flexGrow: 1}}>
              <div className="messages__nav__user__username">{channel.username}</div>
              <div className="messages__nav__user__lastMessage">
                {channel.lastMessage}
              </div>
            </div>
            {channel.status == 1 ? (
              <Chip onClick={handleUserClick.bind(this, channel.idUser, channel.idChannel)} label={t.new[lang]} color="primary"
                    style={{color: 'white'}}/>
            ) : null}
          </div>
        )}

        {loading &&
        <CircularProgress className="messages__nav__indicator" size={60}/>
        }
      </div>
    )
  }

  return (
    <div className="messages">
      {getChannelsView('messages__nav')}
      <div className="messages__channel">
        {!!userChattingWith && !loadingMessages &&
        <div className="messages__channel__avatar" onClick={() => history.push(`/${userChattingWith.username}`)}>
          <Avatar src={userChattingWith.photo}/>
          <div>{userChattingWith.username}</div>
        </div>
        }
        <div className="messages__channel__messages" ref={messagesRef}>
          {messages.map((message, idx) =>
            <MessageItem key={idx} message={message}/>
          )}

          {noMessages && !loadingMessages &&
          <div style={{margin: 30, fontWeight: '600', fontSize: 16}}>{t.noMessages[lang]}</div>
          }

          {loadingMessages &&
          <CircularProgress className="messages__channel__indicator" size={60}/>
          }
        </div>
        <div className="messages__channel__bottom">
          <input value={input}
                 onChange={e => setInput(e.target.value)}
                 className="messages__channel__input" type="text" placeholder={t.typeHere[lang]}
                 onKeyPress={(ev) => {
                   if (ev.key === 'Enter') {
                     sendMessage()
                   }
                 }}/>
          <SendIcon className="messages__channel__send" onClick={sendMessage}/>
        </div>

        <div onClick={() => setDrawerOpen(true)}
             className="messages__drawer-button">
          <KeyboardArrowRightRoundedIcon sx={{fontSize: 44, color: '#666'}}/>
        </div>
        <MessagesDrawer open={drawerOpen} setOpen={setDrawerOpen}>
          {getChannelsView('messages__drawer')}
        </MessagesDrawer>
      </div>
    </div>
  )
}
