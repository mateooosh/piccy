import React, {useEffect, useState} from 'react'
import './TagView.scss'

import {useStore} from "react-redux"
import {useHistory, useParams} from "react-router-dom"

export default function TagView() {

  const store = useStore()
  const history = useHistory()
  const {tag} = useParams()

  const [posts, setPosts] = useState([])

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL}/tag/posts?tag=${tag}&token=${store.getState().token}`
    fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log(response)
        setPosts(response)
      })
      .catch(err => console.log(err))

  }, [])

  return (
    <div className="tags">
      {posts.map((post, idx) =>
        <img src={post.photo} key={idx} className="tags__post"
        onClick={() => history.push(`/post/${post.id}`)}/>
      )}
    </div>
  )
}