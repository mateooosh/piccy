import React, {useEffect, useState} from 'react'
import './PostView.scss'

import {useStore} from "react-redux"
import Post from "../../components/post/Post"
import {useParams} from "react-router-dom"
import {checkStatus} from "../../functions/functions";
import DataLoadStatus from "../../components/data-load-status/DataLoadStatus";

export default function PostView() {

  const store = useStore()
  const {id} = useParams()

  const [post, setPost] = useState([])
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL}/posts/${id}?idUser=${store.getState().id}`
    setLoading(true)
    fetch(url, {
      headers: {
        'x-access-token': store.getState().token
      }
    })
      .then(res => checkStatus(res))
      .then(response => {
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