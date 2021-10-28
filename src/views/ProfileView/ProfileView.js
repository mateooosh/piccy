import React, {useEffect, useState} from 'react'
import './ProfileView.scss'

import {useStore} from "react-redux"
import {Avatar, Button, CircularProgress} from "@mui/material"
import {useHistory, useParams} from "react-router-dom"
import Navbar from "../../components/navbar/Navbar";

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


  return (
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
                    className="profile__actions__button profile__actions__button--disabled">
              Following
            </Button>
          ) : (
            <Button variant="contained" disableRipple className="profile__actions__button">
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
  )
}