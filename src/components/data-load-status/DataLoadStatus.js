import React from 'react'
import './DataLoadStatus.scss'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import {CircularProgress} from "@mui/material"

export default function DataLoadStatus({status, statusText, hasError, isLoading}) {

  return (
    <>
      {(hasError || isLoading) &&
      <div className="error">
        {hasError && !isLoading &&
        <>
          <WarningRoundedIcon className="error__icon"></WarningRoundedIcon>
          <div className="error__status">{status || ''}</div>
          <div className="error__caption">{statusText || ''}</div>
        </>
        }
        {isLoading &&
        <CircularProgress size={60}/>
        }
      </div>
      }
    </>
  )
}
