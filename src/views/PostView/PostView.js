import React, {useEffect, useState} from 'react'
import './PostView.scss'

import {useStore} from "react-redux"
import Post from "../../components/post/Post"
import {useHistory, useParams} from "react-router-dom"
import {CircularProgress} from "@mui/material"
import {useSnackbar} from "notistack"
import {io} from "socket.io-client";
import {checkStatus} from "../../functions/functions";
import DataLoadStatus from "../../components/data-load-status/DataLoadStatus";

export default function PostView() {

  const store = useStore()
  const {id} = useParams()
  const history = useHistory()
  const {enqueueSnackbar} = useSnackbar()

  const [post, setPost] = useState([])
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL_WS, {transports: ['websocket']})

    console.log(id)

    const url = `${process.env.REACT_APP_API_URL}/posts/${id}?idUser=${store.getState().id}`
    setLoading(true)
    fetch(url, {
      headers: {
        'x-access-token': store.getState().token
      }
    })
      .then(res => checkStatus(res))
      .then(response => {
        if(response?.code === 'POST_NOT_FOUND') {
          enqueueSnackbar(response.message, {
            variant: 'error'
          })
          history.push('/')
          return
        }

        setPost(response)
      })
      .catch(err => {
        setError(err)
        setHasError(true)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="post-view">
      <div className="post-view__post">
        <DataLoadStatus isLoading={loading} hasError={hasError} status={error?.status} statusText={error?.statusText}/>

        {post.map((item, idx) =>
          <Post
            post={item}
            idx={idx}
            key={idx}
          />
        )}

      </div>
    </div>
  )
}