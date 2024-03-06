import { useRecordContext } from "react-admin";
import MapIcon from '@mui/icons-material/Map';

const MyUrlField = ({ source }: { source: string }) => {
    const record = useRecordContext();
    if (!record) return null;
    return <a href={`http://${record[source]}`}>{record[source]}
    <MapIcon sx={{ fontSize: 15, ml: 1 }} /></a>;
};

export default MyUrlField;