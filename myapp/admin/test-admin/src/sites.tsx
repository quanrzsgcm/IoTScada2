import { Datagrid, List, TextField, EditButton, Show , SimpleShowLayout, useRecordContext  } from 'react-admin';
import MyUrlField from "./MyLocationField";
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Edit, SimpleForm, TextInput, Create } from 'react-admin';

export const SiteList = () => (
    <List>
        <Datagrid>
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
            to={`/sites/${record.id}/devices`}
            color="primary"
        >
            Devices
        </Button>
    );
};

const ConnectionButton = () => {
    const record = useRecordContext();
    return (
        <Button
            component={Link}
            to={`/sites/${record.id}/connectionsnew`}
            color="primary"
        >
            Connections
        </Button>
    );
};

export const SiteEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" InputProps={{ disabled: true }}/>
            <TextInput source="siteName" />
            <TextInput source="location" />
        </SimpleForm>
    </Edit>
);

export const SiteCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="siteName" />
            <TextInput source="location" />
        </SimpleForm>
    </Create>
);