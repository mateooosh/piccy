import React, {useEffect, useState} from 'react'
import './ProfileView.scss'

import {useSelector, useStore} from "react-redux"
import {Avatar, Button, CircularProgress, Dialog, DialogContent, DialogTitle} from "@mui/material"
import {useHistory, useParams} from "react-router-dom"
import User from "../../components/user/User"
import {useSnackbar} from "notistack"
import DataLoadStatus from "../../components/data-load-status/DataLoadStatus";
import {checkStatus} from "../../functions/functions";
import {t} from "../../translations/translations";

export default function ProfileView() {

  const store = useStore()
  const history = useHistory()
  const {enqueueSnackbar} = useSnackbar()
  const {username} = useParams()
  const lang = useSelector(state => state.lang)

  const [error, setError] = useState(null)
  const [hasError, setHasError] = useState(false)

  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [emptyPosts, setEmptyPosts] = useState(false)

  const [follows, setFollows] = useState([])
  const [titleOfDialog, setTitleOfDialog] = useState('')
  const [emptyFollows, setEmptyFollows] = useState(false)
  const [loadingFollows, setLoadingFollows] = useState(false)
  const [followsDialogOpen, setFollowsDialogOpen] = useState(false)

  useEffect(() => {
    //if this is my account
    if (username === store.getState().username) {
      console.log('my account')
      history.push('/account')
      return
    } else {
      setLoading(true)
      setProfile(null)
      setPosts([])
      // get information about profile
      const url = `${process.env.REACT_APP_API_URL}/users?username=${username}&myIdUser=${store.getState().id}&token=${store.getState().token}`
      fetch(url)
        .then(res => checkStatus(res))
        .then(response => {
          console.log(response)

          setProfile(response[0])
          setLoadingFollows(true)
          setEmptyFollows(false)
          setLoadingPosts(true)

          // get user's posts
          fetch(`${process.env.REACT_APP_API_URL}/posts?username=${username}&onlyUserPosts=true&token=${store.getState().token}`)
            .then(res => checkStatus(res))
            .then(response => {
              console.log(response)
              setPosts(response)
              if(response.length === 0) {
                setEmptyPosts(true)
              }
            })
            .catch(err => console.log(err))
            .finally(() => setLoadingPosts(false))
        })
        .catch(err => {
          setError(err)
          setHasError(true)
        })
        .finally(() => setLoading(false))
    }
  }, [username])

  useEffect(() => {
    if (!followsDialogOpen) {
      setFollows([])
      setTitleOfDialog('')
      setEmptyFollows(false)
    }
  }, [followsDialogOpen])

  function onFollowersClick() {
    setFollowsDialogOpen(true)
    setTitleOfDialog(t.followers2[lang])
    getFollows('followers')
  }

  function onFollowingClick() {
    setFollowsDialogOpen(true)
    setTitleOfDialog(t.following2[lang])
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

  //follow user
  function follow(idUser, idFollower) {
    console.log(idUser, idFollower)

    let deepCopy = JSON.parse(JSON.stringify(profile))
    deepCopy.amIFollowing = 1
    deepCopy.followers++
    setProfile(deepCopy)

    const url = `${process.env.REACT_APP_API_URL}/users/${idUser}/follow/${idFollower}?token=${store.getState().token}`
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response.message)
      })
      .catch((err) => console.log(err))
  }

  // unfollow user
  function unfollow(idUser, idFollower) {
    let deepCopy = JSON.parse(JSON.stringify(profile))
    console.log(deepCopy)
    deepCopy.amIFollowing = 0
    deepCopy.followers--
    setProfile(deepCopy)

    const url = `${process.env.REACT_APP_API_URL}/users/${idUser}/follow/${idFollower}?token=${store.getState().token}`
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response.message)
      })
      .catch((err) => console.log(err))
  }

  function pushToMessages() {
    history.push({
      pathname: '/messages',
      state: {
        idUser: profile.id,
        avatar: profile.photo,
        username: profile.username
      }
    })
  }


  return (
    <div style={{width: '100%', overflowY: 'auto'}}>
      <DataLoadStatus hasError={hasError} status={error?.status} statusText={error?.statusText}/>
      <div className="profile">
        {loading &&
        <CircularProgress className="profile__indicator" size={60}/>
        }
        {profile !== null &&
        <>
          <Avatar className="profile__avatar" src={profile.photo}></Avatar>
          <div className="profile__username">{profile.username}</div>
          <div className="profile__stats">
            <div>
              <div className="profile__stats__amount">{profile.postsAmount}</div>
              <div className="profile__stats__type">{t.posts2[lang]}</div>
            </div>

            <div  onClick={onFollowersClick}>
              <div className="profile__stats__amount">{profile.followers}</div>
              <div className="profile__stats__type">{t.followers[lang]}</div>
            </div>

            <div  onClick={onFollowingClick}>
              <div className="profile__stats__amount">{profile.following}</div>
              <div className="profile__stats__type">{t.following[lang]}</div>
            </div>
          </div>

          <div className="profile__description">
            <div className="profile__description__username">{profile.username}</div>
            <div>
              {profile.description}
            </div>
          </div>

          <div className="profile__actions">
            {profile.amIFollowing ? (
              <Button variant="contained" disableRipple
                      className="profile__actions__button profile__actions__button--disabled"
                      onClick={unfollow.bind(this, store.getState().id, profile.id)}>
                {t.following3[lang]}
              </Button>
            ) : (
              <Button variant="contained"
                      disableRipple className="profile__actions__button"
                      onClick={follow.bind(this, store.getState().id, profile.id)}>
                {t.follow[lang]}
              </Button>
            )}

            <Button onClick={pushToMessages} variant="contained" disableRipple className="profile__actions__button">
              {t.message[lang]}
            </Button>
          </div>

          <div className="profile__posts">
            <div className="profile__posts__header">Posts</div>
            <div className="profile__posts__content">
              {posts.map((post, index) =>
                <img src={post.photo} key={index} className="profile__posts__content__item"
                     onClick={() => history.push(`/post/${post.id}`)}/>
              )}
            </div>

            {loadingPosts &&
            <CircularProgress className="profile__indicator" size={60}/>
            }

            {emptyPosts &&
            <div className="profile__posts__empty">{t.userHasNoPosts[lang]}</div>
            }
          </div>
        </>
        }

        <Dialog className="profile__dialog" open={followsDialogOpen} onClose={() => setFollowsDialogOpen(false)}
                fullWidth maxWidth="xs">
          <DialogTitle className="profile__dialog__title">{titleOfDialog}</DialogTitle>
          <DialogContent className="profile__dialog__content">
            {loadingFollows && follows.length === 0 &&
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <CircularProgress className="profile__dialog__indicator" size={60}/>
            </div>
            }

            {follows.map((user, idx) =>
              <User user={user} key={idx} setFollowsDialogOpen={setFollowsDialogOpen}/>
            )}

            {emptyFollows &&
            <div className="profile__dialog__error">{t.noUsersFound[lang]}</div>
            }
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}