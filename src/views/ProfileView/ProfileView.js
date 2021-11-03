import React, {useEffect, useState} from 'react'
import './ProfileView.scss'

import {useStore} from "react-redux"
import {Avatar, Button, CircularProgress} from "@mui/material"
import {useHistory, useParams} from "react-router-dom"

export default function ProfileView() {

  const store = useStore()
  const history = useHistory()
  const {username} = useParams()

  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])


  useEffect(() => {
    //if this is my account
    if (username === store.getState().username) {
      console.log('my account')
      history.push('/account')
      return
    } else {
      setLoading(true)
      // get information about profile
      const url = `${process.env.REACT_APP_API_URL}/users?username=${username}&myIdUser=${store.getState().id}&token=${store.getState().token}`
      fetch(url)
        .then((response) => response.json())
        .then((response) => {
          console.log(response)
          setProfile(response[0])

          // get user's posts
          fetch(`${process.env.REACT_APP_API_URL}/posts?username=${username}&onlyUserPosts=true&token=${store.getState().token}`)
            .then((response) => response.json())
            .then((response) => {
              console.log(response)
              setPosts(response)
            })
            .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false))
    }
  }, [])

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


  return (
    <div style={{width: '100%', overflowY: 'auto'}}>
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
              <div className="profile__stats__type">Posts</div>
            </div>

            <div>
              <div className="profile__stats__amount">{profile.followers}</div>
              <div className="profile__stats__type">Followers</div>
            </div>

            <div>
              <div className="profile__stats__amount">{profile.following}</div>
              <div className="profile__stats__type">Following</div>
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
                Following
              </Button>
            ) : (
              <Button variant="contained"
                      disableRipple className="profile__actions__button"
                      onClick={follow.bind(this, store.getState().id, profile.id)}>
                Follow
              </Button>
            )}

            <Button variant="contained" disableRipple className="profile__actions__button">
              Message
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
          </div>
        </>
        }
      </div>
    </div>
  )
}