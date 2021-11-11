import React, {useEffect, useState} from 'react'
import './User.scss'
import {useSelector, useStore} from "react-redux"
import {useHistory} from "react-router-dom"
import {Avatar} from "@mui/material";

export default function User({user}) {

  const store = useStore()
  const history = useHistory()


  return (
    <div className="user">
      <Avatar className="user__avatar" src={user.photo}/>
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
