import '../App.css';

const Record = (props) =>
{
  return (
    <div className='RecordBackground'>
      <div className='RecordImage' style={{backgroundImage: `url(data:${props.contentType};base64,${props.image})`}}/>
      <div className='HorizontalSeparator' style={{width: "90%", backgroundColor: "#CABA9C"}} />
      <div className='RecordInfoArea'>
        <p># {props.number}</p>
        <p>{props.artist}</p>
        <div style={{position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center", margin: "0 0 20px 0"}} >
          <p style={{position: "absolute"}} >{props.title}</p>
        </div>
      </div>
    </div>
  )
}

export default Record;