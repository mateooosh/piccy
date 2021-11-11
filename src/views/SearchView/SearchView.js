import React, {useEffect, useState} from 'react'
import './SearchView.scss'

import {useStore} from "react-redux"
import {useHistory} from "react-router-dom"
import {Close} from "@mui/icons-material"
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {Box, Tabs} from "@mui/material"
import User from "../../components/user/User";

export default function SearchView() {

  const store = useStore()
  const history = useHistory()

  const [query, setQuery] = useState('')

  const [accounts, setAccounts] = useState([])
  const [tags, setTags] = useState([])

  const [time, setTime] = useState(setTimeout(() => {
  }, 0))

  const [tab, setTab] = React.useState('1')

  const handleChange = (event, newValue) => {
    setTab(newValue)
  }

  useEffect(() => {
    clearTimeout(time)
    if (tab == 1) {
      getAccounts()
    } else if (tab == 2) {
      getTags()
    }

  }, [tab])

  useEffect(() => {
    console.log(query, tab)
    clearTimeout(time)
    if (tab == 1) {
      setTime(setTimeout(getAccounts, 250))
    } else if (tab == 2) {
      setTime(setTimeout(getTags, 250))
    }

    return () => clearTimeout(time)
  }, [query])


  function getAccounts() {
    const url = `${process.env.REACT_APP_API_URL}/users/${query}?token=${store.getState().token}`
    console.log(url)
    fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log('search accounts: ', response)
        setAccounts(response)
      })
      .catch(err => console.log(err))
  }

  function getTags() {
    // console.log(API_URL)
    const url = `${process.env.REACT_APP_API_URL}/tags?query=${query.replace('#', '')}&token=${store.getState().token}`
    fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log('tags', response)
        setTags(response)
      })
      .catch(err => console.log(err))
  }


  return (
    <div style={{width: '100%', overflowY: 'auto'}}>
      <div className="search">
        <div className="search__top">
          <input value={query}
                 onChange={e => setQuery(e.target.value)}
                 className="search__input" type="text" placeholder="Type here..."/>
          <Close className="search__reset" onClick={() => setQuery('')}/>
        </div>

        <TabContext value={tab}>
          <Box sx={{borderBottom: 1, borderColor: 'divider', width: '100%'}}>
            <Tabs value={tab} onChange={handleChange}>
              <Tab label="Accounts" value="1" sx={{width: '50%'}}/>
              <Tab label="Tags" value="2" sx={{width: '50%'}}/>
            </Tabs>
          </Box>
          <TabPanel value="1" style={{width: '100%', padding: 0}}>
            {accounts.map((user, index) =>
              <User key={index} user={user}/>
            )}
          </TabPanel>

          <TabPanel value="2" sx={{width: '100%', padding: '4px 24px'}}>
            {tags.map((tag, index) =>
              <div key={index} className="search__tag">
                <span onClick={() => history.push(`tag/${tag.replace('#', '')}`)}>{tag}</span>
              </div>
            )}
          </TabPanel>
        </TabContext>
      </div>
    </div>
  )
}