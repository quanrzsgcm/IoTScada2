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
export const InverterList = () => {
    const { id } = useParams();
    return (
        <List resource="inverters" filter={{ site_id: id }} actions={<ListActions />} >
            <Datagrid>
                <TextField source="manufacturer" />
                <TextField source="model" />
                <TextField source="serialNumber" />
                <TextField source="location" />
                <EditSongButton />
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
            to={`/inverters/create/${id}`}
            startIcon={<AddIcon />}
        >
            Create
        </Button>
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

export const InverterEdit = () => (
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



export const InverterCreate = () => {

    const notify = useNotify();
    const redirect = useRedirect();

    const onSuccess = (data) => {
        notify(`Changes saved`);
        redirect(`/sites/${data.siteId}/inverters/`);
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
                <TextInput defaultValue={id} source="siteId" />
                <TextInput source="manufacturer" />
                <TextInput source="model" />
                <TextInput source="serialNumber" />
                <TextInput source="location" />
            </SimpleForm>
        </Create>
    );
}
