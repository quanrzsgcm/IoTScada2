import { Edit, SimpleForm, TextInput, DateInput, ReferenceInput, DeleteButton} from 'react-admin';
import { useParams } from 'react-router-dom';


export const ConnectionDetail = () => {
    const { id, connectionId } = useParams();

    return (
        <Edit resource="connections" id={connectionId} redirect={`/sites/${id}/connections`} >
            <SimpleForm >
                <ReferenceInput source="site_id" reference="sites" />
                <TextInput source="id" InputProps={{ disabled: true }} />
                <TextInput source="source" />
                <TextInput source="uri" />
            </SimpleForm>
        </Edit>
    );
};



