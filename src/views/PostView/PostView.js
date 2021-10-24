import React, {useEffect, useState} from 'react'
import './PostView.scss'

import {useStore} from "react-redux"
import Post from "../../components/post/Post"
import {useParams} from "react-router-dom"

export default function PostView() {

  const store = useStore()
  const {id} = useParams()

  const [post, setPost] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log(id)

    const url = `${process.env.REACT_APP_API_URL}/posts/${id}?idUser=${store.getState().id}&token=${store.getState().token}`;

    fetch(url)
      .then(response => response.json())
      .then(response => {
        setPost(response)
      })
      .catch(err => console.log(err));
  }, [])

  return (
    <div className="post-view">
      <div className="post-view__post">
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