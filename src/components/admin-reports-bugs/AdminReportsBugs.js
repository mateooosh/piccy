import React, {useEffect, useState} from 'react'
import './AdminReportsBugs.scss'
import {useSelector, useStore} from "react-redux"
import {
  Chip,
  CircularProgress,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip
} from "@mui/material"
import {useSnackbar} from "notistack"
import TablePaginationActions from "../table-pagination-actions/TablePaginationActions"
import NoPhotographyIcon from '@mui/icons-material/NoPhotography'
import {t} from "../../translations/translations"

export default function AdminReportsBugs() {

  const store = useStore()
  const {enqueueSnackbar} = useSnackbar()
  const lang = useSelector(state => state.lang)

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
  }, [query])

  useEffect(() => {
    setBugsResult(bugs.filter(filterBugs))
  }, [bugs])

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
    fetch(url, {
      headers: {
        'x-access-token': store.getState().token
      }
    })
      .then(response => response.json())
      .then(response => {
        console.log('reported bugs: ', response)
        setBugs(response)
      })
      .catch(() => enqueueSnackbar(t.somethingWentWrong[lang]))
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
        'Content-Type': 'application/json',
        'x-access-token': store.getState().token
      },
    })
      .then(response => response.json())
      .then(response => {
        enqueueSnackbar(response.message[lang])
        getReportedBugs()
      })
      .catch(() => enqueueSnackbar(t.somethingWentWrong[lang]))
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
      .catch(() => enqueueSnackbar(t.somethingWentWrong[lang]))
  }

  return (
    <div className="admin-reports-bugs">
      <h2 className="admin-reports-bugs__title">{t.reportedBugs[lang]}</h2>

      <input value={query}
             onChange={e => setQuery(e.target.value)}
             className="admin-reports-bugs__input" type="text" placeholder={t.typeHere[lang]}/>

      {bugsLoading ? (
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
          <CircularProgress size={60}/>
        </div>
      ) : (
        <Table sx={{minWidth: 500}}>
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 700}}>ID</TableCell>
              <TableCell sx={{fontWeight: 700}} align="center">{t.attachment[lang]}</TableCell>
              <TableCell sx={{fontWeight: 700}} align="left">{t.reportedBy[lang]}</TableCell>
              <TableCell sx={{fontWeight: 700}} align="left">{t.description[lang]}</TableCell>
              <TableCell sx={{fontWeight: 700, minWidth: 110}} align="center">{t.date[lang]}</TableCell>
              <TableCell sx={{fontWeight: 700}} align="center">Status</TableCell>
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
                    <img onClick={() => displayAttachment(row.id)} className="admin-reports-bugs__img" src={row.attachment}
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
                  {row.status === 'opened' &&
                  <Tooltip title={t.markAsResolved[lang]}>
                  <Chip label={t.opened[lang]} color="primary" style={{color: 'white'}} onClick={() => markAs(row.id, 'resolved')}/>
                  </Tooltip>
                  }

                  {row.status === 'resolved' &&
                  <Tooltip title={t.markAsOpened[lang]}>
                    <Chip label={t.resolved[lang]} color="primary" variant="outlined" onClick={() => markAs(row.id, 'opened')}/>
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
                rowsPerPageOptions={[5, 10, 25, {label: t.all[lang], value: -1}]}
                colSpan={7}
                count={bugsResult.length}
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


      <Dialog open={attachmentDialogOpen} onClose={closeAttachmentDialogOpen}>
        <img src={photo}/>
      </Dialog>
    </div>
  )
}