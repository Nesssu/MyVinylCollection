import '../App.css';
import Record from '../components/Record';
import { useState, useEffect, useRef } from 'react';

const RecordRow = (props) =>
{
  const elementRef = useRef(null);
  const isNotLastRow = props.amountOfRows !== props.index + 1 || props.amountOfRows < 3;

  return (
    <div>
      <div className="RecordListRow" ref={elementRef}>
        {
          props.recordRow.map((record) =>
          (
            <Record artist={record.artist} title={record.title} number={record.number} key={record._id} image={record.image} contentType={record.contentType} handleRecordClick={props.handleRecordClick} />
          ))
        }
        <p className='RowIndex'>Row No. {props.index + 1}</p>
      </div>

      {
        isNotLastRow &&
        (
          <div className='RecordRowDivider'>
            <div className='RecordRowDividerIMG' />
          </div>
        )
      }
    </div>
  )
}

export default RecordRow;