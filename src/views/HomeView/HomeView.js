import React, {useEffect, useState} from 'react'
import './HomeView.scss'
import {TextField} from "@mui/material"
import {LoadingButton} from "@mui/lab"

import {validation} from '../../functions/functions'
import {Link} from "react-router-dom"
import {useStore} from "react-redux"
import Post from "../../components/post/Post";

export default function HomeView() {

  const store = useStore();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [emptyPosts, setEmptyPosts] = useState(false);


  function getPosts() {
    if(emptyPosts || loading)
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
    getPosts();
  }, [])


  return (
    <div className="home">
      <div onClick={() => store.dispatch({type: 'resetStore'})}>
        Log out
      </div>
      Home
      <div className="home__posts">
        {posts.map((post, idx) => (
          <Post
            post={post}
            idx={idx}
            key={idx}
          />
        ))}
      </div>
    </div>
  )
}