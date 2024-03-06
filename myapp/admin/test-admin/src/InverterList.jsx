import { List, Datagrid, TextField, useRecordContext } from 'react-admin';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

export const InverterList = () => {
    const { id } = useParams();
    return (
        <List resource="inverters" filter={{ site_id: id }}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="manufacturer" />
                <TextField source="model" />
                <TextField source="serialNumber" />
                <TextField source="location" />         
                {/* <EditSongButton /> */}
            </Datagrid>
        </List>
    );
};

const EditSongButton = () => {
    const inverter = useRecordContext();
    return (
        <Button
            component={Link}
            to={`/sites/${inverter?.site_id}/inverters/${inverter?.id}`}
            startIcon={<EditIcon />}
        >
            Edit
        </Button>
    );
};