import { Datagrid, List, TextField, EditButton, Show , SimpleShowLayout, useRecordContext  } from 'react-admin';
import MyUrlField from "./MyLocationField";
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

export const SiteList = () => (
    <List>
        <Datagrid >
            <TextField source="id" />
            <TextField source="siteName" />
            <MyUrlField source="location" />
            <InverterButton />
            <ConnectionButton />
            <EditButton />
        </Datagrid>
    </List>
);

export const SiteShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="siteName" />
            <TextField source="location" />
        </SimpleShowLayout>
    </Show>
);

const InverterButton = () => {
    const record = useRecordContext();
    return (
        <Button
            component={Link}
            to={`/sites/${record.id}/inverters`}
            color="primary"
        >
            Inverter
        </Button>
    );
};

const ConnectionButton = () => {
    const record = useRecordContext();
    return (
        <Button
            component={Link}
            to={`/sites/${record.id}/connections`}
            color="primary"
        >
            Connections
        </Button>
    );
};