import '../App.css';
import { useState, useEffect } from 'react';
import React from 'react';

const Record = (props) =>
{
  const [hovering, setHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() =>
  {
    if (window.matchMedia("(any-hover: none)").matches)
    {
      setIsTouchDevice(true);
    }
  }, []);

  return (
    <div className='RecordBackground' onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} onClick={() => { props.handleRecordClick(isTouchDevice, props.number); }}>
      <div className='RecordImage' style={{backgroundImage: `url(data:${props.contentType};base64,${props.image})`}}/>    
      { !isTouchDevice &&
        (
          <div className='RecordInfoArea' style={{opacity: hovering ? '1' : '0', backgroundColor: "#CABA9C" }}>
            <p># {props.number}</p>
            <p>{props.artist}</p>
            <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}} >
              <p>{props.title}</p>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Record;