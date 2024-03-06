import { Admin, Resource, ShowGuesser, ListGuesser, EditGuesser,  } from "react-admin";
import { Route } from 'react-router-dom';
import { UserList } from "./users";
import { SiteList } from "./sites";
import { PostList, PostEdit, PostCreate } from "./posts";
import PlaceIcon from '@mui/icons-material/Place';
import { Dashboard } from "./Dashboard";
import drfProvider from 'ra-data-django-rest-framework';
import dataProviderinWritingADataProvider from "./dataProviderinWritingADataProvider";
import { dataProvider } from './dataProviderfirst';
import NotFound from "./NotFound";
import { InverterList } from "./InverterList";
import { ConnectionList } from "./ConnectionList";
// const dataProvider = drfProvider("http://localhost:8000/myadmin");


export const App = () => <Admin title="My Custom Admin" catchAll={NotFound} dataProvider={dataProvider} dashboard={Dashboard}>
  <Resource name="sites" list={SiteList} icon={PlaceIcon} edit={EditGuesser}>
    <Route path=":id/inverters" element={<InverterList />} />
    <Route path=":id/connections" element={<ConnectionList />} />

  </Resource>
  <Resource name="connections" list={ListGuesser} show={ShowGuesser} />

  <Resource name="users" list={ListGuesser} />
  <Resource name="posts" list={PostList} create={PostCreate} edit={PostEdit} show={ShowGuesser} />
  {/* <Resource name="users" list={UserList} show={ShowGuesser} recordRepresentation="name" icon={UserIcon}/> */}
</Admin>;
