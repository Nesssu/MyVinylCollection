import '../App.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { BiImageAdd } from 'react-icons/bi';
import { AiOutlineSearch } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfirmDialog } from 'primereact/confirmdialog';

const showToast = (message, type) =>
  {
      if (type === "warning")
      {
          toast.warning(message, {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              theme: "light",
              bodyClassName: "ToastContainer",
              style: {borderRadius: "10px"}
              }
          );
      }
      else if (type === "success")
      {
          toast.success(message, {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              theme: "light",
              bodyClassName: "ToastContainer",
              style: {borderRadius: "10px"}
              }
          );
      }
  }

const SearchResultItem = (props) =>
{
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [itemKey, setItemKey] = useState(0);

  useEffect(() =>
  {
    setArtist(props.artist);
    setAlbum(props.album);
    setItemKey(props.itemKey);
  }, [props])

  return (
    <div className='AdminDashboardSearchBarResultItem' onClick={() => {props.searchBarOnClick(itemKey); props.setClearSearch(true);}} >
      <p>{artist} - {album}</p>
    </div>
  );
}

const SearchBar = (props) =>
{
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [found, setFound] = useState(false);
  const [clearSearch, setClearSearch] = useState(false);
  
  const handleSearchChange = (event) =>
  {
    setSearch(event.target.value);

    let temp = [];

    for (let i = 0; i < props.records.length; i++)
    {
      if ((props.records[i].artist.toLowerCase().includes(event.target.value.toLowerCase()) || props.records[i].title.toLowerCase().includes(event.target.value.toLowerCase())) && event.target.value !== "")
      {
        if (temp.length < 5)
        {
          temp.push(props.records[i]);
        }
      }
    }

    if (temp.length !== 0)
    {
      setFiltered(temp);
      setFound(true);
    }
    else
    {
      setFiltered([]);
      setFound(false);
    }
  }

  const handleKeyDown = (event) =>
  {
    if (event.keyCode === 13)
    {
      handleSearch();
    }
  }
  const handleSearch = () =>
  {
    
  }

  useEffect(() =>
  {
    if (clearSearch)
    {
      setFiltered([]);
      setFound(false);
      setSearch("");
      setClearSearch(false);
    }
  }, [found, filtered, clearSearch]);


  return (
    <div className='AdminDashboardSearchBarBackground' >
      <div style={{'display': 'flex', 'flexDirection': 'row', 'alignItems': 'center'}} >
        <AiOutlineSearch className='SearchBarIcon' />
        <input className='AdminDashboardSearchBar' type='Text' placeholder='Search by artists or albums name' onKeyDown={handleKeyDown} onChange={handleSearchChange} value={search} />
      </div>
      {
        found &&
        (
          <div className='AdminDashboardSearchBarResultArea'>
            <div className='HorizontalSeparator' />
            {
              filtered.map(record =>  (
                <SearchResultItem key={record._id} artist={record.artist} album={record.title} itemKey={record.number} searchBarOnClick={props.searchBarOnClick} setClearSearch={setClearSearch} />
              ))
            }
          </div> 
        )
      }
    </div>
  )
}

