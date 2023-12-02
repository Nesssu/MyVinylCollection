import '../App.css';
import { IoIosArrowRoundForward, IoIosArrowRoundBack, IoIosSearch } from "react-icons/io"
import { useState, useRef, useEffect } from 'react';


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

const SearchResultItem = (props) =>
{
  const [artist, setArtist] = useState("");
  const [itemKey, setItemKey] = useState(0);

  useEffect(() =>
  {
    setArtist(props.artist);
    setItemKey(props.itemKey);
  }, [props])

  return (
    <div className='SearchBarResultItem' onClick={() => {props.searchBarOnClick(artist); props.setClearSearch(true);}} >
      <p>{artist}</p>
    </div>
  );
}

const SearchBar = (props) =>
{
  const [showResults, setShowResults] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [clearSearch, setClearSearch] = useState(false);

  const handleSearchChange = (event) =>
  {
    setSearch(event.target.value);

    let temp = [];

    for (let i = 0; i < props.records.length; i++)
    {
      if ((props.records[i].artist.toLowerCase().includes(event.target.value.toLowerCase())) && event.target.value !== "")
      {
        temp.push(props.records[i]);
      }
    }

    if (temp.length !== 0)
    {
      setFilteredRecords(temp);
      setShowResults(true);
    }
    else
    {
      setFilteredRecords([]);
      setShowResults(false);
    }
  }

  const handleKeyDown = (event) =>
  {
    if (event.keyCode === 13)
    {
      if (search !== "")
      {
        props.searchBarSearch(filteredRecords);
      }
    }
  }

  useEffect(() =>
  {
    if (clearSearch)
    {
      setFilteredRecords([]);
      setShowResults(false);
      setSearch("");
      setClearSearch(false);
    }
  }, [showResults, filteredRecords, clearSearch]);

  return (
    <div className='SearchBarBackground'>
      <div className='SearchBarInputArea'>
        <IoIosSearch className='SearchBarIcon' />
        <input type='text' className='SearchBarInput' onChange={handleSearchChange} onKeyDown={handleKeyDown} value={search} placeholder='Search for artists' />
      </div>
      {showResults && (
        <div className='SearchBarResultArea'>
          <div className='HorizontalSeparator' />
          {
            filteredRecords.slice(0, 10).map(record =>  (
                <SearchResultItem key={record._id} artist={record.artist} itemKey={record.number} searchBarOnClick={props.searchBarOnClick} setClearSearch={setClearSearch} />
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

  const scrollToRef = (ref) =>
  {
    if (ref.current)
    {
      ref.current.scrollIntoView();
      currentRef.current = ref.current;
    }
  }

  const searchBarOnClick = (artist) =>
  {
    let temp = [];

    for (let i = 0; i < records.length; i++)
    {
      if (records[i].artist == artist)
      {
        temp.push(records[i]);
      }
    }

    setRecordsToDisplay(temp);
  }

  const searchBarSearch = (filteredList) =>
  {
    setRecordsToDisplay(filteredList);
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

  useState(() =>
  {
    fetch('/api/records/all/', {
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
          setRecords(json.records);
        }
      }
    )
  }, [props])

  useState(() =>
  {
  }, [recordsToDisplay]);

  return (
    <div className="Home">

      <div className='VinylCollection' ref={homeRef}>
        <div className="Header">
          <h1>My Vinyl Collection</h1>
          <h2 className='HomeHeaderLink' onClick={() => scrollToRef(aboutRef)} >About <IoIosArrowRoundForward className='HeaderIcon' /></h2>
        </div>

        <div className="CollectionBackground">
          <div className='SearchBar'>
            <SearchBar records={records} searchBarOnClick={searchBarOnClick} searchBarSearch={searchBarSearch} />
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
