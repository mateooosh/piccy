import React, {useEffect, useState} from 'react'
import './AdminUsers.scss'
import {useSelector, useStore} from "react-redux"
import {useHistory} from "react-router-dom"
import User from "../user/User";

export default function AdminUsers() {

  const store = useStore()
  const history = useHistory()

  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)

  useEffect(() => {
    getUsers()

    return () => {
      setQuery('')
      setUsers([])
      setUsersLoading(false)
    }
  }, [])

  function getUsers() {
    const url = `${process.env.REACT_APP_API_URL}/users/${query}?token=${store.getState().token}`
    setUsersLoading(true)
    fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log('search accounts: ', response)
        setUsers(response)
      })
      .catch(err => console.log(err))
      .finally(() => setUsersLoading(false))
  }

  return (
    <div>
      {users.map(user =>
        <User key={user.id} user={user}/>
      )}
    </div>
  )
}
