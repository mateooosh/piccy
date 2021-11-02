import React, {useEffect, useState} from 'react'
import './SettingsView.scss'

import {useStore} from "react-redux"

export default function SettingsView() {
  const store = useStore()

  return (
    <div className="settings">Settings</div>
  )
}