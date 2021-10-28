import React, {useEffect, useState} from 'react'
import './HomeView.scss'

import {useStore} from "react-redux"
import Post from "../../components/post/Post"
import Navbar from "../../components/navbar/Navbar"
import {CircularProgress} from "@mui/material";
import variables from "../../styles/variables.module.scss";

export default function HomeView() {

  const store = useStore()

  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [emptyPosts, setEmptyPosts] = useState(false)


  function getPosts() {
    if (emptyPosts || loading)
      return;

    let temp = page + 1;
    setLoading(true);

    const url = `${process.env.REACT_APP_API_URL}/posts?idUser=${store.getState().id}&onlyUserPosts=false&page=${temp}&token=${store.getState().token}`;
    fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        //push new posts to array
        response.map(item => setPosts(posts => [...posts, item]));

        if (!!response.length) {
          setPage(temp);
        } else {
          setEmptyPosts(true);
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
      })
  }

  useEffect(() => {
    getPosts()
  }, [])


  return (
    <div className="home">
      <div className="home__posts">

        {loading &&
        <CircularProgress className="home__indicator" size={60}/>
        }

        {posts.map((post, idx) => (
          <Post
            post={post}
            idx={idx}
            key={idx}
            homeScreen
          />
        ))}

      </div>
    </div>
  )
}