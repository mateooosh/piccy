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
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
    >
      {actions.map((action, index) =>
        <div key={index} className="popover__item" onClick={action.onClick.bind(this, true)}>
          {action.title}
        </div>
      )}
    </Popover>
  )
}