import { List, Datagrid, TextField, useRecordContext, EditGuesser, Create, usePrevious, useReference, CreateButton, ExportButton } from 'react-admin';
import { Edit, ReferenceInput, SimpleForm, TextInput } from 'react-admin';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { TopToolbar } from 'react-admin';
import { useState, useEffect } from 'react';
import { useNotify, useRedirect } from 'react-admin';


const ListActions = () => (
    <TopToolbar>
        <TestButton />
        <ExportButton />
    </TopToolbar>
);

export const TagList = () => {
    const { id, deviceId } = useParams();
    console.log(id)
    console.log(deviceId)

    return (
        <List resource="tags" filter={{ deviceId: deviceId }} actions={<ListActions />} empty={false}>
            <Datagrid>
                <TextField source="name" />
                <TextField source="attribute" />
                <TextField source="type" />
                <TextField source="address" />
                {/* <EditSongButton /> */}
            </Datagrid>
        </List>
    );
};

const TestButton = () => {
    const { deviceId } = useParams();
    console.log(deviceId)
    return (
        <Button
            component={Link}
            to={`/tags/create/${deviceId}`}
            startIcon={<AddIcon />}
        >
            Create
        </Button>
    );
};

const EditSongButton = () => {
    const device = useRecordContext();
    return (
        <Button
            component={Link}
            to={`/sites/${device?.site_id}/devices/${device?.id}`}
            startIcon={<EditIcon />}
        >
            Edit
        </Button>
    );
};

export const DeviceEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" />
            <ReferenceInput source="site_id" reference="sites" />
            <TextInput source="manufacturer" />
            <TextInput source="model" />
            <TextInput source="serialNumber" />
            <TextInput source="location" />
        </SimpleForm>
    </Edit>
);

const customAction = () => {
    window.history.go(-1);
}

export const TagCreate = () => {

    const notify = useNotify();
    const redirect = useRedirect();

    const onSuccess = (data) => {
        notify(`Changes saved`);
        redirect(`/sites`);
        console.log(data);
    };
    const inverter = useParams()
    console.log(inverter)

    const [id, setId] = useState(null);

    useEffect(() => {
        // Get the current pathname
        const pathname = window.location.href;

        // Split the pathname by '/'
        const parts = pathname.split('/');

        // Extract the last part which should be the number
        const number = parts[parts.length - 1];
        const parsedId = parseInt(number);

        // Set the extracted number as id
        setId(parsedId);
    }, []);

    return (
        <Create mutationOptions={{ onSuccess }}>
            <SimpleForm>
                <TextInput defaultValue={id} source="deviceId" />
                <TextInput source="name" />
                <TextInput source="attribute" />
                <TextInput source="type" />
                <TextInput source="address" />
            </SimpleForm>
        </Create>
    );
}
