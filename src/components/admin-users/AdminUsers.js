import React, {useEffect, useState} from 'react'
import './AdminUsers.scss'
import {useSelector, useStore} from "react-redux"
import {
  Avatar,
  Button,
  Chip,
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
import {PersonRemoveRounded} from "@mui/icons-material"

import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import {LoadingButton} from "@mui/lab"
import {useSnackbar} from "notistack"
import TablePaginationActions from "../table-pagination-actions/TablePaginationActions";
import {t} from "../../translations/translations"

export default function AdminUsers() {

  const store = useStore()
  const {enqueueSnackbar} = useSnackbar()
  const lang = useSelector(state => state.lang)

  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [usersResult, setUsersResult] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
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
      setUsersResult([])
      setUsersLoading(false)
    }
  }, [])

  useEffect(() => {
    setPage(0)
    setUsersResult(users.filter(filterUsers))
  }, [query])

  useEffect(() => {
    setUsersResult(users.filter(filterUsers))
  }, [users])

  function filterUsers(user) {
    return user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.role.toLowerCase().includes(query.toLowerCase()) ||
      user.id.toString().includes(query)
  }

  function getUsers() {
    const url = `${process.env.REACT_APP_API_URL}/admin/users?token=${store.getState().token}`
    // setUsersLoading(true)
    fetch(url, {
      headers: {
        'x-access-token': store.getState().token
      },
    })
      .then(response => response.json())
      .then(response => {
        console.log('users: ', response)
        setUsers(response)
      })
      .catch(err => console.log(err))
      .finally(() => setUsersLoading(false))
  }

  function deleteAccount() {
    if(idUserToDelete === store.getState().id) {
      enqueueSnackbar(t.cannotDeleteYourAccountFromAdminDashboard[lang])
      return
    }

    setIsLoadingDeleting(true)
    const url = `${process.env.REACT_APP_API_URL}/admin/users/${idUserToDelete}`
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': store.getState().token
      },
    })
      .then(response => response.json())
      .then(response => {
        console.log(response.message)
        enqueueSnackbar(response.message[lang])
        getUsers()
      })
      .catch(() => enqueueSnackbar(t.somethingWentWrong[lang]))
      .finally(() => {
        setIsLoadingDeleting(false)
        setDeleteAccountDialogIsOpen(false)
      })
  }

  function changeRole(id, role) {
    if(id === store.getState().id) {
      enqueueSnackbar(t.cannotChangeRoleOfYourself[lang])
      return
    }

    const url = `${process.env.REACT_APP_API_URL}/admin/users/roles`
    const obj = {
      id: id,
      role: role
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
        getUsers()
      })
      .catch(() => enqueueSnackbar(t.somethingWentWrong[lang]))
  }

  return (
    <div className="admin-users">
      <h2 className="admin-users__title">{t.users[lang]}</h2>

      <input value={query}
             onChange={e => setQuery(e.target.value)}
             className="admin-users__input" type="text" placeholder={t.typeHere[lang]}/>

      {usersLoading ? (
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
          <CircularProgress size={60}/>
        </div>
      ) : (
        <Table sx={{minWidth: 500}}>
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 700}}>ID</TableCell>
              <TableCell sx={{fontWeight: 700}} align="left">{t.username[lang]}</TableCell>
              <TableCell sx={{fontWeight: 700}} align="left">{t.name[lang]}</TableCell>
              <TableCell sx={{fontWeight: 700}} align="left">E-mail</TableCell>
              <TableCell sx={{fontWeight: 700}} align="center">{t.role[lang]}</TableCell>
              <TableCell sx={{fontWeight: 700}} align="center">{t.actions[lang]}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
                ? usersResult.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : usersResult
            ).map((row) => (
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
                <TableCell align="center">
                  {row.role === 'ADMIN' ? (
                    <Tooltip title={t.changeRoleToUSER[lang]}>
                      <Chip label={t.ADMIN[lang]} color="primary"
                        style={{color: 'white'}} onClick={() => changeRole(row.id, 'USER')}/>
                    </Tooltip>
                  ) : (
                    <Tooltip title={t.changeRoleToADMIN[lang]}>
                      <Chip label={t.USER[lang]} variant="outlined" onClick={() => changeRole(row.id, 'ADMIN')}/>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell align="center" sx={{minWidth: 120}}>
                  <Tooltip title={t.goToUser[lang]}>
                    <IconButton onClick={() => window.open(`/${row.username}`, '_blank').focus()}>
                      <RemoveRedEyeIcon/>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t.deleteAccount[lang]}>
                    <IconButton onClick={() => onDeleteAccountClick(row.id)}>
                      <PersonRemoveRounded color="error"/>
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
                colSpan={6}
                count={usersResult.length}
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
        open={deleteAccountDialogIsOpen}
        keepMounted
        onClose={closeDeleteAccountDialog}
      >
        <DialogTitle style={{fontWeight: '600'}}>{t.deleteAccount[lang]}</DialogTitle>
        <DialogContent sx={{lineHeight: 1.5}}>
          {t.areYouSureYouWantToDeleteThisAccount[lang]}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            className="admin-users__button admin-users__button--outlined"
            disableRipple
            onClick={closeDeleteAccountDialog}
          >
            {t.cancel[lang]}
          </Button>
          <LoadingButton
            loading={isLoadingDeleting}
            variant="contained"
            className="admin-users__button admin-users__button--danger"
            disableRipple
            onClick={deleteAccount}
          >
            {t.deleteAccount[lang]}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}
