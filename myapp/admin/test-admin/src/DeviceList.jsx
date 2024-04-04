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
export const DeviceList = () => {
    const { id } = useParams();
    return (
        <List resource="devices" filter={{ site_id: id }} actions={<ListActions />} >
            <Datagrid>
                <TextField source="manufacturer" />
                <TextField source="model" />
                <TextField source="serialNumber" />
                <TextField source="location" />
                <TextField source="connectionStatus" />
                <EditSongButton />
                <TagButton />
            </Datagrid>
        </List>
    );
};

const TestButton = () => {
    const { id } = useParams();
    console.log(id)
    return (
        <Button
            component={Link}
            to={`/devices/create/${id}`}
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
            Config
        </Button>
    );
};

const TagButton = () => {
    const device = useRecordContext();
    return (
        <Button
            component={Link}
            to={`/sites/${device?.site_id}/devices/${device?.id}/tags`}
            startIcon={<EditIcon />}
        >
            Tags
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



export const DeviceCreate = () => {

    const notify = useNotify();
    const redirect = useRedirect();

    const onSuccess = (data) => {
        notify(`Changes saved`);
        redirect(`/sites/${data.siteId}/devices/`);
        console.log(data);
    };
    const device = useParams()
    console.log(device)

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
                <TextInput defaultValue={id} source="siteId" />
                <TextInput source="manufacturer" />
                <TextInput source="model" />
                <TextInput source="serialNumber" />
                <TextInput source="location" />
            </SimpleForm>
        </Create>
    );
}
