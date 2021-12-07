import React, {useState} from 'react'
import './MessageItem.scss'
import {useSelector, useStore} from "react-redux"
import {useHistory} from "react-router-dom"
import {displayTimeV2} from '../../functions/functions'
import {Collapse} from "@mui/material";
import {t} from "../../translations/translations";

export default function MessageItem({message}) {
  const store = useStore()
  const history = useHistory()
  const [displayTime, setDisplayTime] = useState(false)


  const id = useSelector(state => state.id)
  const lang = useSelector(state => state.lang)

  return (
    <>
      {message.idSender == id ? (
        <div className="message message--my">
          <div>
            <Collapse in={displayTime} className="message__time">
              <div style={{marginBottom: 4}}>
                {displayTimeV2(message.createdAt)}
              </div>
            </Collapse>
            <div className="message__block message__block--my" onClick={() => setDisplayTime(!displayTime)}>
              {message.message.startsWith('LINKTOPOST') ? (
                <span className="message__block__link"
                      onClick={() => history.push('/post/' + message.message.split('|')[1])}>{t.linkToPost[lang]}</span>
              ) : (
                message.message
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="message message--other">
          <div>
            <Collapse in={displayTime} className="message__time">
              <div style={{marginBottom: 4}}>
                {displayTimeV2(message.createdAt)}
              </div>
            </Collapse>
            <div className="message__block message__block--other" onClick={() => setDisplayTime(!displayTime)}>
              {message.message.startsWith('LINKTOPOST') ? (
                <span className="message__block__link"
                      onClick={() => history.push('/post/' + message.message.split('|')[1])}>{t.linkToPost[lang]}</span>
              ) : (
                message.message
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
