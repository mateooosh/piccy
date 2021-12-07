import React, {useEffect, useState} from 'react'
import './AdminPosts.scss'
import {useSelector, useStore} from "react-redux"
import {useHistory} from "react-router-dom"
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip
} from "@mui/material"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import {LoadingButton} from "@mui/lab"
import {useSnackbar} from "notistack"
import TablePaginationActions from "../table-pagination-actions/TablePaginationActions";
import {t} from "../../translations/translations"

export default function AdminPosts() {

  const store = useStore()
  const history = useHistory()
  const {enqueueSnackbar} = useSnackbar()
  const lang = useSelector(state => state.lang)

  const [query, setQuery] = useState('')
  const [posts, setPosts] = useState([])
  const [postsResult, setPostsResult] = useState([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [isLoadingDeleting, setIsLoadingDeleting] = useState(false)

  const [deletePostDialogIsOpen, setDeletePostDialogIsOpen] = useState(false)
  const [idPostToDelete, setIdPostToDelete] = useState(null)

  function closeDeletePostDialog() {
    setDeletePostDialogIsOpen(false)
  }

  function onDeletePostClick(idUser) {
    setIdPostToDelete(idUser)
    setDeletePostDialogIsOpen(true)
  }

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - postsResult.length) : 0

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    getPosts()

    return () => {
      setQuery('')
      setPosts([])
      setPostsResult([])
    }
  }, [])

  useEffect(() => {
    setPage(0)
    setPostsResult(posts.filter(filterPosts))
  }, [query, posts])

  function filterPosts(post) {
    return post.username.toLowerCase().includes(query.toLowerCase()) || formatDate(post.uploadDate).includes(query) || post.id.toString().includes(query)
  }

  function formatDate(date) {
    date = new Date(date)
    let dd = String(date.getDate()).padStart(2, '0')
    let mm = String(date.getMonth() + 1).padStart(2, '0')
    let yyyy = date.getFullYear()

    return dd + '-' + mm + '-' + yyyy
  }

  function getPosts() {
    const url = `${process.env.REACT_APP_API_URL}/admin/posts`
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': store.getState().token
      },
    })
      .then(response => response.json())
      .then(response => {
        console.log('posts: ', response)
        setPosts(response)
      })
      .catch(err => console.log(err))
      .finally(() => setPostsLoading(false))
  }

  function deletePost() {
    setIsLoadingDeleting(true)
    const url = `${process.env.REACT_APP_API_URL}/admin/posts/${idPostToDelete}`
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': store.getState().token
      },
    })
      .then(response => response.json())
      .then(response => {
        enqueueSnackbar(response.message[lang])
        getPosts()
      })
      .catch(() => enqueueSnackbar(t.somethingWentWrong[lang]))
      .finally(() => {
        setIsLoadingDeleting(false)
        setDeletePostDialogIsOpen(false)
      })
  }

  return (
    <div className="admin-posts">
      <h2 className="admin-posts__title">{t.posts[lang]}</h2>

      <input value={query}
             onChange={e => setQuery(e.target.value)}
             className="admin-posts__input" type="text" placeholder={t.typeHere[lang]}/>

      {postsLoading ? (
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
          <CircularProgress size={60}/>
        </div>
      ) : (
        <Table sx={{minWidth: 500}}>
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 700}}>ID</TableCell>
              <TableCell sx={{fontWeight: 700}} align="left">{t.photo[lang]}</TableCell>
              <TableCell sx={{fontWeight: 700}} align="left">{t.uploader[lang]}</TableCell>
              <TableCell sx={{fontWeight: 700, minWidth: 110}} align="center">{t.uploadDate[lang]}</TableCell>
              <TableCell sx={{fontWeight: 700}} align="left">{t.caption[lang]}</TableCell>
              <TableCell sx={{fontWeight: 700}} align="center">{t.likes[lang].charAt(0).toUpperCase() + t.likes[lang].slice(1)}</TableCell>
              <TableCell sx={{fontWeight: 700}} align="center">{t.actions[lang]}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
                ? postsResult.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : postsResult
            ).map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>
                  <img className="admin-posts__img" src={row.photo} width={50}/>
                </TableCell>
                <TableCell>
                  {row.username}
                </TableCell>
                <TableCell align="center">
                  {formatDate(row.uploadDate)}
                </TableCell>
                <TableCell>
                  {row.description.split(" ").map((word, index) => {
                    if (word.charAt(0) === "#")
                      return (
                        <span
                          key={index}
                          className="admin-posts__tag"
                        >
                    {word}{" "}
                  </span>
                      )
                    else if (word.charAt(0) === "@")
                      return (
                        <span
                          key={index}
                          className="admin-posts__tag"
                        >
                    {word}{" "}
                  </span>
                      )
                    else return <span key={index}>{word} </span>
                  })}
                </TableCell>
                <TableCell align="center">
                  {row.likes}
                </TableCell>
                <TableCell align="center" sx={{minWidth: 120}}>
                  <Tooltip title={t.goToPost[lang]}>
                    <IconButton onClick={() => window.open(`/post/${row.id}`, '_blank').focus()}>
                      <RemoveRedEyeIcon/>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t.deletePost[lang]}>
                    <IconButton onClick={() => onDeletePostClick(row.id)}>
                      <DeleteForeverIcon color="error"/>
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{height: 53 * emptyRows}}>
                <TableCell colSpan={6}/>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, {label: t.all[lang], value: -1}]}
                colSpan={7}
                count={postsResult.length}
                rowsPerPage={rowsPerPage}
                labelRowsPerPage={t.rowsPerPage[lang]}
                page={page}
                SelectProps={{
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      )}


      <Dialog
        open={deletePostDialogIsOpen}
        keepMounted
        onClose={closeDeletePostDialog}
      >
        <DialogTitle style={{fontWeight: '600'}}>{t.deletePost[lang]}</DialogTitle>
        <DialogContent sx={{lineHeight: 1.5}}>
          {t.areYouSureYouWantToRemoveThisPost[lang]}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            className="admin-posts__button admin-posts__button--outlined"
            disableRipple
            onClick={closeDeletePostDialog}
          >
            {t.cancel[lang]}
          </Button>
          <LoadingButton
            loading={isLoadingDeleting}
            variant="contained"
            className="admin-posts__button admin-posts__button--danger"
            disableRipple
            onClick={deletePost}
          >

            {t.deletePost[lang]}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}