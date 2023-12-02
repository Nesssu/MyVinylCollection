import '../App.css';
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io"
import { useState, useRef } from 'react';
import { json } from 'react-router-dom';



const Record = (props) =>
{
  return (
    <div className='RecordBackground'>
      <div className='RecordImage'>

      </div>
      <div className='RecordInfoArea'>

      </div>
    </div>
  )
}

const Home = (props) =>
{
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const currentRef = useRef(null);

  const [records, setRecords] = useState([]);

  const scrollToRef = (ref) =>
  {
    if (ref.current)
    {
      ref.current.scrollIntoView();
      currentRef.current = ref.current;
    }
  }

  useState(() =>
  {
    // When the user switches between the home and about views, the data is stored to localStorage
    // so when the user reloads the page it stays on the right page.
    const storedRef = localStorage.getItem('my_vinyl_collection_ref');

    if (storedRef && currentRef)
    {
      currentRef.current = JSON.parse(storedRef);
    }

    if (currentRef)
    {
      scrollToRef(currentRef);
    }
    else
    {
      scrollToRef(homeRef);
    }



    const handleResize = () =>
    {
        if (currentRef.current) 
        {
          currentRef.current.scrollIntoView();
        }
        else if (homeRef.current)
        {
          homeRef.current.scrollIntoView();
        }
    }

    window.addEventListener("resize", handleResize);

    return () =>
    {
        window.removeEventListener("resize", handleResize);
    }
    
  }, []);

  return (
    <div className="Home">

      <div className='VinylCollection' ref={homeRef}>
        <div className="Header">
          <h1>My Vinyl Collection</h1>
          <h2 className='HomeHeaderLink' onClick={() => scrollToRef(aboutRef)} >About <IoIosArrowRoundForward className='HeaderIcon' /></h2>
        </div>

        <div className="CollectionBackground">
          <div className='SearchBar'>

          </div>

          <div className='RecordList'>

          </div>
        </div>
      </div>



      <div className='About' ref={aboutRef}>
        <div className="Header">
          <h2 className='AboutHeaderLink' onClick={() => scrollToRef(homeRef)}><IoIosArrowRoundBack className='HeaderIcon' />Back</h2>
          <h1>About</h1>
        </div>

        <div className='AboutTextArea'>

        {/* TODO: ABOUT TEXT HERE */}

          dwadawdawdawdwa

        </div>
      </div>

    </div>
  );
}

export default Home;
