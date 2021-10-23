import React from 'react'
import {Popover} from "@mui/material"
import './ActionMenu.scss'

export default function ActionMenu({id, open, anchorEl, onClose, actions}) {

  return (
    <Popover
      className="popover"
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
    >
      {actions.map((action, index) =>
        <div key={index} className="popover__item">
          {action}
        </div>
      )}
    </Popover>
  )
}