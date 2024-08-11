import React from "react"
import { useState } from "react"
import { useEffect } from "react"
import Form from "./components/Form"
import Chart from "./components/Chart"
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import './App.css';




const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  useEffect(() => {
    axios.get('http://localhost:3000/data').then((data) => {
      setData(data.data)
    })
  }, [])

  useEffect(() => {
    
    const filtered = data.filter(item => {
      if(!startDate|| !endDate){
        return true
      }
      const date = dayjs(item.timestamp);
      return date.isAfter(startDate) && date.isBefore(endDate);
    });

    setFilteredData(filtered);
  }, [data, startDate, endDate]);

  const handleUpload = async (data) => {
    setData(data)
  };

  const handleDateChange = (start, end) => {
    axios.get(`http://localhost:3000/filter?start=${start.toISOString()}&end=${end.toISOString()}`).then((data) => {
      setData(data.data)
    })
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="app-container">
        <h1>CSV Uploader and Chart Viewer</h1>
        <div className="content">
          <Chart data={filteredData} />
          <div className="controls">
            <Form onUpload={handleUpload} onDateChange={handleDateChange} />
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default App;
