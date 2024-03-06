import { List, Datagrid, TextField, useRecordContext, ReferenceField } from 'react-admin';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

export const ConnectionList = () => {
    const { id   } = useParams();
    console.log("id ", id );

    return (
        <List resource="connections" filter={{ site_id: id  }}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="uri" />
                <TextField source="source" />
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