import React from 'react'
import './User.scss'
import {useHistory} from "react-router-dom"
import {Avatar} from "@mui/material";

export default function User({user}) {

  const history = useHistory()

  function pushToAccount() {
    history.push(`/${user.username}`)
  }

  return (
    <div className="user" onClick={pushToAccount}>
      <Avatar className="user__avatar" src={user.photo || user.userPhoto}/>
      <div className="user__details">
        <div className="user__username">{user.username}</div>
        <div className="user__name">{user.name}</div>
      </div>
      <div className="user__stats">
        <div className="user__followers-amount">{user.followers || 0}</div>
        <div className="user__label">Followers</div>
      </div>
    </div>
  )
}
