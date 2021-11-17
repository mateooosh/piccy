import React, {useEffect, useState} from 'react'
import './AccountView.scss'

import {useStore} from "react-redux"
import {Avatar, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material"
import {useHistory} from "react-router-dom"
import EditProfileDialog from "../../components/edit-profile-dialog/EditProfileDialog";
import User from "../../components/user/User";

export default function AccountView() {

  const store = useStore()
  const history = useHistory()

  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])

  const [follows, setFollows] = useState([])
  const [titleOfDialog, setTitleOfDialog] = useState('')
  const [emptyFollows, setEmptyFollows] = useState(false)
  const [loadingFollows, setLoadingFollows] = useState(false)

  const [editProfileIsOpen, setEditProfileIsOpen] = useState(false)
  const [followsDialogOpen, setFollowsDialogOpen] = useState(false)

  useEffect(() => {
    getProfile()
  }, [])

  useEffect(() => {
    console.log(followsDialogOpen)
    if (!followsDialogOpen) {
      setFollows([])
      setTitleOfDialog('')
      setEmptyFollows(false)
    }
  }, [followsDialogOpen])

  function onFollowersClick() {
    setFollowsDialogOpen(true)
    setTitleOfDialog('Followers')
    getFollows('followers')
  }

  function onFollowingClick() {
    setFollowsDialogOpen(true)
    setTitleOfDialog('Following')
    getFollows('following')
  }

  function getFollows(type) {
    let url = `${process.env.REACT_APP_API_URL}/${type}/${profile.id}?token=${store.getState().token}`

    setFollows([])
    setLoadingFollows(true)
    setEmptyFollows(false)
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        setFollows(response)
        if(response.length === 0)
          setEmptyFollows(true)
        else
          setEmptyFollows(false)
      })
      .catch((err) => console.log(err))
      .finally(() => setLoadingFollows(false))
  }

  function getProfile() {
    const url = `${process.env.REACT_APP_API_URL}/users?idUser=${store.getState().id}&token=${store.getState().token}`
    setLoading(true)
    fetch(url)
      .then(response => response.json())
      .then(response => {
        setProfile(response[0])
        console.log(response[0])
        setLoading(false)
        fetch(`${process.env.REACT_APP_API_URL}/posts?idUser=${store.getState().id}&onlyUserPosts=true&token=${store.getState().token}`)
          .then(response => response.json())
          .then(response => {
            setPosts(response)
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }

  return (
    <div style={{width: '100%', overflowY: 'auto'}}>
      <div className="account">
        <EditProfileDialog profile={profile} open={editProfileIsOpen} setOpen={setEditProfileIsOpen}
                           getProfile={getProfile}/>

        {loading &&
        <CircularProgress className="account__indicator" size={60}/>
        }
        {profile !== null &&
        <>
          <Avatar className="account__avatar" src={profile.photo}></Avatar>
          <div className="account__username">{profile.username}</div>
          <div className="account__stats">
            <div>
              <div className="account__stats__amount">{profile.postsAmount}</div>
              <div className="account__stats__type">Posts</div>
            </div>

            <div onClick={onFollowersClick}>
              <div className="account__stats__amount">{profile.followers}</div>
              <div className="account__stats__type">Followers</div>
            </div>

            <div onClick={onFollowingClick}>
              <div className="account__stats__amount">{profile.following}</div>
              <div className="account__stats__type">Following</div>
            </div>
          </div>

          <div className="account__description">
            <div className="account__description__username">{profile.username}</div>
            <div>
              {profile.description}
            </div>
          </div>

          <div className="account__actions">
            <Button variant="contained"
                    disableRipple className="account__actions__button"
                    onClick={() => setEditProfileIsOpen(true)}>
              Edit profile
            </Button>
          </div>

          <div className="account__posts">
            <div className="account__posts__header">Posts</div>
            <div className="account__posts__content">
              {posts.map((post, index) =>
                <img src={post.photo} key={index} className="account__posts__content__item"
                     onClick={() => history.push(`/post/${post.id}`)}/>
              )}
            </div>
          </div>
        </>
        }

        <Dialog className="account__dialog" open={followsDialogOpen} onClose={() => setFollowsDialogOpen(false)}
                fullWidth maxWidth="xs">
          <DialogTitle className="account__dialog__title">{titleOfDialog}</DialogTitle>
          <DialogContent className="account__dialog__content">
            {loadingFollows && follows.length === 0 &&
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <CircularProgress className="account__dialog__indicator" size={60}/>
            </div>
            }

            {follows.map((user, idx) =>
              <User user={user} key={idx}/>
            )}
            {emptyFollows &&
              <div className="profile__dialog__error">No users found</div>
            }
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}