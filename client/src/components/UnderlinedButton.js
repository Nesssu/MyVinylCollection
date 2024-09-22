import '../components/UnderlinedButtonStyles.css';
import React from 'react';
import { useState } from 'react';

const UnderlinedButton = (props) =>
{
    const color = props.color;
    const position = props.position; // start, end or center
    const title = props.title;
    const buttonOnClick = props.buttonOnClick;
    
    const [hovering, setHovering] = useState(false);

    return (
        <div className='ButtonArea' style={{alignItems: position}} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} onClick={buttonOnClick}>
            <h2 style={{color: color}}>{title}</h2>
            <div className='Underline' style={{backgroundColor: color, width: hovering ? "100%" : "0%"}} />
        </div>
    )
}

export default UnderlinedButton;