import React, {useEffect, useState} from 'react'
import './MessagesDrawer.scss'
import {useSelector, useStore} from "react-redux"
import {useHistory} from "react-router-dom"
import {Drawer} from "@mui/material"

export default function MessagesDrawer({open, setOpen, children}) {

  const store = useStore()
  const history = useHistory()

  const id = useSelector(state => state.id)

  return (
    <Drawer
      className="drawer__content"
      anchor="left"
      open={open}
      onClose={() => setOpen(false)}
    >
      {children}
    </Drawer>
  )
}
