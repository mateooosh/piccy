import React, {useEffect} from 'react'
import './AdminDashboard.scss'

import {useSelector, useStore} from "react-redux"
import {useHistory} from "react-router-dom"
import {
  Avatar,
  CircularProgress,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material"

import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import ReportIcon from '@mui/icons-material/Report'
import BugReportIcon from '@mui/icons-material/BugReport'
import AdminUsers from "../../components/admin-users/AdminUsers";
import AdminPosts from "../../components/admin-posts/AdminPosts";
import AdminReportsPosts from "../../components/admin-reports-posts/AdminReportsPosts";
import AdminReportsBugs from "../../components/admin-reports-bugs/AdminReportsBugs";
import {t} from "../../translations/translations";

export default function AdminDashboard() {

  const store = useStore()
  const history = useHistory()
  const lang = useSelector(state => state.lang)

  const [openReports, setOpenReports] = React.useState(false)
  const [selected, setSelected] = React.useState('Users')
  const [profile, setProfile] = React.useState(null)
  const [loadingProfile, setLoadingProfile] = React.useState(false)

  const handleClick = () => {
    setOpenReports(!openReports)
  }

  const handleListItemClick = (event, value) => {
    setSelected(value)
  }

  useEffect(() => {
    getAccount()
  }, [])

  function getAccount() {
    const url = `${process.env.REACT_APP_API_URL}/users?idUser=${store.getState().id}&token=${store.getState().token}`
    setLoadingProfile(true)
    fetch(url)
      .then(response => response.json())
      .then(response => {
        setProfile(response[0])
        console.log(response[0])
      })
      .catch(err => console.log(err))
      .finally(() => setLoadingProfile(false))
  }

  return (
    <div className="dashboard">
      <div className="dashboard__nav">
        <img className="dashboard__nav__logo" src="piccy.svg" alt="Piccy" onClick={() => history.push('')}/>
        <Divider/>
        <div className="dashboard__nav__profile">
          {profile !== null &&
          <>
            <Avatar className="dashboard__nav__avatar" src={profile.photo} onClick={() => history.push('/account')}/>
            <div className="dashboard__nav__username">{profile.username}</div>
            <div className="dashboard__nav__email">{profile.email}</div>
          </>
          }
          {loadingProfile &&
          <CircularProgress className="dashboard__nav__indicator" size={60}/>
          }
        </div>
        <Divider/>

        <List
          sx={{width: '100%'}}
          disablePadding
        >
          <ListItemButton selected={selected === 'Users'} onClick={(event) => handleListItemClick(event, 'Users')}>
            <ListItemIcon>
              <PeopleAltIcon/>
            </ListItemIcon>
            <ListItemText primary={t.users[lang]}/>
          </ListItemButton>
          <Divider/>
          <ListItemButton selected={selected === 'Posts'} onClick={(event) => handleListItemClick(event, 'Posts')}>
            <ListItemIcon>
              <PhotoLibraryIcon/>
            </ListItemIcon>
            <ListItemText primary={t.posts[lang]}/>
          </ListItemButton>
          <Divider/>
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <ReportIcon/>
            </ListItemIcon>
            <ListItemText primary={t.reports[lang]}/>
            {openReports ? <ExpandLess/> : <ExpandMore/>}
          </ListItemButton>
          <Collapse in={openReports} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{pl: 4}} selected={selected === 'Reports|Posts'}
                              onClick={(event) => handleListItemClick(event, 'Reports|Posts')}>
                <ListItemIcon>
                  <PhotoLibraryIcon/>
                </ListItemIcon>
                <ListItemText primary={t.posts[lang]}/>
              </ListItemButton>
              <Divider/>
              <ListItemButton sx={{pl: 4}} selected={selected === 'Reports|Bugs'}
                              onClick={(event) => handleListItemClick(event, 'Reports|Bugs')}>
                <ListItemIcon>
                  <BugReportIcon/>
                </ListItemIcon>
                <ListItemText primary={t.bugs[lang]}/>
              </ListItemButton>
            </List>

          </Collapse>
        </List>
        <Divider/>

      </div>
      <div className="dashboard__content">
        {selected === 'Users' &&
        <AdminUsers/>
        }

        {selected === 'Posts' &&
        <AdminPosts/>
        }

        {selected === 'Reports|Posts' &&
        <AdminReportsPosts/>
        }

        {selected === 'Reports|Bugs' &&
        <AdminReportsBugs/>
        }
      </div>
    </div>
  )
}