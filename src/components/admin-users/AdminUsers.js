import React, {useEffect, useState} from 'react'
import './AdminUsers.scss'
import {useStore} from "react-redux"
import {useHistory} from "react-router-dom"
import {
  Avatar,
  Button,
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
  TableRow
} from "@mui/material"
import {PersonRemoveRounded} from "@mui/icons-material"

import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import {LoadingButton} from "@mui/lab"
import {useSnackbar} from "notistack"
import TablePaginationActions from "../table-pagination-actions/TablePaginationActions";

export default function AdminUsers() {

  const store = useStore()
  const history = useHistory()
  const {enqueueSnackbar} = useSnackbar()

  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [usersResult, setUsersResult] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [isLoadingDeleting, setIsLoadingDeleting] = useState(false)

  const [deleteAccountDialogIsOpen, setDeleteAccountDialogIsOpen] = useState(false)
  const [idUserToDelete, setIdUserToDelete] = useState(null)

  function closeDeleteAccountDialog() {
    setDeleteAccountDialogIsOpen(false)
    setIdUserToDelete(null)
  }

  function onDeleteAccountClick(idUser) {
    setIdUserToDelete(idUser)
    setDeleteAccountDialogIsOpen(true)
  }

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - usersResult.length) : 0

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    getUsers()

    return () => {
      setQuery('')
      setUsers([])
      setUsersLoading(false)
    }
  }, [])

  useEffect(() => {
    setPage(0)
    setUsersResult(users.filter(filterUsers))
  }, [query, users])

  function filterUsers(user) {
    return user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.id.toString().includes(query)
  }

  function getUsers() {
    const url = `${process.env.REACT_APP_API_URL}/admin/users?token=${store.getState().token}`
    setUsersLoading(true)
    fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log('users: ', response)
        setUsers(response)
      })
      .catch(err => console.log(err))
      .finally(() => setUsersLoading(false))
  }

  function deleteAccount() {
    setIsLoadingDeleting(true)
    const url = `${process.env.REACT_APP_API_URL}/admin/users/${idUserToDelete}`
    fetch(url, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(response => response.json())
      .then(response => {
        enqueueSnackbar(response.message)
        getUsers()
      })
      .catch(() => enqueueSnackbar('Something went wrong!'))
      .finally(() => {
        setIsLoadingDeleting(false)
        setDeleteAccountDialogIsOpen(false)
      })
  }

  return (
    <div className="admin-users">
      <h2 className="admin-users__title">Users</h2>

      <input value={query}
             onChange={e => setQuery(e.target.value)}
             className="admin-users__input" type="text" placeholder="Type here query..."/>

      <Table sx={{minWidth: 500}}>
        <TableHead>
          <TableRow>
            <TableCell sx={{fontWeight: 700}}>ID</TableCell>
            <TableCell sx={{fontWeight: 700}} align="left">Username</TableCell>
            <TableCell sx={{fontWeight: 700}} align="left">Name</TableCell>
            <TableCell sx={{fontWeight: 700}} align="left">E-mail</TableCell>
            <TableCell sx={{fontWeight: 700}} align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
              ? usersResult.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : usersResult
          ).filter(filterUsers).map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <Avatar className="user__avatar" src={row.photo || row.userPhoto}/>
                {row.username}
              </TableCell>
              <TableCell>
                {row.name}
              </TableCell>
              <TableCell>
                {row.email}
              </TableCell>
              <TableCell align="center" sx={{minWidth: 120}}>
                <IconButton onClick={() => history.push(`/${row.username}`)}>
                  <RemoveRedEyeIcon/>
                </IconButton>
                <IconButton onClick={() => onDeleteAccountClick(row.id)}>
                  <PersonRemoveRounded/>
                </IconButton>
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
              rowsPerPageOptions={[5, 10, 25, {label: 'All', value: -1}]}
              colSpan={5}
              count={usersResult.length}
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

      <Dialog
        open={deleteAccountDialogIsOpen}
        keepMounted
        onClose={closeDeleteAccountDialog}
      >
        <DialogTitle style={{fontWeight: '600'}}>Delete account</DialogTitle>
        <DialogContent sx={{lineHeight: 1.5}}>
          Are you sure You want to delete this account? Every post, comment, message and many, many others will
          be removed. It will not be possible to restore it.
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            className="admin-users__button admin-users__button--outlined"
            disableRipple
            onClick={closeDeleteAccountDialog}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={isLoadingDeleting}
            variant="contained"
            className="admin-users__button admin-users__button--danger"
            disableRipple
            onClick={deleteAccount}
          >
            Delete account
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}
