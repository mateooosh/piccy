import React, {useEffect, useState} from 'react'
import './Post.scss'

import variables from '../../styles/variables.module.scss';
import {displayTime} from '../../functions/functions';

import {useStore} from "react-redux"
import {Avatar, Drawer, ListItem, ListItemIcon, ListItemText, Popover} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import ShareIcon from '@mui/icons-material/Share';

import {t} from "../../translations/translations";
import ActionMenu from "../action-menu/ActionMenu";

export default function Post(props) {
  const store = useStore()

  const [photo, setPhoto] = useState(null)
  const [post, setPost] = useState(null)
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  useEffect(() => {
    setPost(props.post);
    getPhoto(props.post.id)
  }, [])

  function getPhoto(id) {
    const url = `${process.env.REACT_APP_API_URL}/posts/${id}/photo?token=${store.getState().token}`;

    fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log('photo', response)
        setPhoto(response.photo)
      })
      .catch(err => console.log(err))
  }

  function likePost(idUser, idPost, index) {
    const url = `${process.env.REACT_APP_API_URL}/likes`;
    console.log(JSON.stringify({idUser: idUser, idPost: idPost}));
    fetch(url, {
      method: "POST",
      body: JSON.stringify({idUser: idUser, idPost: idPost, token: store.getState().token}),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(response => {
        let deepCopy = JSON.parse(JSON.stringify(post));
        deepCopy.likes++;
        deepCopy.liked = 1;
        setPost(deepCopy);

        // animateHeartIcon();
      })
      .catch((err) => console.log(err));
  }

  function dislikePost(idUser, idPost, index) {
    const url = `${process.env.REACT_APP_API_URL}/likes`;
    fetch(url, {
      method: "DELETE",
      body: JSON.stringify({idUser: idUser, idPost: idPost, token: store.getState().token}),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        let deepCopy = JSON.parse(JSON.stringify(post));
        deepCopy.likes--;
        deepCopy.liked = 0;
        setPost(deepCopy);
      })
      .catch((err) => console.log(err));
  }

  const image = "data:image/jpeg;base64,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"

  return (
    <div className="post">
      {post &&
      <>
        <div className="post__header">
          <div className="post__badge">
            <Avatar className="post__avatar" src={image}></Avatar>
          </div>
          <div className="post__details">
            <div className="post__details__username">{post.username}</div>
            <div className="post__details__date">{displayTime(post.uploadDate, 'en', t)}</div>
          </div>
          <div className="post__more">
            <MoreVertIcon onClick={handleClick} fontSize="large"/>
            <ActionMenu id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        actions={['Remove post', 'Report post', 'Download photo']}/>
            <Popover
              className="popover"

              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <div className="popover__item">
                Report post
              </div>
              <div className="popover__item">
                Remove post
              </div>
              <div className="popover__item">
                Download photo
              </div>
            </Popover>

          </div>
        </div>

        <div className="post__image">
          <img width="100%" src={photo}/>
        </div>

        <div className="post__actions">
          {post.liked ? (
            <FavoriteIcon onClick={dislikePost.bind(this, store.getState().id, post.id, props.idx)}
                          className="post__icon" sx={{fontSize: 30, color: 'red'}}/>
          ) : (
            <FavoriteBorderIcon onClick={likePost.bind(this, store.getState().id, post.id, props.idx)}
                                className="post__icon" sx={{fontSize: 30}}/>
          )
          }
          <SmsOutlinedIcon className="post__icon" sx={{fontSize: 30}}/>
          <ShareIcon className="post__icon" sx={{fontSize: 30}}/>
        </div>

        <div className="post__stats">
          <div className="post__likes">
            {post.likes} likes
          </div>
          <div className="post__comments">
            {post.comments} comments
          </div>
        </div>

        <div className="post__bottom">
          <span className="post__bottom__username">{post.username} </span>
          <span className="post__bottom__description">
            {post.description.split(" ").map((word, index) => {
              if (word.charAt(0) === "#")
                return (
                  <span
                    key={index}
                    style={{color: variables['primary-main'], fontWeight: '600'}}
                  >
                    {word}{" "}
                  </span>
                )
              else if (word.charAt(0) === "@")
                return (
                  <span
                    key={index}
                    style={{color: variables['primary-main'], fontWeight: '600'}}
                  >
                    {word}{" "}
                  </span>
                );
              else return <span key={index}>{word} </span>
            })}
          </span>
        </div>
      </>
      }

    </div>
  )
}