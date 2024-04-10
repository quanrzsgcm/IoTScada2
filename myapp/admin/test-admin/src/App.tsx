import { Admin, Resource, ShowGuesser, ListGuesser, EditGuesser, } from "react-admin";
import { Route } from 'react-router-dom';
import { SiteList, SiteEdit, SiteCreate } from "./sites";
import { PostList, PostEdit, PostCreate } from "./posts";
import PlaceIcon from '@mui/icons-material/Place';
import { Dashboard } from "./Dashboard";
import NotFound from "./NotFound";
import { InverterList } from "./InverterList";
import { ConnectionList } from "./ConnectionList";
import customDataProvider from "./customDataprovider";
// const dataProvider = drfProvider("http://localhost:8000/myadmin");
import { InverterDetail } from "./InverterDetail";
import { InverterCreate } from "./InverterList";
import { ConnectionDetail } from "./ConnectionDetail";
import { DeviceList } from "./DeviceList";
import { DeviceDetail } from "./DeviceDetail";
import { DeviceCreate } from "./DeviceList";
import { TagList, TagCreate } from "./TagList";
import { ConnectionListNew, ConnectionCreate } from "./ConnectionListNew";



export const App = () => <Admin title="My Custom Admin" catchAll={NotFound} dataProvider={customDataProvider('http://192.168.1.209:8000/myadmin')} dashboard={Dashboard}>
  <Resource name="sites" list={SiteList} icon={PlaceIcon} edit={SiteEdit} show={ShowGuesser} create={SiteCreate}>
    <Route path=":id/inverters" element={<InverterList />} />
    <Route path=":id/inverters/:inverterId" element={<InverterDetail />} />
    <Route path=":id/devices" element={<DeviceList />} />
    <Route path=":id/devices/:deviceId" element={<DeviceDetail />} />
    <Route path=":id/devices/:deviceId/tags" element={<TagList />} />
    <Route path=":id/connections" element={<ConnectionList />} />
    <Route path=":id/connections/:connectionId" element={<ConnectionDetail />} />
    <Route path=":id/connectionsnew" element={<ConnectionListNew />} />
    <Route path=":id/connectionsnew/:connectionnewId" element={<ConnectionDetail />} />
  </Resource>
  <Resource name="inverters" show={ShowGuesser} create={InverterCreate} />
  <Resource name="devices" show={ShowGuesser} create={DeviceCreate} />
  <Resource name="connectionsnew" list={ListGuesser} show={ShowGuesser} create={ConnectionCreate}/>
  <Resource name="tags" show={ShowGuesser} create={TagCreate}/>
</Admin>;
