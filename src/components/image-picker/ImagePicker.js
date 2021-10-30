import React, {useCallback, useEffect, useState} from 'react'
import Cropper from 'react-easy-crop'
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material"
import './ImagePicker.scss'
import RotateLeftIcon from '@mui/icons-material/RotateLeft'
import RotateRightIcon from '@mui/icons-material/RotateRight'
import Grid3x3Icon from '@mui/icons-material/Grid3x3'
import getCroppedImg from "./cropImage"

export default function ImagePicker({size, setCroppedImage}) {
  const [crop, setCrop] = useState({x: 0, y: 0})
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [showGrid, setShowGrid] = useState(true)
  const [photoCroppingIsOpen, setPhotoCroppingIsOpen] = useState(false)

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const [src, setSrc] = useState(null)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  useEffect(() => {
    console.log(src)
    if (src)
      setPhotoCroppingIsOpen(true)
    else
      setPhotoCroppingIsOpen(false)
  }, [src])

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        src,
        croppedAreaPixels,
        rotation
      )
      setCroppedImage(croppedImage)
      resetState()
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, rotation])

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setSrc(reader.result)
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function rotateToLeft() {
    setRotation(rotation - 90)
  }

  function toggleGrid() {
    setShowGrid(!showGrid)
  }

  function rotateToRight() {
    setRotation(rotation + 90)
  }

  function resetState() {
    setSrc(null)
    setRotation(0)
    setCrop({x: 0, y: 0})
    setShowGrid(true)
  }

  return (
    <div className="picker">
      <Button
        variant="contained"
        component="label"
        className="picker__button"
        disableRipple
      >
        Create new post
        <input type="file" accept="image/*" onChange={onSelectFile} hidden/>
      </Button>

      {/*{!!croppedImage &&*/}
      {/*<img src={croppedImage} width={size}/>*/}
      {/*}*/}


      <Dialog
        open={photoCroppingIsOpen}
        keepMounted
        onClose={resetState}
        fullScreen
      >
        <DialogTitle>Photo cropping</DialogTitle>
        <DialogContent style={{margin: 'auto', width: '100%', padding: 0}}>
          {src !== null &&
          <div style={{position: 'relative', width: '100%', height: '100%'}}>
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              zoomSpeed={0.1}
              aspect={1 / 1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              rotation={rotation}
              showGrid={showGrid}
            />

            <div className="picker__modification">
              <RotateLeftIcon onClick={rotateToLeft} className="picker__icon"/>
              <Grid3x3Icon onClick={toggleGrid} className="picker__icon"/>
              <RotateRightIcon onClick={rotateToRight} className="picker__icon"/>
            </div>
          </div>
          }
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            className="picker__button picker__button--disabled"
            disableRipple
            onClick={resetState}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className="picker__button"
            disableRipple
            onClick={showCroppedImage}
          >
            Crop
          </Button>
        </DialogActions>
      </Dialog>


    </div>
  )
}

