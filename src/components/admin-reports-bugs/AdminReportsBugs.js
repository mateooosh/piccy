import React, {useEffect, useState} from 'react'
import './AdminReportsBugs.scss'
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
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import CancelIcon from '@mui/icons-material/Cancel';

export default function AdminReportsBugs() {

  const store = useStore()
  const history = useHistory()
  const {enqueueSnackbar} = useSnackbar()

  const [query, setQuery] = useState('')
  const [bugs, setBugs] = useState([])
  const [bugsResult, setBugsResult] = useState([])
  const [bugsLoading, setBugsLoading] = useState(true)

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false)
  const [photo, setPhoto] = useState(null)

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bugsResult.length) : 0

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    getReportedBugs()

    return () => {
      setQuery('')
      setBugs([])
      setBugsResult([])
    }
  }, [])

  useEffect(() => {
    setPage(0)
    setBugsResult(bugs.filter(filterBugs))
  }, [query, bugs])

  function filterBugs(report) {
    return report.username.toLowerCase().includes(query.toLowerCase()) ||
      formatDate(report.reportDate).includes(query) ||
      report.id.toString().includes(query) ||
      report.description.toLowerCase().includes(query.toLowerCase()) ||
      report.status.toLowerCase().includes(query.toLowerCase())
  }

  function formatDate(date) {
    date = new Date(date)
    let dd = String(date.getDate()).padStart(2, '0')
    let mm = String(date.getMonth() + 1).padStart(2, '0')
    let yyyy = date.getFullYear()

    return dd + '-' + mm + '-' + yyyy
  }

  function getReportedBugs() {
    const url = `${process.env.REACT_APP_API_URL}/admin/reports/bugs?token=${store.getState().token}`
    fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log('reported bugs: ', response)
        setBugs(response)
      })
      .catch(() => enqueueSnackbar('Something went wrong'))
      .finally(() => setBugsLoading(false))
  }

  function markAs(id, status) {
    console.log('mark as resolved, ', id)

    const url = `${process.env.REACT_APP_API_URL}/admin/reports/bugs`

    const obj = {
      id: id,
      status: status
    }

    fetch(url, {
      method: 'PUT',
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(response => {
        enqueueSnackbar(response.message)
        getReportedBugs()
      })
      .catch(() => enqueueSnackbar('Something went wrong!'))
  }

  function displayAttachment(id) {
    setAttachmentDialogOpen(true)
    getAttachment(id)
  }

  function closeAttachmentDialogOpen() {
    setAttachmentDialogOpen(false)
    setPhoto(null)
  }

  function getAttachment(id) {
    const url = `${process.env.REACT_APP_API_URL}/admin/reports/bugs/${id}/photo?token=${store.getState().token}`

    fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log('photo', response)
        setPhoto(response.attachment)
      })
      .catch(() => enqueueSnackbar('Something went wrong!'))
  }

  return (
    <div className="admin-posts">
      <h2 className="admin-posts__title">Reported bugs</h2>

      <input value={query}
             onChange={e => setQuery(e.target.value)}
             className="admin-posts__input" type="text" placeholder="Type here query..."/>

      {bugsLoading ? (
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
          <CircularProgress size={60}/>
        </div>
      ) : (
        <Table sx={{minWidth: 500}}>
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 700}}>ID</TableCell>
              <TableCell sx={{fontWeight: 700}} align="center">Attachment</TableCell>
              <TableCell sx={{fontWeight: 700}} align="left">Reporter</TableCell>
              <TableCell sx={{fontWeight: 700}} align="left">Description</TableCell>
              <TableCell sx={{fontWeight: 700, minWidth: 110}} align="center">Date</TableCell>
              <TableCell sx={{fontWeight: 700}} align="center">Status</TableCell>
              <TableCell sx={{fontWeight: 700}} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
                ? bugsResult.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : bugsResult
            ).map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="center">
                  {row.attachment !== null ? (
                    <img onClick={() => displayAttachment(row.id)} className="admin-posts__img" src={row.attachment}
                         width={50}/>
                  ) : (
                    <NoPhotographyIcon width={30}/>
                  )}
                </TableCell>
                <TableCell>
                  {row.username}
                </TableCell>
                <TableCell>
                  {row.description}
                </TableCell>
                <TableCell align="center">
                  {formatDate(row.reportDate)}
                </TableCell>
                <TableCell align="center">
                  {row.status == 'opened' &&
                  <Chip label="Opened" color="primary"
                        style={{color: 'white'}}/>
                  }

                  {row.status === 'resolved' &&
                  <Chip label="Resolved" color="primary" variant="outlined"/>
                  }
                </TableCell>
                <TableCell align="center" sx={{minWidth: 120}}>
                  {row.status === 'resolved' &&
                  <Tooltip title="Mark as opened">
                    <IconButton onClick={() => markAs(row.id, 'opened')}>
                      <CancelIcon color="error"/>
                    </IconButton>
                  </Tooltip>
                  }

                  {row.status === 'opened' &&
                  <Tooltip title="Mark as resolved">
                    <IconButton onClick={() => markAs(row.id, 'resolved')}>
                      <CheckCircleIcon color="primary"/>
                    </IconButton>
                  </Tooltip>
                  }
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
                colSpan={7}
                count={bugsResult.length}
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


      <Dialog open={attachmentDialogOpen} onClose={closeAttachmentDialogOpen}>
        <img src={photo}/>
      </Dialog>
    </div>
  )
}