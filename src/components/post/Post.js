import React, {useEffect, useRef, useState} from 'react'
import './Post.scss'

import variables from '../../styles/variables.module.scss'
import {displayTime, validation} from '../../functions/functions'

import {useSelector, useStore} from "react-redux"
import {
  Avatar, CircularProgress,
  Dialog, DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Skeleton
} from "@mui/material"
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined'
import ShareIcon from '@mui/icons-material/Share'
import ReportGmailerrorredRoundedIcon from '@mui/icons-material/ReportGmailerrorredRounded'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'

import {t} from "../../translations/translations"
import ActionMenu from "../action-menu/ActionMenu"
import {LoadingButton} from "@mui/lab"
import {useHistory} from "react-router-dom"
import SendIcon from "@mui/icons-material/Send"
import {useSnackbar} from "notistack"
import {io} from "socket.io-client"

export default function Post(props) {
  const store = useStore()
  const history = useHistory()
  const lang = useSelector(state => state.lang)

  const postRef = useRef()

  const [commentInputVisible, setCommentInputVisible] = useState(false)
  const [commentInput, setCommentInput] = useState('')

  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(postRef.current.scrollWidth)
  }, [postRef])

  const [photo, setPhoto] = useState(null)
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [channels, setChannels] = useState([])
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [actions, setActions] = useState([])
  const {enqueueSnackbar} = useSnackbar()


  //reports
  const [reason, setReason] = useState('')
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [reportPostLoading, setReportPostLoading] = useState(false)

  //sharing posts
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [loadingChannels, setLoadingChannels] = useState(false)

  // removing post
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)


  const [socket, setSocket] = useState(null)


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  useEffect(() => {
    if (reportDialogOpen)
      setAnchorEl(null)
    else
      setReason('')
  }, [reportDialogOpen])

  useEffect(() => {
    if (removeDialogOpen)
      setAnchorEl(null)
  }, [removeDialogOpen])


  const refPhoto = useRef(photo)
  useEffect(() => {
    refPhoto.current = photo
  }, [photo])


  useEffect(() => {
    setSocket(io(process.env.REACT_APP_API_URL_WS, {transports: ['websocket']}))

    setPost(props.post)
    let arr = [
      {
        title: <div style={{display: 'flex', alighItems: 'center', gap: 6}}><ReportGmailerrorredRoundedIcon/>{t.reportPost[lang]}</div>,
        onClick: setReportDialogOpen
      },
      {
        title: <div style={{display: 'flex', alighItems: 'center', gap: 6}}><FileDownloadOutlinedIcon/>{t.downloadPhoto[lang]}
        </div>,
        onClick: () => {
          if(refPhoto.current) {
            const a = document.createElement("a")
            a.href = refPhoto.current
            a.download = `post_${props.post.id}.png`
            a.click()
            setAnchorEl(null)
          }
        }
      }]
    if (props.post.username === store.getState().username) {
      arr.unshift({
        title: <div style={{display: 'flex', alighItems: 'center', gap: 6}}><DeleteOutlinedIcon/>{t.removePost[lang]}</div>,
        onClick: setRemoveDialogOpen
      })
    }
    setActions(arr)

    getComments(props.post.id)
    getPhoto(props.post.id)
  }, [])

  function getPhoto(id) {
    const url = `${process.env.REACT_APP_API_URL}/posts/${id}/photo`

    fetch(url, {
      headers: {
        'x-access-token': store.getState().token
      }
    })
      .then(response => response.json())
      .then(response => {
        // console.log('photo', response)
        setPhoto(response.photo)
      })
      .catch(err => console.log(err))
  }

  function getComments(id) {
    if (!props.homeScreen) {
      const url = `${process.env.REACT_APP_API_URL}/comments/${id}`
      fetch(url, {
        headers: {
          'x-access-token': store.getState().token
        }
      })
        .then((response) => response.json())
        .then((response) => {
          console.log('comments', response)
          setComments(response)
        })
        .catch((err) => console.log(err))
    }
  }

  function likePost(idUser, idPost, index) {
    const url = `${process.env.REACT_APP_API_URL}/likes`
    console.log(JSON.stringify({idUser: idUser, idPost: idPost}))
    fetch(url, {
      method: "POST",
      body: JSON.stringify({idUser: idUser, idPost: idPost, token: store.getState().token}),
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': store.getState().token
      }
    })
      .then((response) => response.json())
      .then(response => {
        let deepCopy = JSON.parse(JSON.stringify(post))
        deepCopy.likes++
        deepCopy.liked = 1
        setPost(deepCopy)

        // animateHeartIcon()
      })
      .catch((err) => console.log(err))
  }

  function dislikePost(idUser, idPost, index) {
    const url = `${process.env.REACT_APP_API_URL}/likes`
    fetch(url, {
      method: "DELETE",
      body: JSON.stringify({idUser: idUser, idPost: idPost, token: store.getState().token}),
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': store.getState().token
      }
    })
      .then((response) => response.json())
      .then((response) => {
        let deepCopy = JSON.parse(JSON.stringify(post))
        deepCopy.likes--
        deepCopy.liked = 0
        setPost(deepCopy)
      })
      .catch((err) => console.log(err))
  }

  function reportPost() {
    if (!allCorrect())
      return

    const url = `${process.env.REACT_APP_API_URL}/reports`
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
        'Content-Type': 'application/json',
        'x-access-token': store.getState().token
      }
    })
      .then(response => response.json())
      .then(response => {
        console.log(response.message)
        enqueueSnackbar(response.message[lang], {
          variant: 'success'
        })
      })
      .catch(err => console.log(err))
      .finally(() => {
        setReportDialogOpen(false)
        setReportPostLoading(false)
      })
  }

  function removePost() {
    console.log('remove')
    setRemoveDialogOpen(false)

    const url = `${process.env.REACT_APP_API_URL}/posts/${post.id}`
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': store.getState().token
      }
    })
      .then(response => response.json())
      .then(response => {
        setRemoveDialogOpen(false)
        enqueueSnackbar(response.message[lang], {
          variant: 'success'
        })
        history.push('/')
      })
      .catch(() => enqueueSnackbar(t.somethingWentWrong[lang]), {
        variant: 'error'
      })
  }

  function createComment() {
    const url = `${process.env.REACT_APP_API_URL}/comments/${post.id}`
    const obj = {
      idUser: store.getState().id,
      content: commentInput,
      token: store.getState().token
    }

    fetch(url, {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': store.getState().token
      }
    })
      .then(response => response.json())
      .then(response => {
        enqueueSnackbar(response.message[lang])
      })
      .catch(err => console.log(err))
      .finally(() => {
        setCommentInput('')
        setCommentInputVisible(false)

        let deepCopy = JSON.parse(JSON.stringify(post))
        deepCopy.comments++
        setPost(deepCopy)
        getComments(props.post.id)
      })
  }

  function getChannels() {
    setLoadingChannels(true)
    const url = `${process.env.REACT_APP_API_URL}/channels?idUser=${store.getState().id}`
    fetch(url,
      {
        headers: {
          'x-access-token': store.getState().token
        }
      })
      .then(response => response.json())
      .then(response => {
        console.log(response)
        setChannels(response)
      })
      .catch(err => console.log(err))
      .finally(() => setLoadingChannels(false))
  }

  function onShareClicked() {
    setShareDialogOpen(true)
    getChannels()
  }

  function sharePost (idUser, idChannel) {
    const obj = {
      message: `LINKTOPOST|${post.id}`,
      idSender: store.getState().id,
      idReciever: idUser,
      idChannel: idChannel,
      createdAt: new Date()
    }

    socket.emit('message-from-user', obj)

    setShareDialogOpen(false)
    enqueueSnackbar(t.postHasBeenShared[lang])
  }

  function handleClickPhoto() {
    if (props.homeScreen) {
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
    return (allCorrect()) ? 'post__report__button' : 'post__report__button post__report__button--disabled'
  }

  return (
    <div className="post" ref={postRef}>
      {post &&
      <>
        <div className="post__header">
          <div className="post__badge">
            <Avatar onClick={pushToProfile} className="post__avatar" src={post.userPhoto}></Avatar>
          </div>
          <div className="post__details">
            <div onClick={pushToProfile} className="post__details__username">{post.username}</div>
            <div className="post__details__date">{displayTime(post.uploadDate, lang, t)}</div>
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

          {photo ? (
            <img onClick={handleClickPhoto} width="100%" src={photo}
                 className={props.homeScreen ? 'post__image--cursor' : ''}/>
          ) : (
            <Skeleton variant="rectangular" width={width} height={width}/>
          )}

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
          <SmsOutlinedIcon className="post__icon" sx={{fontSize: 30}}
                           onClick={() => setCommentInputVisible(!commentInputVisible)}/>
          <ShareIcon className="post__icon" sx={{fontSize: 30}} onClick={onShareClicked}/>
        </div>

        <div className="post__stats">
          <div className="post__likes">
            {post.likes} {t.likes[lang]}
          </div>
          <div className="post__comments">
            {post.comments} {t.comments[lang]}
          </div>
        </div>

        <div className="post__bottom">
          <span className="post__bottom__username"
                onClick={() => history.push(`/${post.username === store.getState().username ? 'account' : post.username}`)}>{post.username} </span>
          <span className="post__bottom__description">
            {post.description.split(" ").map((word, index) => {
              if (word.charAt(0) === "#")
                return (
                  <span
                    key={index}
                    className="post__bottom__description__tag"
                    onClick={() => history.push(`/tag/${word.replace('#', '')}`)}
                  >
                    {word}{" "}
                  </span>
                )
              else if (word.charAt(0) === "@")
                return (
                  <span
                    key={index}
                    className="post__bottom__description__tag"
                    onClick={() => history.push(`/${word === store.getState().username ? 'account' : post.username}`)}
                  >
                    {word}{" "}
                  </span>
                )
              else return <span key={index}>{word} </span>
            })}
          </span>

          {commentInputVisible &&
          <div className="post__bottom__input">
            <input
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              type="text" placeholder={t.typeHere[lang]}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  createComment()
                }
              }}/>
            <SendIcon className="post__bottom__send" onClick={createComment}/>
          </div>
          }

          {comments.length !== 0 &&
          <div className="post__bottom__comments">
            <div className="post__bottom__comments__header">
              {t.Comments[lang]}
            </div>
            {comments.map((comment, index) =>
              <div key={index}>
                <span className="post__bottom__comments__username"
                      onClick={() => history.push(`/${comment.username}`)}>{comment.username} </span>{comment.content}
              </div>
            )}
          </div>
          }

        </div>
      </>
      }

      <Dialog className="post__report" open={reportDialogOpen} onClose={() => setReportDialogOpen(false)}>
        <DialogTitle className="post__report__title">{t.reportPost[lang]}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t.typeHereWhatIsTheReasonReportPost[lang]}
          </DialogContentText>
          <TextField
            className="post__report__input"
            autoFocus
            label={t.reason[lang]}
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
          <LoadingButton className="post__report__button post__report__button--outlined" loading={false}
                         onClick={setReportDialogOpen.bind(this, false)} variant="outlined" disableRipple>
            {t.cancel[lang]}
          </LoadingButton>

          <LoadingButton loading={reportPostLoading}
                         onClick={reportPost} variant="contained" disableRipple disabled={!allCorrect()}
                         className={getButtonClasses()}>
            {t.report[lang]}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog className="post__remove" open={removeDialogOpen} onClose={() => setRemoveDialogOpen(false)}>
        <DialogTitle className="post__remove__title">{t.removePost[lang]}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t.areYouSureYouWantToRemoveThisPost[lang]}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton className="post__remove__button post__remove__button--outlined" loading={false}
                         onClick={setRemoveDialogOpen.bind(this, false)} variant="outlined" disableRipple>
            {t.cancel[lang]}
          </LoadingButton>

          <LoadingButton loading={reportPostLoading}
                         onClick={removePost} variant="contained" disableRipple
                         className="post__remove__button post__remove__button--danger">
            {t.remove[lang]}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog className="post__share" open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
        <DialogTitle className="post__share__title">{t.sharePost[lang]}</DialogTitle>
        <DialogContent className="post__share__content">
          {loadingChannels && channels.length === 0 &&
            <CircularProgress className="post__share__indicator" size={60}/>
          }

          {channels.map((channel, idx) =>
            <div className="post__share__channel" key={idx}>
              <Avatar src={channel.photo}/>
              <div className="post__share__channel__username">{channel.username}</div>
              <SendIcon className="post__share__channel__button"
                        onClick={sharePost.bind(this, channel.idUser, channel.idChannel)}/>
            </div>
          )}

          {channels.length === 0 && !loadingChannels &&
            <div style={{width: '100%'}}>{t.youNeedToHaveAtLeastOneChannel[lang]}</div>
          }
        </DialogContent>
        <DialogActions>
          <LoadingButton className="post__share__button post__share__button--outlined" loading={false}
                         onClick={() => setShareDialogOpen( false)} variant="outlined" disableRipple>
            {t.cancel[lang]}
          </LoadingButton>
        </DialogActions>
      </Dialog>

    </div>
  )
}