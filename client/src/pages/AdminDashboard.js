import '../App.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { BiImageAdd } from 'react-icons/bi';
import { AiOutlineSearch } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
              theme: "dark",
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
    <div className='AdminDashboardSearchBarResultItem' onClick={() => props.searchBarOnClick(itemKey)} >
      <p>{artist} - {album}</p>
    </div>
  );
}

const SearchBar = (props) =>
{
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [found, setFound] = useState(false);
  
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
    
  }, [props, found, filtered])


  return (
    <div className='AdminDashboardSearchBarBackground' >
      <div style={{'display': 'flex', 'flexDirection': 'row', 'alignItems': 'center'}} >
        <AiOutlineSearch className='SearchBarIcon' />
        <input className='AdminDashboardSearchBar' type='Text' placeholder='Search by artists or albums name' onKeyDown={handleKeyDown} onChange={handleSearchChange} />
      </div>
      {
        found &&
        (
          <div className='AdminDashboardSearchBarResultArea'>
            <div className='HorizontalSeparator' />
            {
              filtered.map(record =>  (
                <SearchResultItem artist={record.artist} album={record.title} itemKey={record.id} searchBarOnClick={props.searchBarOnClick} />
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
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [bio, setBio] = useState("");
  const [path, setPath] = useState(null);
  const [image, setImage] = useState(null);
  const [hover, setHover] = useState(false);
  const fileInputRef = useRef(null);

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
  const handleBioChange = (event) =>
  {
    setBio(event.target.value);
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
            setPath(`url(${e.target.result})`);
            setImage(reader.result.replace("data:", "").replace(/^.+,/, ""));
        }
        reader.readAsDataURL(file);
      }
  }
  const addRecord = () =>
  {
    if (title !== "" && artist !== "" && releaseDate !== "" && bio !== "" && image !== null)
    {
        const body = {
            title,
            artist,
            releaseDate,
            bio,
            image
        };

        fetch('/api/add/new/record/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": localStorage.getItem('my_vinyl_collection_auth_token')
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(json => 
            {
              console.log(json);
                //showToast(json.message, "success");
                //else showToast(json.message, "warning");
            })
        setTitle("");
        setArtist("");
        setReleaseDate("");
        setBio("");
        setImage(null);
        setPath(null);
    }
    else
    {
      showToast("All the inputs must be filled", "warning");
    }
  }

  useEffect(() =>
  {
    if (props.update)
    {
      setArtist(props.artist);
      setTitle(props.title);
      setReleaseDate(props.releaseDate);
      setBio(props.bio);
      setImage(props.image);
    }
  }, [props, image])



  return (
    <div style={{'width': '100%', 'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center'}} >
      <h2>Add New Record</h2>
      <input className='AdminDashboardInput' type='Text' placeholder='Title' value={title} onChange={handleTitleChange} />
      <input className='AdminDashboardInput' type='Text' placeholder='Artist' value={artist} onChange={handleArtistChange} />
      <input className='AdminDashboardInput' type='Date' value={releaseDate} placeholder='Release Date' onChange={handleReleaseDateChange} />
      <div style={{'display': 'flex', 'flexDirection': 'row', 'justifyContent': 'space-between', 'width': '98%', 'max-width': '630px'}} >
        <textarea className='AdminDashboardMultiline NoScroll' placeholder='Bio' value={bio} onChange={handleBioChange} />
        <div className='ChangeImageContainer'onClick={handleImageClick} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)} style={{backgroundImage: path && path}} >
          <BiImageAdd className='ImageIcon' style={{opacity: hover ? "1" : "0" }} />
          {image === null && 
            (
              <p style={{opacity: hover ? "0": "1"}} className='ImageText' >Image of the Record</p>
            )
          }
          <input type="file" style={{display: "none"}} onChange={handlePathChange} id="BrowseImages" ref={fileInputRef} />
        </div>
      </div>
      <input className='AdminDashboardButton' type='Button' value={props.update ? 'Update': 'Add'} onClick={addRecord} />
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

  const searchBarOnClick = (key) =>
  {
    
  }

  useEffect(() =>
  {
    const token = localStorage.getItem('my_vinyl_collection_auth_token');
    if (token)
    {
      const body = {
        token
      };

      fetch('/api/admin/validate_token/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      })
      .then(response => response.json())
      .then(json => 
        {
          if (json.success)
          {
            props.setJwt(token);
          }
          else
          {
            navigate("/admin/login");
          }
        }
      );
    }
    else
    {
      navigate("/admin/login");
    }

    // Get all the records from the db.
    setRecords([
      {
        'artist': 'Michael Jackson',
        'title': 'Thriller',
        'id': '1'
      },
      {
        'artist': 'Kanye West',
        'title': 'College Dropout',
        'id': '2'
      },
      {
        'artist': 'The Black Keys',
        'title': 'Rubber Factory',
        'id': '3'
      },
      {
        'artist': 'Led Zeppelin',
        'title': '1',
        'id': '4'
      }
    ]);
  }, [props, navigate]);





  return (
    <div className="AdminDashboard">

      <div className="DashboardHeaderArea">
        <div className="DashboardTitle">
          <h1>Admin Dashboard</h1>
        </div>

        <div className="DashboardLogoutButton" onClick={logout}>
          <p>Log Out</p>
        </div>
      </div>

      <div className="AddAndUpdateArea">

        <div className="UpdateArea">
          <h2>Update Record</h2>
          <SearchBar searchBarOnClick={searchBarOnClick} records={records} />



        </div>

        <div className="AddArea">
          <Record update={false} />

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