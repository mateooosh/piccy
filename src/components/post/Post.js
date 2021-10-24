import React, {useEffect, useState} from 'react'
import './Post.scss'

import variables from '../../styles/variables.module.scss'
import {displayTime, validation} from '../../functions/functions'

import {useStore} from "react-redux"
import {
  Avatar,
  Dialog, DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from "@mui/material"
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined'
import ShareIcon from '@mui/icons-material/Share'

import {t} from "../../translations/translations"
import ActionMenu from "../action-menu/ActionMenu"
import {LoadingButton} from "@mui/lab"
import {useHistory} from "react-router-dom"

export default function Post(props) {
  const store = useStore()
  const history = useHistory()

  const [photo, setPhoto] = useState(null)
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [actions, setActions] = useState([])


  //reports
  const [reason, setReason] = useState('')
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [reportPostLoading, setReportPostLoading] = useState(false)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    if (reportDialogOpen)
      setAnchorEl(null)
    else
      setReason('')
  }, [reportDialogOpen])


  useEffect(() => {
    setPost(props.post)

    let arr = [{title: 'Report post', onClick: setReportDialogOpen}, {title: 'Download photo', onClick: () => null}]
    if (props.post.username === store.getState().username) {
      arr.unshift({title: 'Remove post', onClick: () => null})
    }
    setActions(arr)

    getComments(props.post.id)
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

  function getComments(id) {
    if (!props.homeScreen) {
      const url = `${process.env.REACT_APP_API_URL}/comments/${id}?token=${store.getState().token}`
      fetch(url)
        .then((response) => response.json())
        .then((response) => {
          console.log('comments', response)
          setComments(response)
        })
        .catch((err) => console.log(err))
    }
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

  function reportPost() {
    if(!allCorrect())
      return

    const url = `${process.env.REACT_APP_API_URL}/reports`;
    const obj = {
      idPost: post.id,
      idReporter: store.getState().id,
      reason: reason,
      token: store.getState().token
    }

    setReportPostLoading(true)
    fetch(url, {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(response => {
        console.log(response.message)
        alert(response.message)
      })
      .catch(err => console.log(err))
      .finally(() => {
        setReportDialogOpen(false)
        setReportPostLoading(false)
      })
  }

  function handleClickPhoto() {
    if(props.homeScreen) {
      history.push(`/post/${post.id}`)
    }
  }

  function pushToProfile() {
    history.push(`/${post.username}`)
  }

  function allCorrect() {
    return validation.min6Chars(reason)
  }

  function getButtonClasses() {
    return (allCorrect()) ? 'post__dialog__button' : 'post__dialog__button post__dialog__button--disabled'
  }

  return (
    <div className="post">
      {post &&
      <>
        <div className="post__header">
          <div className="post__badge">
            <Avatar onClick={pushToProfile} className="post__avatar" src={post.userPhoto}></Avatar>
          </div>
          <div className="post__details">
            <div onClick={pushToProfile} className="post__details__username">{post.username}</div>
            <div className="post__details__date">{displayTime(post.uploadDate, 'en', t)}</div>
          </div>
          <div className="post__more">
            <MoreVertIcon onClick={handleClick} fontSize="large"/>
            <ActionMenu id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        actions={actions}/>
          </div>
        </div>

        <div className="post__image">
          <img onClick={handleClickPhoto} width="100%" src={photo} className={props.homeScreen ? 'post__image--cursor' : ''}/>
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

          {comments.length !== 0 &&
          <div className="post__bottom__comments">
            <div className="post__bottom__comments__header">
              Comments
            </div>
            {comments.map((comment, index) =>
              <div key={index}>
                <span className="post__bottom__comments__username">{comment.username} </span>{comment.content}
              </div>
            )}
          </div>
          }

        </div>
      </>
      }

      <Dialog className="post__dialog" open={reportDialogOpen} onClose={() => setReportDialogOpen(false)}>
        <DialogTitle className="post__dialog__title">Report post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Type here what is the reason, that You want to report this post
          </DialogContentText>
          <TextField
            className="post__dialog__input"
            autoFocus
            label="Reason"
            fullWidth
            variant="standard"
            multiline
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                reportPost()
                ev.preventDefault()
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton className="post__dialog__button post__dialog__button--outlined" loading={false}
                         onClick={setReportDialogOpen.bind(this, false)} variant="outlined" disableRipple>
            Cancel
          </LoadingButton>

          <LoadingButton loading={reportPostLoading}
                         onClick={reportPost} variant="contained" disableRipple disabled={!allCorrect()} className={getButtonClasses()}>
            Report
          </LoadingButton>
        </DialogActions>
      </Dialog>

    </div>
  )
}