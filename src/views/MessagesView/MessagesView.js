import React, {useEffect, useRef, useState} from 'react'
import './MessagesView.scss'

import {useStore} from "react-redux"
import variables from "../../styles/variables.module.scss"
import {io} from "socket.io-client"
import {Avatar, CircularProgress, TextField} from "@mui/material"
import MessageItem from "../../components/message-item/MessageItem"
import SendIcon from '@mui/icons-material/Send'

export default function MessagesView() {

  const store = useStore()

  const messagesRef = useRef()

  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)


  const [activeUserId, setActiveUserId] = useState(null)
  const [idChannel, setIdChannel] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(false)

  const [input, setInput] = useState('')

  const [socket, setSocket] = useState(io(process.env.REACT_APP_API_URL_WS, {transports: ['websocket']}))


  const refMessages = useRef(messages)
  useEffect(() => {
    refMessages.current = messages
  }, [messages])

  const refIdChannel = useRef(idChannel)
  useEffect(() => {
    refIdChannel.current = idChannel
  }, [idChannel])

  useEffect(() => {
    getChannels()
    socket.on(`message-to-user-${store.getState().id}`, handler)

    return () => {
      socket.off(`message-to-user-${store.getState().id}`, handler)
    }
  }, [])

  useEffect(() => {
    setInput('')

    if (activeUserId) {
      getMessages(activeUserId)
    }

  }, [activeUserId])

  function handler(response) {
    getChannels()
    console.log(`message-to-user-${store.getState().id}`, response)

    if(response.idChannel == refIdChannel.current) {
      setMessages(old => [...old, response])
      markAsRead(store.getState().id, response.idChannel)
      scrollToEnd('smooth')
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
        console.log('messages:', response)
        setMessages(response.messages)
        markAsRead(store.getState().id, response.idChannel)
        markAsReadOnApp(store.getState().id, response.idChannel)
        scrollToEnd('auto')
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => setLoadingMessages(false))
  }

  function scrollToEnd(behavior) {
    setTimeout(() => {
      const arr = messagesRef.current.children
      console.log(arr)
      arr[arr.length - 1].scrollIntoView({behavior: behavior})
    }, 100)
  }

  function getChannels() {
    const url = `${process.env.REACT_APP_API_URL}/channels?idUser=${store.getState().id}&token=${store.getState().token}`
    fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log(response)
        setChannels(response)
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

  function sendMessage() {
    console.log('send', input)

    const obj = {
      message: input,
      idSender: store.getState().id,
      idReciever: activeUserId,
      idChannel: idChannel,
      createdAt: new Date()
    }

    setMessages(old => [...old, obj])

    socket.emit('message-from-user', obj)
    scrollToEnd('smooth')
    setInput('')
    getChannels()
  }

  function markAsReadOnApp(idUser, idChannel) {
    console.log('mark as read', channels)
    let obj = channels.find(elem => elem.idChannel == idChannel)
    let index = channels.indexOf(obj)

    let deepCopy = JSON.parse(JSON.stringify(channels))
    deepCopy[index].status = 0
    setChannels(deepCopy)
  }

  function handleUserClick(idUser, idChannel) {
    if (!loadingMessages) {
      setActiveUserId(idUser)
      setIdChannel(idChannel)
    }
  }

  function getClasses(idUser) {
    return idUser === activeUserId ? 'messages__nav__user messages__nav__user--active' : 'messages__nav__user'
  }

  return (
    <div className="messages">
      <div className="messages__nav">
        {channels.map((channel, idx) =>
          <div key={idx} className={getClasses(channel.idUser)}
               onClick={handleUserClick.bind(this, channel.idUser, channel.idChannel)}>
            <Avatar src={channel.photo} sx={{width: 50, height: 50}}/>
            <div>
              <div className="messages__nav__user__username">{channel.username}</div>
              <div className="messages__nav__user__lastMessage">
                {channel.status == 0 ? (
                  channel.lastMessage
                ) : (
                  <b>{channel.lastMessage}</b>
                )}
              </div>
            </div>
          </div>
        )}

        {loading &&
        <CircularProgress className="messages__nav__indicator" size={60}/>
        }
      </div>
      <div className="messages__channel">
        <div ref={messagesRef}>
          {messages.map((message, idx) =>
            <MessageItem key={idx} message={message}/>
          )}
          {loadingMessages &&
          <CircularProgress className="messages__channel__indicator" size={60}/>
          }
        </div>
        <div className="messages__channel__bottom">
          <input value={input}
                 onChange={e => setInput(e.target.value)}
                 className="messages__channel__input" type="text" placeholder="Type here..."
                 onKeyPress={(ev) => {
                   if (ev.key === 'Enter') {
                     sendMessage()
                   }
                 }}/>
          <SendIcon className="messages__channel__send" onClick={sendMessage}/>
        </div>
      </div>
    </div>
  )
}
