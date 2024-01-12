import '../App.css';
import { IoIosArrowRoundForward, IoIosArrowRoundBack, IoIosSearch } from "react-icons/io"
import { RxCross1 } from "react-icons/rx";
import { useState, useRef, useEffect } from 'react';

const Record = (props) =>
{
  return (
    <div className='RecordBackground'>
      <div className='RecordImage' style={{backgroundImage: `url(data:${props.contentType};base64,${props.image})`}}/>
      <div className='HorizontalSeparator' style={{"width": "90%"}} />
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

const SearchResultItem = (props) =>
{
  const [artist, setArtist] = useState("");

  useEffect(() =>
  {
    setArtist(props.artist);
  }, [props])

  return (
    <div className='SearchBarResultItem' onClick={() => {props.searchBarOnClick(artist); props.setClearSearch(true); props.setSearch(artist); }} >
      <p>{artist}</p>
    </div>
  );
}

const SearchBar = (props) =>
{
  const [showResults, setShowResults] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchedArtists, setSearchedArtists] = useState([]);
  const [search, setSearch] = useState("");
  const [clearSearch, setClearSearch] = useState(false);

  const handleSearchChange = (event) =>
  {
    if (event.target.value !== "")
    {
      setSearch(event.target.value);

      fetch('/api/records/search/' + event.target.value, {
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
              let artistTemp = [];

              if (json.records.length !== 0)
              {
                for (let i = 0; i < json.records.length; i++)
                {
                  if (artistTemp.some(record => record.artist === json.records[i].artist) === false)
                  {
                    artistTemp.push(json.records[i]);
                  }
                }
                
                setSearchedArtists(artistTemp);
                setFilteredRecords(json.records);
                setShowResults(true);
              }
              else
              {
                setFilteredRecords([]);
                setSearchedArtists([]);
                setShowResults(false);
              }
            }
            else
            {
              console.log("ERROR: " + json.message);
            }
          });
    }
    else
    {
      setSearch("");
      setFilteredRecords([]);
      setSearchedArtists([]);
      setShowResults(false);
    }
  }

  const handleKeyDown = (event) =>
  {
    if (event.keyCode === 13)
    {
      if (search !== "" && filteredRecords.length > 0)
      {
        setClearSearch(true);
        props.searchBarSearch(filteredRecords);
      }
    }
  }

  useEffect(() =>
  {
    if (clearSearch)
    {
      setFilteredRecords([]);
      setSearchedArtists([]);
      setShowResults(false);
      setClearSearch(false);
    }
  }, [showResults, filteredRecords, clearSearch]);

  return (
    <div className='SearchBarBackground'>
      <div className='SearchBarInputArea'>
        <IoIosSearch className='SearchBarIcon' />
        <input type='text' className='SearchBarInput' onChange={handleSearchChange} onKeyDown={handleKeyDown} value={search} placeholder='Search for artists' />
        {props.allowSearchClear && <RxCross1 className='SearchBarIcon Hover' onClick={() => { props.searchBarSearch(props.records); props.setAllowSearchClear(false); setSearch(""); }} />}
      </div>
      {showResults && (
        <div className='SearchBarResultArea'>
          <div className='HorizontalSeparator' />
          {
            searchedArtists.slice(0, 10).map(record =>  (
                <SearchResultItem key={record._id} artist={record.artist} searchBarOnClick={props.searchBarOnClick} setClearSearch={setClearSearch} setSearch={setSearch} />
            ))
          }
        </div>
      )}
    </div>
  )
}

const Home = (props) =>
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
    <div className="Home">

      <div className='VinylCollection' ref={homeRef}>
        <div className="Header">
          <h1>My Vinyl Collection</h1>
          <h2 className='HomeHeaderLink' onClick={() => { scrollToRef(aboutRef); setDisableScroll(true); }} >About <IoIosArrowRoundForward className='HeaderIcon' /></h2>
        </div>

        <div className="CollectionBackground">
          <div className='SearchBar'>
            <SearchBar records={records} searchBarOnClick={searchBarOnClick} searchBarSearch={searchBarSearch} allowSearchClear={allowSearchClear} setAllowSearchClear={setAllowSearchClear} />
          </div>

          <div className='RecordList'>
            {
              recordsToDisplay.map((record) => (
                <Record artist={record.artist} title={record.title} number={record.number} key={record._id} image={record.image} contentType={record.contentType}/>
              ))
            }
          </div>

          {moreToCome && (
            <div className='LoadMoreButton' onClick={loadMoreClick}>
              Load More
            </div>  
          )}

        </div>
      </div>



      <div className='About' ref={aboutRef}>
        <div className="Header">
          <h2 className='AboutHeaderLink' onClick={() =>  { scrollToRef(homeRef); setDisableScroll(false); }}><IoIosArrowRoundBack className='HeaderIcon' />Back</h2>
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
