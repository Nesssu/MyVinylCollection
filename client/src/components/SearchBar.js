import '../App.css';
import { IoIosSearch } from "react-icons/io"
import { RxCross1 } from "react-icons/rx";
import { useState, useEffect } from 'react';

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

export default SearchBar;