import React, { useEffect, useRef, useState } from 'react'
import users from "./users.json"

import { available } from './data'
import DragArea from './Components/DragArea'
import DragItem from './Components/DragItem'


const UsersInfo = ({firstName, lastName}) => {
  return <li>{ firstName}</li>
}

const App = () => {
  const [data, setData] = useState(users);
  const [isDragging, setIsDragging] = useState(null)

  const containerRef = useRef(null)

  function dragStart(e, index) {
    if (!detectLeftButton()) return;
    setIsDragging(index)
    const container = containerRef.current;
    const items = [...container.childNodes]
    const dragItem = items[index]
    const itemsBellowDragItem = items.slice(index + 1)
    const notDragItems = items.filter((_, i) => i !== index);
    const dragData = data[index];
    let newData = [...data];


    const dragBoundryRect = dragItem.getBoundingClientRect();
    const space =
      items[1].getBoundingClientRect().top -
      items[0].getBoundingClientRect().bottom;


    dragItem.style.position = 'fixed';
    dragItem.style.zIndex = 5000;
    dragItem.style.width = dragBoundryRect.width + "px";
    dragItem.style.height = dragBoundryRect.height + "px";
    dragItem.style.top = dragBoundryRect.top + "px";
    dragItem.style.left = dragBoundryRect.left + "px";
    dragItem.style.cursor = 'grabbing';

    const div = document.createElement("div")
    div.id = "div-temp"
       div.style.width = dragBoundryRect.width + 'px';
       div.style.height = dragBoundryRect.height + 'px';
    div.style.pointerEvents = "none";
    container.appendChild(div);


    const distance = dragBoundryRect.height + space;


    itemsBellowDragItem.forEach(item => {
      item.style.transform = `translateY(${distance}px)`
    })

    let x = e.clientX;
    let y = e.clientY;

    document.onpointermove = dragMove;
    function dragMove(e) {

      const posX = e.clientX - x;
      const posY = e.clientY - y;
      dragItem.style.transform = `translate(${posX}px, ${posY}px)`

      notDragItems.forEach(item => {

        const rect1 = dragItem.getBoundingClientRect()
        const rect2 = item.getBoundingClientRect()
        let isOverlapping = rect1.y < rect2.y + (rect2.height / 2) && rect1.y + (rect1.height / 2) > rect2.y;


        if (isOverlapping) {
          if (item.getAttribute("style")) {
            item.style.transform = ""
            index ++
          } else {
            item.style.transform = `translateY(${distance}px)`
            index --
          }

          newData = data.filter(item => item.id !== dragData.id)
          newData.splice(index, 0 ,dragData)

        }
      })
      
    }


    document.onpointerup = dragEnd;
    function dragEnd() {
      document.onpointerup = "";
      document.onpointermove = "";
      setIsDragging(null)
      dragItem.style = "";
      container.removeChild(div);
      items.forEach(item => item.style = '')
    setData(newData);

    }

  }

      function dragEnd() {
        setIsDragging(null);
      }
  function detectLeftButton(e) {
    e = e || window.event;
    if ("buttons" in e) {
      return e.buttons === 1;
    }
    let button = e.witch || e.button;
    return button === 1
  }



  return (
    // <div className='container' ref={containerRef}>
    //   {data.map((item, index) => {
    //     return (
    //       <div
    //         key={item.id}
    //         onPointerDown={(e) => dragStart(e, index)}
    //         // onPointerUp={dragEnd}
    //       >
    //         <div className={`card ${isDragging === index ? 'dragging' : ''}`}>
    //           <div className="box">
    //             {/* <h4>{item.title}</h4>
    //             <p>{item.subtitle}</p> */}
    //             <UsersInfo firstName={item.firstName} lastName={item.lastName} />
    //           </div>
    //         </div>
    //       </div>
    //     );
    //   })}
    // </div>
    <DragArea items={users} onChange={setData}>
      {data.map((user, index) => (
        <DragItem key={index} index={index}>
          <UsersInfo firstName={user.firstName} lastName={user.lastName} />
        </DragItem>
      ))}
    </DragArea>
  )
}

export default App
