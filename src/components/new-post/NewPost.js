import React, {useEffect, useState} from 'react'
import './NewPost.scss'
import {IconButton} from "@mui/material"
import ImagePicker from "../image-picker/ImagePicker";
import NewPostDialog from "../new-post-dialog/NewPostDialog";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined"

export default function NewPost() {

  const [newPostDialogIsOpen, setNewPostDialogIsOpen] = useState(false)

  const [croppedImage, setCroppedImage] = useState(null)
  const [src, setSrc] = useState(null)

  useEffect(() => {
    croppedImage ? setNewPostDialogIsOpen(true) : setNewPostDialogIsOpen(false)
  }, [croppedImage])

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setSrc(reader.result)
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }

  return (
    <div className="new-post-button">
      <input accept="image/*" style={{display: 'none'}} id="icon-button-file" type="file" onChange={onSelectFile}/>
      <label htmlFor="icon-button-file">
        <IconButton color="primary" component="span" style={{padding: 0}}>
          <AddCircleOutlineOutlinedIcon size="large" className="new-post-button__icon"/>
        </IconButton>
      </label>

      <ImagePicker setCroppedImage={setCroppedImage} src={src} setSrc={setSrc}/>

      <NewPostDialog croppedImage={croppedImage} open={newPostDialogIsOpen} setOpen={setNewPostDialogIsOpen}/>
    </div>
  )
}