const Record = (props) =>
{
  // The real data of the record
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [releaseDate, setReleaseDate] = useState(Date);
  const [number, setNumber] = useState("");
  const [image, setImage] = useState(null);

  // History of the records data to keep track if it has changed
  const [titleHistory, setTitleHistory] = useState("");
  const [artistHistory, setArtistHistory] = useState("");
  const [releaseDateHistory, setReleaseDateHistory] = useState(Date);
  const [numberHistory, setNumberHistory] = useState("");
  const [imageHistory, setImageHistory] = useState(null);

  const [hover, setHover] = useState(false);
  const [contentType, setContentType] = useState("");
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const fileInputRef = useRef(null);

  const checkUpdate = () =>
  {
    if (title != titleHistory) return true;
    if (artist != artistHistory) return true;
    if (releaseDate != releaseDateHistory) return true;
    if (number != numberHistory) return true;
    if (image != imageHistory) return true;

    return false;
  }

  const handleTitleChange = (event) =>
  {
    setTitle(event.target.value);
  }
  const handleArtistChange = (event) =>
  {
    setArtist(event.target.value);
  }
  const handleReleaseDateChange = (event) =>
  {
    setReleaseDate(event.target.value);
  }
  const handleNumberChange = (event) =>
  {
    setNumber(event.target.value);
  }

  const handleImageClick = () => 
  {
    fileInputRef.current.click();
  }
  const handlePathChange = (event) =>
  {
      const file = event.target.files[0];

      if (file && file.type.match('image.*'))
      {
        const reader = new FileReader();
        reader.onload = function(e)
        {
            setImage(reader.result.replace("data:", "").replace(/^.+,/, ""));
        }
        reader.readAsDataURL(file);
      }
  }
  const addRecord = () =>
  {
    if (title !== "" && artist !== "" && releaseDate !== "" && number !== "" && image !== null)
    {
        const body = {
            title,
            artist,
            releaseDate,
            number,
            image
        };

        fetch('/api/add/new/record/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": props.jwt
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(json => 
            {
              if (json.success)
              {
                showToast(json.message, "success");
              }
              else
              {
                showToast(json.message, "warning");
              }
            })
        setTitle("");
        setArtist("");
        setReleaseDate("");
        setNumber("");
        setImage(null);
    }
    else
    {
      showToast("All the inputs must be filled", "warning");
    }
  }
  const updateRecord = () =>
  {
    // Send the updated data to the database


    // Close the update view
    props.setSelectedRecord({});
    props.setShowUpdate(false);
  }
  const deleteRecord = () =>
  {
    setDeleteDialogVisible(false);

    // Delete the record based on the id.
    const body = {
      number
    }

    fetch('/api/record/delete',
    {
      method: "DELETE",
      headers: {
          "Content-Type": "application/json",
          "authorization": props.jwt
      },
      body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(json => 
      {
        if (json.success)
        {
          showToast(json.message, "success");
          props.setShowUpdate(false);
          props.setSelectedRecord({});
        }
        else
        {
          showToast(json.message, "warning");
        }
      }
    );
  }
  useEffect(() =>
  {
  }, [title, artist, releaseDate, number, image])
  useEffect(() =>
  {
    if (props.update && isFirstTime)
    {
      setArtist(props.artist);
      setTitle(props.title);
      setReleaseDate(props.releaseDate);
      setNumber(props.number);
      setImage(props.image);
      setContentType(props.contentType);

      setArtistHistory(props.artist);
      setTitleHistory(props.title);
      setReleaseDateHistory(props.releaseDate);
      setNumberHistory(props.number);
      setImageHistory(props.image);

      setIsFirstTime(false);
    }
  }, [props, title, artist, image, releaseDate, number]);

  return (
    <div style={{'width': '100%', 'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center'}} >
      {!props.update && 
        (
          <h2>Add New Record</h2>
        )
      }
      <input className='AdminDashboardInput' type='Text' placeholder='Artist' value={artist} onChange={handleArtistChange} />
      <input className='AdminDashboardInput' type='Text' placeholder='Title' value={title} onChange={handleTitleChange} />
      <input className='AdminDashboardInput' type='Date' value={releaseDate} placeholder='Release Date' onChange={handleReleaseDateChange}/>
      <input className='AdminDashboardInput' type='Number' placeholder='Number' value={number} onChange={handleNumberChange} />
      <div className='ChangeImageContainer' onClick={handleImageClick} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)} style={{backgroundImage: image && `url(data:${contentType};base64,${image})`}} >
        <BiImageAdd className='ImageIcon' style={{opacity: hover ? "1" : "0" }} />
        {image === null && 
          (
            <p style={{opacity: hover ? "0": "1"}} className='ImageText' >Image of the Record</p>
          )
        }
        <input type="file" style={{display: "none"}} onChange={handlePathChange} id="BrowseImages" ref={fileInputRef} />
      </div>
      {
        props.update ?
        (
          <div style={{width: 'calc(50% + 30px)', maxWidth: '380px', minWidth: '100px', display: 'flex', flexDirection: 'row'}}>
            <ConfirmDialog className='ConfirmDialog' acceptClassName='ConfirmDialogAccept' rejectClassName='ConfirmDialogReject' 
              visible={deleteDialogVisible} onHide={() => setDeleteDialogVisible(false)} message="Are you sure you want to delete the record" 
              header="Confirmation" icon="pi pi-exclamation-triangle" 
              accept={deleteRecord} acceptLabel='Delete' 
              reject={() => setDeleteDialogVisible(false)} rejectLabel='Cancel'
              
            />
            <input className='AdminDashboardButton' type='Button' value='Delete' onClick={() => setDeleteDialogVisible(true)} style={{backgroundColor: '#922724', color: 'white', margin: '10px 10px 10px 0'}} />
            {checkUpdate() ?
            (
              <input className='AdminDashboardButton' type='Button' value='Save' onClick={updateRecord} style={{margin: '10px 0 10px 10px'}} />
            )
            :
            (
              <input className='AdminDashboardButton' type='Button' value='Close' onClick={() => { props.setSelectedRecord({}); props.setShowUpdate(false); }} style={{margin: '10px 0 10px 10px'}} />
            )}
          </div>
        )
        :
        (
          <input className='AdminDashboardButton' type='Button' value='Add' onClick={addRecord} />
        )
      }
    </div>
  )
}

const AdminDashboard = (props) =>
{
  const [ID, setID] = useState("");
  const [confirmedID, setConfirmedID] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState({});
  const [showUpdate, setShowUpdate] = useState(false);

  const navigate = useNavigate();

  const handleIDChange = (event) =>
  {
    setID(event.target.value);
  }
  const handleConfirmedIDChange = (event) =>
  {
    setConfirmedID(event.target.value);
  }
  const handlePasswordChange = (event) =>
  {
    setPassword(event.target.value);
  }
  const handleConfirmedPasswordChange = (event) =>
  {
    setConfirmedPassword(event.target.value);
  }


  const handleIDUpdate = () =>
  {
    if (ID === "" || confirmedID === "")
    {
      showToast("The ID can't be empty", "warning");
    }
    else if (ID !== confirmedID)
    {
      showToast("The IDs must be the same", "warning");
      setConfirmedID("");
    }
    else
    {
      const body = 
      {
        ID,
        confirmedID
      };

      fetch('/api/admin/update/id/', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "authorization": props.jwt
        },
        body: JSON.stringify(body)
      })
      .then(response => response.json())
      .then(json => 
        {
          if (json.success)
          {
            showToast(json.message, "success");
          }
          else
          {
            showToast(json.message, "warning");
          }
        }
      )

      setID("");
      setConfirmedID("");
    }
  }
  const handlePasswordUpdate = () =>
  {
    if (password === "" || confirmedPassword === "")
    {
      showToast("The password can't be empty", "warning");
    }
    else if (password !== confirmedPassword)
    {
      showToast("The passwords must be the same", "warning");
      setConfirmedPassword("");
    }
    else
    {
      const body = 
      {
        password,
        confirmedPassword
      };

      fetch('/api/admin/update/password/', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "authorization": props.jwt
        },
        body: JSON.stringify(body)
      })
      .then(response => response.json())
      .then(json => 
        {
          if (json.success)
          {
            showToast(json.message, "success");
          }
          else
          {
            showToast(json.message, "warning");
          }
        }
      )

      setPassword("");
      setConfirmedPassword("");
    }
  }

  const logout = () =>
  {
    localStorage.removeItem('my_vinyl_collection_auth_token');
    navigate("/admin/login");
  }

  const searchBarOnClick = (number) =>
  {
    const record = records.filter(record => record.number == number)[0];
    setSelectedRecord(record);
    setShowUpdate(true);
  }

  useEffect(() =>
  {
    // Get all the records from the db.
    fetch('/api/records/all/', {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "authorization": props.jwt
      }
    })
    .then(response => response.json())
    .then(json => 
      {
        if (json.success)
        {
          setRecords(json.records);
        }
        else
        {
          showToast(json.message, "warning");
        }
      }
    )
  }, [props, navigate, showUpdate]);

  return (
    <div className="AdminDashboard">

      <div className="DashboardHeaderArea">
        <div className="DashboardTitle">
          <h1>Admin Dashboard</h1>
        </div>

        <input type="Button" value="Log Out" className="DashboardLogoutButton" onClick={logout} />
      </div>

      <div className="AddAndUpdateArea">

        <div className="UpdateArea">
          <h2>Update Record</h2>
          <SearchBar searchBarOnClick={searchBarOnClick} records={records} />

          <div className='HorizontalSeparator' style={{width: '50%', margin: '80px 0 20px 0'}} />

          {showUpdate ? (
            <Record 
              update={true} 
              jwt={props.jwt} 
              artist={selectedRecord.artist} 
              title={selectedRecord.title} 
              number={selectedRecord.number} 
              releaseDate={selectedRecord.releaseDate} 
              image={selectedRecord.image}
              contentType={selectedRecord.contentType}
              setSelectedRecord={setSelectedRecord}
              setShowUpdate={setShowUpdate}
            />
          )
          :
          (
            <h3 style={{color: "#888"}}>Search records to edit them</h3>
          )
          }
        </div>

        <div className="AddArea">
          <Record update={false} jwt={props.jwt} />

          <div className="AdminCredentialsArea">
            <h2>Update Admin Credentials</h2>
            
            <h3 style={{'marginTop': '30px'}} >Update ID</h3>
            <input className='AdminDashboardInput' type='Text' placeholder='ID' value={ID} onChange={handleIDChange} />
            <input className='AdminDashboardInput' type='Text' placeholder='Confirm ID' value={confirmedID} onChange={handleConfirmedIDChange} />
            <input className='AdminDashboardButton' type='Button' value='Save' onClick={handleIDUpdate} />

            <h3 style={{'marginTop': '30px'}} >Update password</h3>
            <input className='AdminDashboardInput' type='Password' placeholder='New password' value={password} onChange={handlePasswordChange} />
            <input className='AdminDashboardInput' type='Password' placeholder='Confirm password' value={confirmedPassword} onChange={handleConfirmedPasswordChange} />
            <input className='AdminDashboardButton' type='Button' value='Save' onClick={handlePasswordUpdate} />
          </div>

        </div>
      </div>

      <ToastContainer/>
    </div>
  );
}

export default AdminDashboard;