import React from 'react'
import '../style/dashboardstyle/skeleton.css'
const Skeleton = ({ width = "100%", height = "80px", borderRadius = "12px" }) => {

  return (
    <div style={{ width, height, borderRadius }}
    className='skeleton' />
  )
}

export default Skeleton
