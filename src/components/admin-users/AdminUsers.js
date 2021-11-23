import React, {useEffect, useState} from 'react'
import './AdminUsers.scss'
import {useStore} from "react-redux"
import {useTheme} from '@mui/material/styles'
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
  TableHead,
  TableRow,
  Box,
  TableFooter,
  TablePagination
} from "@mui/material"
import {KeyboardArrowLeft, KeyboardArrowRight, PersonRemoveRounded} from "@mui/icons-material"

import FirstPageIcon from '@mui/icons-material/FirstPage'
import LastPageIcon from '@mui/icons-material/LastPage'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import {LoadingButton} from "@mui/lab"
import {useSnackbar} from "notistack"

export default function AdminUsers() {

  const store = useStore()
  const history = useHistory()
  const {enqueueSnackbar} = useSnackbar()

  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [isLoadingDeleting, setIsLoadingDeleting] = useState(false)

  const [deleteAccountDialogIsOpen, setDeleteAccountDialogIsOpen] = useState(false)
  const [idUserToDelete, setIdUserToDelete] = useState(null)

  function closeDeleteAccountDialog() {
    setDeleteAccountDialogIsOpen(false)
  }

  function onDeleteAccountClick(idUser) {
    setIdUserToDelete(idUser)
    setDeleteAccountDialogIsOpen(true)
  }

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0

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
  }, [query])

  function filterUsers(user) {
    return user.username.includes(query) || user.name.includes(query) || user.email.includes(query) || user.id.toString().includes(query)
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
              ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : users
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
              count={users.length}
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


function TablePaginationActions(props) {
  const theme = useTheme()
  const {count, page, rowsPerPage, onPageChange} = props

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <Box sx={{flexShrink: 0, ml: 2.5}}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
      >
        {theme.direction === 'rtl' ? <LastPageIcon/> : <FirstPageIcon/>}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === 'rtl' ? <FirstPageIcon/> : <LastPageIcon/>}
      </IconButton>
    </Box>
  )
}
