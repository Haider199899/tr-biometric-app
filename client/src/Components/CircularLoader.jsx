import { Backdrop, CircularProgress, Stack } from '@mui/material'
import React from 'react'

const CircularLoader = () => {
    const [open,setOpen]=React.useState(true)
  return (
    <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={open}
    onClick={()=>(setOpen(false))}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
  )
}

export default CircularLoader