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


export const App = () => <Admin title="My Custom Admin" catchAll={NotFound} dataProvider={customDataProvider('http://localhost:8000/myadmin')} dashboard={Dashboard}>
  <Resource name="sites" list={SiteList} icon={PlaceIcon} edit={SiteEdit} show={ShowGuesser} create={SiteCreate}>
    <Route path=":id/inverters" element={<InverterList />} />
    <Route path=":id/inverters/:inverterId" element={<InverterDetail />} />
    <Route path=":id/connections" element={<ConnectionList />} />
  </Resource>
  <Resource name="inverters" show={ShowGuesser} create={InverterCreate} />
  {/* <Resource name="connections" list={ListGuesser} show={ShowGuesser} />

  <Resource name="users" list={ListGuesser} />
  <Resource name="posts" list={PostList} create={PostCreate} edit={PostEdit} show={ShowGuesser} /> */}
  {/* <Resource name="users" list={UserList} show={ShowGuesser} recordRepresentation="name" icon={UserIcon}/> */}
</Admin>;
