import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


export default function DatePickerValue( {importedFun} ) {
  const [value, setValue] = React.useState(dayjs('2022-11-06'));
  const handleTimeChange = (newValue) => {
    setValue(newValue);
    importedFun(newValue.toISOString());
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker']}>
        <DatePicker
          label="Controlled picker"
          value={value}
          onChange={handleTimeChange}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}