import '../App.css';
import Record from '../components/Record';
import { useState, useEffect, useRef } from 'react';

const RecordRow = (props) =>
{
  const [isVisible, setIsVisible] = useState(true);
  const elementRef = useRef(null);
  const isNotLastRow = props.amountOfRows !== props.index + 1;


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  return(
    <div>
      <div className="RecordListRow" ref={elementRef} style={{opacity: isVisible ? '1' : '0'}}>
        {
          props.recordRow.map((record) =>
          (
            <Record artist={record.artist} title={record.title} number={record.number} key={record._id} image={record.image} contentType={record.contentType} />
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