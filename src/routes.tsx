import { Routes, Route } from 'react-router-dom';
import { CreateUpdateEvent, Events, User } from './components';
import { PrivateUserRoute } from './hooks';

export function RoutesComponent() {
  return (
    <Routes>
      <Route path='/' element={<div>Welcome Home</div>} />
      <Route path="/events" element={<PrivateUserRoute />}>
        <Route index element={<Events />} />
        <Route path="create-update-event" element={<CreateUpdateEvent />} />
        <Route path='create-update-event/:eventId' element={<CreateUpdateEvent />} />
      </Route>
      <Route path='/user/*' element={<User/>}/>
    </Routes>
  );
}
