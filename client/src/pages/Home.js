import '../App.css';
import '../pages/SearchBarStyle.css';
import { IoIosArrowRoundForward, IoIosArrowRoundBack, IoIosArrowRoundUp, IoIosSearch } from "react-icons/io"
import { RxCross1 } from "react-icons/rx";
import RecordRow from '../components/RecordRow';
import { useState, useRef, useEffect } from 'react';
import { Tooltip } from 'react-tooltip'

const Home = () =>
{
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const currentRef = useRef(null);

  const background_HomePage = "#4C6444";
  const background_AboutPage = "#CABA9C";

  const [records, setRecords] = useState([]);
  const [recordsToDisplay, setRecordsToDisplay] = useState([]);
  const [disableScroll, setDisableScroll] = useState(false);
  const [searchBarValue, setSearchBarValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const scrollToRef = (ref) =>
  {
    if (ref.current)
    {
      ref.current.scrollIntoView();
      currentRef.current = ref.current;
      sessionStorage.setItem('my_vinyl_collection_ref', ref.current.className);
    }
  }

  const GetGroupSizeBasedOnWindowWidth = () =>
  {
    const widthOfWindow = window.innerWidth;

    if (widthOfWindow >= 1050)
    {
      return 3;
    }
    else if (widthOfWindow >= 650 && widthOfWindow < 1050)
    {
      return 2;
    }
    else
    {
      return 1;
    }
  }

  const DivideRecordsIntoGroupsOfNumFromList = (num, listOfRecords) =>
  {
    let newList = [];
    let temp = [];
    let i = num;

    listOfRecords.forEach(record =>
    {
        temp.push(record);
        i--;

        if (i <= 0)
        {
          newList.push(temp);
          
          i = num;
          temp = [];
        }

        if (listOfRecords.indexOf(record) == listOfRecords.length - 1 && temp.length != 0)
        {
          newList.push(temp);
        }
    });

    setRecordsToDisplay(newList);
    setLoading(false);
  }

  const handleResize = async () =>
  {
    if (currentRef.current) 
    {
      currentRef.current.scrollIntoView();
    }
    else if (homeRef.current)
    {
      homeRef.current.scrollIntoView();
    }

    const widthOfWindow = window.innerWidth;


    const noRecordsAvailable = recordsToDisplay.length == 0 || records.length == 0;

    if (noRecordsAvailable)
    {
      await fetchRecords();
    }
    
    // If the width of the window is bigger than 1050px, show three records in one row
    if (!noRecordsAvailable && widthOfWindow >= 1050)
    {
      DivideRecordsIntoGroupsOfNumFromList(3, records);
    }

    // If the width of the window is bigger than 650px, show two records in one row
    if (!noRecordsAvailable && widthOfWindow >= 650 && widthOfWindow < 1050)
    {
      DivideRecordsIntoGroupsOfNumFromList(2, records);
    }

    // If the width of the window is smaller than 650px, show one record per row
    if (!noRecordsAvailable && widthOfWindow < 650)
    {
      DivideRecordsIntoGroupsOfNumFromList(1, records);
    }
  }

  const fetchRecords = async () =>
  {
    const response = await fetch('/api/records/all', {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      }
    });
    
    if (response)
    {
      const json = await response.json();
      if (json)
      {
        if (json.success)
        {
          const sortedRecordsList = json.records.sort((a, b) => a.number - b.number);
          setRecords(sortedRecordsList);
          const groupSize = GetGroupSizeBasedOnWindowWidth();
          DivideRecordsIntoGroupsOfNumFromList(groupSize, sortedRecordsList);
        }
      }
    }
  }

  useEffect(() =>
  {
    setLoading(true);
    const groupSize = GetGroupSizeBasedOnWindowWidth();

    if (searchBarValue !== "")
    {
      let temp = [];
      records.forEach((record) => 
        { 
          if (record.artist.toLowerCase().includes(searchBarValue.toLowerCase()))
          {
            temp.push(record);
          }
        }
      );

      DivideRecordsIntoGroupsOfNumFromList(groupSize, temp);
      return;
    }

    DivideRecordsIntoGroupsOfNumFromList(groupSize, records);
  }, [searchBarValue]);

  useState(() =>
  {
    setLoading(true);
    fetchRecords();

    // When the user switches between the home and about views, the data is stored to localStorage
    // so when the user reloads the page it stays on the right page.
    const storedRef = sessionStorage.getItem('my_vinyl_collection_ref');

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

    window.addEventListener("resize", handleResize);

    return () =>
    {
        window.removeEventListener("resize", handleResize);
    }
    
  }, [update]);

  useEffect(() =>
  {
    document.body.style.overflowY = disableScroll ? "hidden" : "scroll";
  }, [disableScroll]);

  return (
    <div className="Home" style={{backgroundColor: disableScroll ? background_AboutPage : background_HomePage}}>


      {/* HERE STARTS THE CODE FOR THE VINYL COLLECTION VIEW */}


      <div className='VinylCollection' ref={homeRef}>
        <div className="Header">
          <h2 className='HomeHeaderLink' onClick={() => { scrollToRef(aboutRef); setDisableScroll(true); }} >About <IoIosArrowRoundForward className='HeaderIcon' /></h2>
        </div>

        <h4 className='HomeTitle'>MY VINYL COLLECTION</h4>

        <div className='SearchBarArea'>
          <div className='SearchBarHorizontalLine' />
          <div className='SearchBarInputArea'>
            <div className='SearchBarVerticalLine' />
            <div className='SearchBarInputBackground'>
              { searchBarValue === "" ? <IoIosSearch className='SearchBarIcon' /> : <RxCross1 className='SearchBarIcon ClearSearchButton' onClick={() => setSearchBarValue("")} /> }
              <Tooltip anchorSelect='.ClearSearchButton' place='top'>
                Clear the search
              </Tooltip>
              <input className='SearchBarInput' placeholder='Search for artists' value={searchBarValue} onChange={(event) => setSearchBarValue(event.target.value)} />
            </div>
            <div className='SearchBarVerticalLine' />
          </div>
          <div className='SearchBarHorizontalLine' />
        </div>

        <div className="CollectionBackground">

          { loading ?
            (
              <div>
                {/* TODO: Loading animation */}
                <p>Loading...</p>
              </div>
            )
            :
            (
              <div style={{width: "100%", height: "100%"}}>
                { recordsToDisplay.length > 0 ?
                  (
                    <div className='RecordList'>
                      {
                        recordsToDisplay.map((recordRow, index) => 
                        (
                          <RecordRow recordRow={recordRow} key={index} index={index} amountOfRows={recordsToDisplay.length} />
                        ))
                      }
                    </div>
                  )
                  :
                  (
                    <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                      <p>{"If you see this message there is an issue with the website, because me not having records is impossible!"}</p>
                    </div>
                  )
                }
              </div>
            )
          }

        </div>

        <div className='BackToTopButtonArea' onClick={() => { scrollToRef(homeRef); }}>
          <h2><IoIosArrowRoundUp className='HeaderIcon' /> Back to top</h2>
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
