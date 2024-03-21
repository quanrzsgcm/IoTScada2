import { List, Datagrid, SimpleForm, TextInput, Create, TextField, useRecordContext, ReferenceField, ExportButton, TopToolbar } from 'react-admin';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useNotify, useRedirect } from 'react-admin';
import { useState, useEffect } from 'react';

const ListActions = () => (
    <TopToolbar>
        <TestButton />
        <ExportButton />
    </TopToolbar>
);

const TestButton = () => {
    const { id } = useParams();
    console.log(id)
    return (
        <Button
            component={Link}
            to={`/connections/create/${id}`}
            startIcon={<AddIcon />}
        >
            Createee
        </Button>
    );
};

export const ConnectionList = () => {
    const { id } = useParams();

    return (
        <List resource="connections" filter={{ site_id: id }} actions={<ListActions />} >
            <Datagrid>
                <TextField source="id" />
                <TextField source="uri" />
                <TextField source="source" />
                <EditConnectionButton />
            </Datagrid>
        </List>

    );
};

const EditConnectionButton = () => {
    const connection = useRecordContext();
    return (
        <Button
            component={Link}
            to={`/sites/${connection?.site_id}/connections/${connection?.id}`}
            startIcon={<EditIcon />}
        >
            Edit
        </Button>
    );
};

export const ConnectionCreate = () => {

    const notify = useNotify();
    const redirect = useRedirect();

    const onSuccess = (data) => {
        notify(`Changes saved`);
        redirect(`/sites/${data.siteId}/connections/`);
        console.log(data);
    };
    const connection = useParams()
    console.log(connection)

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
                <TextInput source="id" />
                <TextInput source="uri" />
                <TextInput source="source" />
            </SimpleForm>
        </Create>
    );
}
