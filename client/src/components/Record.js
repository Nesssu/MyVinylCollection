import '../App.css';
import { useState, useEffect } from 'react';

const Record = (props) =>
{
   const [hovering, setHovering] = useState(false);

  return (
    <div className='RecordBackground' onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
      <div className='RecordImage' style={{backgroundImage: `url(data:${props.contentType};base64,${props.image})`, filter: hovering && 'blur(8px)'}}/>                                                                       
      <div className='RecordInfoArea' style={{opacity: hovering ? '1' : '0' }}>
        <p># {props.number}</p>
        <p>{props.artist}</p>
        <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}} >
          <p>{props.title}</p>
        </div>
      </div>
    </div>
  )
}

export default Record;