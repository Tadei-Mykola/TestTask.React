import { CreateUpdateEvent, EventsList } from '../../components';
import { StatusProvider } from '../../hooks';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


export function Events() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StatusProvider>
            <CreateUpdateEvent/>
            <EventsList/>
        </StatusProvider>
    </LocalizationProvider>
  );
}

