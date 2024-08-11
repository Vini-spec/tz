import React, { useState } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Button } from '@mui/material';
import axios from "axios";


const Form = ({ onUpload, onDateChange }) => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();



  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    
    const formData = new FormData();
    formData.append('file', file);
    const result = await axios.post('http://localhost:3000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    onUpload(result.data.data)
  };
  return (
    <div>
      <div className="file-upload">
        <button className="file-upload-button">Выбрать файл</button>
        <input id="file-input" type="file" accept=".csv" onChange={handleFileUpload} />
        
      </div>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="date-pickers">
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
        <Button variant="contained" color="primary" onClick={() => onDateChange(startDate, endDate)}>
          Отправить
        </Button>
      </LocalizationProvider>
    </div>
  );

}

export default Form;