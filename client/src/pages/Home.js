import '../App.css';
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io"
import SearchBar from '../components/SearchBar';
import Record from '../components/Record';
import { useState, useRef, useEffect } from 'react';

const Home = () =>
{
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const currentRef = useRef(null);

  const [records, setRecords] = useState([]);
  const [recordsToDisplay, setRecordsToDisplay] = useState([]);
  const [disableScroll, setDisableScroll] = useState(false);
  const [allowSearchClear, setAllowSearchClear] = useState(false);
  const [loadRecordsTo, setLoadReacordsTo] = useState(16);
  const [moreToCome, setMoreToCome] = useState(true);

  const scrollToRef = (ref) =>
  {
    if (ref.current)
    {
      ref.current.scrollIntoView();
      currentRef.current = ref.current;
      sessionStorage.setItem('my_vinyl_collection_ref', ref.current.className);
    }
  }

  const loadMoreClick = () =>
  {
    const nextLast = loadRecordsTo + 15;
    setLoadReacordsTo(nextLast);
  }

  const searchBarOnClick = (artist) =>
  {
    let temp = [];

    for (let i = 0; i < records.length; i++)
    {
      if (records[i].artist === artist)
      {
        temp.push(records[i]);
      }
    }

    setRecordsToDisplay(temp);
    setAllowSearchClear(true);
  }

  const searchBarSearch = (filteredList) =>
  {
    setRecordsToDisplay(filteredList);
    setAllowSearchClear(true);
  }

  useState(() =>
  {
    // When the user switches between the home and about views, the data is stored to localStorage
    // so when the user reloads the page it stays on the right page.
    const storedRef = sessionStorage.getItem('my_vinyl_collection_ref');
    console.log(storedRef);

    if (storedRef && currentRef)
    {
      if (storedRef === "About")
      {
        setDisableScroll(true);
        document.body.style.overflowY = "hidden";
        scrollToRef(aboutRef);
      }
      else
      {
        setDisableScroll(false);
        document.body.style.overflowY = "scroll";
        scrollToRef(homeRef);
      }
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

  useEffect(() =>
  {
    fetch('/api/fetch/records/' + loadRecordsTo.toString(), {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(json => 
      {
        if (json.success)
        {
          const temp = json.records.sort((a, b) => a.number - b.number);
          setRecords([...records, ...temp]);
          setRecordsToDisplay([...records, ...json.records]);

          if (temp.length === 15)
          {
            setMoreToCome(true);
          }
          else
          {
            setMoreToCome(false);
          }
        }
      }
    )
  }, [loadRecordsTo]);

  useEffect(() =>
  {
    document.body.style.overflowY = disableScroll ? "hidden" : "scroll";
  }, [recordsToDisplay, disableScroll]);

  return (
    <div className="Home" style={{backgroundColor: disableScroll ? "#A9B388" : "#5F6F52"}}>


      {/* HERE STARTS THE CODE FOR THE VINYL COLLECTION VIEW */}


      <div className='VinylCollection' ref={homeRef}>
        <div className="Header">
          <h1>My Vinyl Collection</h1>
          <h2 className='HomeHeaderLink' onClick={() => { scrollToRef(aboutRef); setDisableScroll(true); }} >About <IoIosArrowRoundForward className='HeaderIcon' /></h2>
        </div>

        <div className="CollectionBackground">
          <div className='SearchBar'>
            <SearchBar records={records} searchBarOnClick={searchBarOnClick} searchBarSearch={searchBarSearch} allowSearchClear={allowSearchClear} setAllowSearchClear={setAllowSearchClear} />
          </div>

          { recordsToDisplay.length > 0 ?
            (
              <div className='RecordList'>
                {recordsToDisplay.map((record) => (
                  <Record artist={record.artist} title={record.title} number={record.number} key={record._id} image={record.image} contentType={record.contentType}/>
                ))}
              </div>
            )
            :
            (
              <div style={{width: "100%", display: "flex", justifyContent: "center", margin: "30vh 0 0 0"}}>
                <p>{"If you see this message there is an issue with the website, because me not having records is impossible!"}</p>
              </div>
            )
          }

          {moreToCome && (
            <div className='LoadMoreButton' onClick={loadMoreClick}>
              Load More
            </div>  
          )}

        </div>
      </div>


      {/* HERE STARTS THE CODE FOR THE ABOUT VIEW */}


      <div className='About' ref={aboutRef}>
        <div className="Header">
          <h2 className='AboutHeaderLink' onClick={() =>  { scrollToRef(homeRef); setDisableScroll(false); }}><IoIosArrowRoundBack className='HeaderIcon' />Back</h2>
        </div>

        <h4 className='AboutTitle'>ABOUT</h4>

        <div className='AboutTextArea'>
          <p className='AboutText'>
            Hi! My name is Nestori and I'm a software engineer from Finland. I made this website 
            for my portfolio because I wanted to have a project to work on. I wanted it to be 
            "useful" in some kind of way and this was the first idea that came to my mind. I 
            started to collect records during the summer of 2022 and I quickly had quite a lot. 
            This website allows me to keep track of them and it also helps my family members 
            to know which records I have and which records they could possibly give me as 
            presents. 🥰
          </p>
          <p className='AboutText PortfolioLinkText'>
            If you want to see my other projects, here's a link to my portfolio...
          </p>
        </div>
      </div>

    </div>
  );
}

export default Home;
