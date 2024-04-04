import { Edit, SimpleForm, TextInput, DateInput, ReferenceInput} from 'react-admin';
import { useParams } from 'react-router-dom';

export const DeviceDetail = () => {
    const { id, deviceId } = useParams();
    return (
        <Edit resource="devices" id={deviceId} redirect={`/sites/${id}/devices`}>
            <SimpleForm>
                <TextInput source="id" InputProps={{ disabled: true }} />
                <ReferenceInput source="site_id" reference="sites" />
                <TextInput source="manufacturer" />
                <TextInput source="model" />
                <TextInput source="serialNumber" />
                <TextInput source="location" />
                <TextInput source="host" />
                <TextInput source="port" />
         
            </SimpleForm>
        </Edit>
    );
};