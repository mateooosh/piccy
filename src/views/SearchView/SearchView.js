import React, {useEffect, useState} from 'react'
import './SearchView.scss'

import {useStore} from "react-redux"

export default function SearchView() {
  const store = useStore()

  return (
    <div className="search">Search</div>
  )
}