import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';

export default function CustomDateTimeFormat({ importFunction }) {
    const [value, setValue] = React.useState(null);
    React.useEffect(() => {
        // Update the value state with the current date and time
        setValue(dayjs());
        try {
            let valueAsString = dayjs().toISOString();
            importFunction(valueAsString);
            console.log("qwert");
        }
        catch (e) {
            console.log(e);
        }

    }, []);
    const handleChange = (newValue) => {
        setValue(newValue);
        console.log("ham duoc goi");
        try {
            let valueAsString = newValue.toISOString();
            importFunction(valueAsString);
        }
        catch (e) {
            console.log(e);
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
                components={['DateTimeField']}
            >
                <DateTimeField
                    label="Input start time"
                    value={value}
                    onChange={(newValue) => {
                        handleChange(newValue);
                    }
                    }
                    format="L HH:mm"
                />
            </DemoContainer>
        </LocalizationProvider>
    );
}
