import React from 'react';
import './Button.scss';

const buttonTypes = {
  filled: 'button filled',
  outline: 'button outline',
  disabled: 'klasadodisabled'
}

export default function Button({content, onClick, type='filled', disabled=false}) {

  function handleClick() {
    if(!disabled)
      onClick()
  }

  return(
    <button className={buttonTypes[type]} onClick={handleClick}>{content}</button>
  )
}

