import { Edit, SimpleForm, TextInput, DateInput, ReferenceInput} from 'react-admin';
import { useParams } from 'react-router-dom';

export const InverterDetail = () => {
    const { id, inverterId } = useParams();
    return (
        <Edit resource="inverters" id={inverterId} redirect={`/sites/${id}/inverters`}>
            <SimpleForm>
                <TextInput source="id" InputProps={{ disabled: true }} />
                <ReferenceInput source="site_id" reference="sites" />
                <TextInput source="manufacturer" />
                <TextInput source="model" />
                <TextInput source="serialNumber" />
                <TextInput source="location" />
            </SimpleForm>
        </Edit>
    );
};