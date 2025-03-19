import { Routes, Route } from 'react-router-dom';
import { Events, User } from './components';
import { PrivateUserRoute } from './hooks';

export function RoutesComponent() {
  return (
    <Routes>
      <Route path='/' element={<div>Welcome Home</div>} />
      <Route path="/events" element={<PrivateUserRoute />}>
        <Route path="" element={<Events />} />
      </Route>
      <Route path='/user/*' element={<User/>}/>
    </Routes>
  );
}
