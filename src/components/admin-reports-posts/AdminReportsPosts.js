import React, {useEffect, useState} from 'react'
import './AdminReportsPosts.scss'
import {useStore} from "react-redux"
import {useHistory} from "react-router-dom"
import {
  Button,
  Chip, CircularProgress,
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function AdminReportsPosts() {

  const store = useStore()
  const history = useHistory()
  const {enqueueSnackbar} = useSnackbar()

  const [query, setQuery] = useState('')
  const [posts, setPosts] = useState([])
  const [postsResult, setPostsResult] = useState([])
  const [isLoadingDeleting, setIsLoadingDeleting] = useState(false)
  const [postsLoading, setPostsLoading] = useState(true)

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
    getReportedPosts()

    return () => {
      setQuery('')
      setPosts([])
    }
  }, [])

  useEffect(() => {
    setPage(0)
    setPostsResult(posts.filter(filterPosts))
  }, [query])


  useEffect(() => {
    setPostsResult(posts.filter(filterPosts))
  }, [posts])

  function filterPosts(report) {
    return report.reporter.toLowerCase().includes(query.toLowerCase()) ||
      formatDate(report.date).includes(query) ||
      report.id.toString().includes(query) ||
      report.reason.toLowerCase().includes(query.toLowerCase()) ||
      report.status.toLowerCase().includes(query.toLowerCase())
    // return true
  }

  function formatDate(date) {
    date = new Date(date)
    let dd = String(date.getDate()).padStart(2, '0')
    let mm = String(date.getMonth() + 1).padStart(2, '0')
    let yyyy = date.getFullYear()

    return dd + '-' + mm + '-' + yyyy
  }

  function getReportedPosts() {
    const url = `${process.env.REACT_APP_API_URL}/admin/reports/posts?token=${store.getState().token}`
    fetch(url, {
      headers: {
        'x-access-token': store.getState().token
      },
    })
      .then(response => response.json())
      .then(response => {
        console.log('reported posts: ', response)
        setPosts(response)
      })
      .catch(() => enqueueSnackbar('Something went wrong'))
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
        enqueueSnackbar(response.message)
        getReportedPosts()
      })
      .catch(() => enqueueSnackbar('Something went wrong!'))
      .finally(() => {
        setIsLoadingDeleting(false)
        setDeletePostDialogIsOpen(false)
      })
  }

  function markAs(id, status) {
    console.log('mark as ', status)

    const url = `${process.env.REACT_APP_API_URL}/admin/reports/posts`

    const obj = {
      id: id,
      status: status
    }

    fetch(url, {
      method: 'PUT',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': store.getState().token
      },
    })
      .then(response => response.json())
      .then(response => {
        enqueueSnackbar(response.message)
        getReportedPosts()
      })
      .catch(() => enqueueSnackbar('Something went wrong!'))
  }

  return (
    <div className="admin-reports-posts">
      <h2 className="admin-reports-posts__title">Reported posts</h2>

      <input value={query}
             onChange={e => setQuery(e.target.value)}
             className="admin-reports-posts__input" type="text" placeholder="Type here query..."/>

      {postsLoading ? (
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
          <CircularProgress size={60}/>
        </div>
      ) : (
        <Table sx={{minWidth: 500}}>
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 700}}>ID</TableCell>
              <TableCell sx={{fontWeight: 700}} align="left">Photo</TableCell>
              <TableCell sx={{fontWeight: 700}} align="left">Reporter</TableCell>
              <TableCell sx={{fontWeight: 700}} align="left">Reason</TableCell>
              <TableCell sx={{fontWeight: 700, minWidth: 110}} align="center">Date</TableCell>
              <TableCell sx={{fontWeight: 700}} align="center">Status</TableCell>
              <TableCell sx={{fontWeight: 700}} align="center">Actions</TableCell>
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
                  <img className="admin-reports-posts__img" src={row.photo} width={50}/>
                </TableCell>
                <TableCell>
                  {row.reporter}
                </TableCell>
                <TableCell>
                  {row.reason}
                </TableCell>
                <TableCell align="center">
                  {formatDate(row.date)}
                </TableCell>
                <TableCell align="center">
                  {row.status == 'new' &&
                  <Tooltip title="Mark as closed" onClick={() => markAs(row.id, 'closed')}>
                    <Chip label="New" color="primary"
                          style={{color: 'white'}}/>
                  </Tooltip>
                  }

                  {row.status === 'closed' &&
                  <Tooltip title="Mark as new" onClick={() => markAs(row.id, 'new')}>
                    <Chip label="Closed" color="primary" variant="outlined"/>
                  </Tooltip>
                  }
                </TableCell>
                <TableCell align="center" sx={{minWidth: 120}}>
                  <Tooltip title="Go to post">
                    <IconButton onClick={() => window.open(`/post/${row.id}`, '_blank').focus()}>
                      <RemoveRedEyeIcon/>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete post">
                    <IconButton onClick={() => onDeletePostClick(row.id)}>
                      <DeleteForeverIcon color="error"/>
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{height: 53 * emptyRows}}>
                <TableCell colSpan={7}/>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, {label: 'All', value: -1}]}
                colSpan={7}
                count={postsResult.length}
                rowsPerPage={rowsPerPage}
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
        <DialogTitle style={{fontWeight: '600'}}>Delete post</DialogTitle>
        <DialogContent sx={{lineHeight: 1.5}}>
          Are you sure You want to delete this post? It will not be possible to restore it.
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            className="admin-reports-posts__button admin-reports-posts__button--outlined"
            disableRipple
            onClick={closeDeletePostDialog}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={isLoadingDeleting}
            variant="contained"
            className="admin-reports-posts__button admin-reports-posts__button--danger"
            disableRipple
            onClick={deletePost}
          >
            Delete post
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}