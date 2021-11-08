import React, {useEffect, useState} from 'react'
import './MessageItem.scss'
import {useSelector, useStore} from "react-redux"
import {useHistory} from "react-router-dom"

export default function MessageItem({message}) {

  const store = useStore()
  const history = useHistory()


  const id = useSelector(state => state.id)

  return (
    <>
      {message.idSender == id ? (
        <div className="message message--my">
          <div className="message__block message__block--my">
            {message.message.startsWith('LINKTOPOST') ? (
              <span className="message__block__link" onClick={() => history.push('/post/' + message.message.split('|')[1])}>Link to post</span>
            ) : (
              message.message
            )}
          </div>
        </div>
      ) : (
        <div className="message message--other">
          <div className="message__block message__block--other">
            {message.message.startsWith('LINKTOPOST') ? (
              <span className="message__block__link" onClick={() => history.push('/post/' + message.message.split('|')[1])}>Link to post</span>
            ) : (
              message.message
            )}
          </div>
        </div>
      )}
    </>
  )
}
