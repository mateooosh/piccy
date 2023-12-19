import React from 'react'
import './MessagesDrawer.scss'
import {Drawer} from "@mui/material"

export default function MessagesDrawer({open, setOpen, children}) {

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
