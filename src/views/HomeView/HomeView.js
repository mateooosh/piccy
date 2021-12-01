import React, {createRef, useEffect, useRef, useState} from 'react'
import './HomeView.scss'

import {useStore} from "react-redux"
import Post from "../../components/post/Post"
import {CircularProgress} from "@mui/material"
import NewPost from "../../components/new-post/NewPost";
import {checkStatus} from "../../functions/functions";
import DataLoadStatus from "../../components/data-load-status/DataLoadStatus";

export default function HomeView() {

  const store = useStore()

  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasError, setHasError] = useState(false)
  const [emptyPosts, setEmptyPosts] = useState(false)
  const homeRef = useRef()

  const refPage = useRef(page)
  useEffect(() => {
    refPage.current = page
  }, [page])

  const refLoading = useRef(loading)
  useEffect(() => {
    refLoading.current = loading
  }, [loading])

  const refEmptyPosts = useRef(emptyPosts)
  useEffect(() => {
    refEmptyPosts.current = emptyPosts
  }, [emptyPosts])

  function getPosts() {
    if (refEmptyPosts.current || refLoading.current) {
      console.log('return')
      return
    }

    let temp = refPage.current + 1
    setLoading(true)

    console.log('get posts' , temp)

    const url = `${process.env.REACT_APP_API_URL}/posts?idUser=${store.getState().id}&onlyUserPosts=false&page=${temp}&token=${store.getState().token}`
    fetch(url)
      .then(res => checkStatus(res))
      .then(response => {
        // console.log(response)
        //push new posts to array
        setPosts(posts => [...posts, ...response])

        if (response.length !== 0) {
          setPage(temp)
          console.log('response.length !== 0')
        }

        if(response.length !== 5) {
          setEmptyPosts(true)
        }
      })
      .catch(err => {
        setError(err)
        setHasError(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getPosts()

    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  function onScroll(e) {
    if(homeRef.current.offsetHeight - 1500 < window.scrollY) {
      console.log('get posts')
      getPosts()

    }
  }

  return (
    <div className="home" ref={homeRef}>
      <div className="home__posts">
        <NewPost/>
        <DataLoadStatus hasError={hasError} status={error?.status} statusText={error?.statusText}/>

        {!posts.length && !loading && !hasError &&
        <div style={{fontSize: 16, marginVertical: 20}}>You need to follow someone</div>
        }

        {posts.map((post, idx) => (
          <Post
            post={post}
            idx={idx}
            key={idx}
            homeScreen
          />
        ))}

        {loading &&
        <div style={{height: 80}}>
          <CircularProgress className="home__indicator" size={60}/>
        </div>
        }

      </div>
    </div>
  )
}