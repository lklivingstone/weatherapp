import './App.css';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Paper, InputBase, styled, Button } from '@mui/material';
import {
  Chip,
	FormControl,
	Input
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import ReactLoading from "react-loading";

const useFormControlStyles = makeStyles((theme) => ({
  overrides: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "8px",
    minHeight: "20vh",
    width: "60vw",
    // border:'2px solid black',
    padding:4,
    borderRadius:'4px'
  }
}));

const baseURL = "http://localhost:5000/api/weather/getWeather"

const capitalizeFirstLetter = (cityName) => {
    const firstChar = cityName.charAt(0).toUpperCase();
    const remainingChars = cityName.slice(1);
    console.log(`${firstChar}${remainingChars}`)
    return `${firstChar}${remainingChars}`;
};

function App() {
  const classesFormControl = useFormControlStyles();
  const [values, setValues] = useState([]);
	const [currValue, setCurrValue] = useState("");
  const [resData, setResData] = useState({})
  const [weatherData, setWeatherData] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(false)

  const handleDelete = ( item, index) =>{
    let arr = [...values]
    arr.splice(index,1)
    console.log(item)
    setValues(arr)
  }

  const handleAddCity = (e) => {
    e.preventDefault()
    if (currValue.length == 0) {
      return;
    }
    setValues((oldState) => [...oldState, currValue]);
		setCurrValue("");
  }

  const handleKeyDown = (e) => {
		if (e.code === "Enter") {
			handleAddCity(e);
		}
	};

  useEffect(() => {
		console.log(values);
	}, [values]);

	const handleChange = (e) => {
		setCurrValue(e.target.value);
  };

  // test

  useEffect(() => {
    console.log(weatherData); // Log weatherData when it changes
  }, [weatherData]);

  useEffect(() => {
    var ind = 0;

    for (const cityName in resData["weather"]) {
      console.log(cityName, cities[ind])
      if (cityName === cities[ind]) {
        setWeatherData((oldState) => [...oldState, {
          city: cityName,
          temp: resData.weather[cityName],
          suggestion: false
        }]);
      }
      else {
        setWeatherData((oldState) => [...oldState, {
          city: cityName,
          temp: resData.weather[cityName],
          suggestion: true
        }]);
      }
      ind += 1;
      // console.log(`City: ${city}, Temperature: ${weatherData[city]}`);
    }
  }, [cities])

  useEffect(() => {
    console.log(resData["weather"])

    let tempArr = [];

    values.map((item,index) => (
      tempArr = [ ...tempArr, capitalizeFirstLetter(item)]
    ))

    setWeatherData([])

    setCities([...tempArr])
      
  
    
  }, [resData])

  // end test 

  const clickSearchButton = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await axios.post(
        baseURL, {
          cities: [ ...values ] 
        }
      )

      setResData(response["data"])
      
      setLoading(false)
    }
    catch (err) {
      setLoading(false)
      alert("Error. Retry!")
    }
  }

  const renderWeather = (datas) => {
    const suggestedData = datas.filter((data) => data.suggestion === true);
    return (
        <>
        <ul>
        {datas.length > 0 &&
          datas.map((data, index) =>
            data.suggestion === false ? (
              <li style={{listStyleType: "none"}} key={index}>
                {data.city}, Temperature: {data.temp}
              </li>
            ) : null // Render nothing if data.suggestion is true
          )}
        </ul>
        
        {suggestedData.length > 0 && (
        <>
          <p style={{marginTop: "3vh"}}>Did you mean?</p>
          <ul>
            {suggestedData.map((data, index) => (
              data.suggestion === true ? (
                <li style={{listStyleType: "none"}} key={index}>
                {data.city}, Temperature: {data.temp}
                </li>
                ) : null
            ))}
          </ul>
        </>
      )}
        </>
    );
  };

  return (
    <div className="App">
      <FormControl className={classesFormControl.overrides}>
        <Paper
            elevation={0} 
            variant="outlined" square
            component="form"
            sx={{borderColor: 'green', border: "1", backgroundColor: "transparent", borderRadius: "4px",  display: 'flex', alignItems: 'center', width: "80%" }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, variant:"outlined", }}
            placeholder="Enter city name..."
            value={currValue}
            onChange={handleChange}
					  onKeyDown={handleKeyDown}
          />
          <IconButton
            type="button" sx={{ color: "green" }} aria-label="search">
            <AddIcon onClick = {(e) => handleAddCity(e)} />
          </IconButton>
        </Paper>
        <div className="container">
					{values.map((item,index) => (
						<Chip variant="outlined" size="small" onDelete={()=>handleDelete(item,index)} label={item}/>
					))}
				</div>
      </FormControl>
      {
        !loading && 
        <Button
          onClick={clickSearchButton}
          variant="contained"
          style={{
            // borderRadius: 35,
            backgroundColor: "#58AD3A",
            // padding: "18px 36px",
            // fontSize: "18px"
            marginBottom: "5vh"
        }}
        >Search</Button>
      }
      {
        loading && 
        <ReactLoading 
          type="bubbles" color="black"
          height={100} width={50} />
      }
      <div>
      {
        renderWeather(weatherData)
      }
      </div>
    </div>
  );
}

export default App;
