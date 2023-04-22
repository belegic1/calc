import React from 'react'
import { useDrag } from '../context/DragContext'

const DragItem = ({ children , index,}) => {
  const { isDragging, dragStart } = useDrag()
  return (
    <div onPointerDown={(e) => dragStart(e, index)}>
      <div className={`card ${isDragging === index ? 'dragging' : ''}`}>
        <div className="box">{ children}</div>
      </div>
    </div>
  )
}

export default DragItem