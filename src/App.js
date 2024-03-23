import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import React from 'react';
import HotelMap from './pages/HotelMap';
import EventsInfo from './pages/EventsInfo';
import CheckInInfo from './pages/CheckInInfo';

import AmenitiesSpa from './pages/amenities sub pages/AmenitiesSpa';
import AmenitiesDining from './pages/amenities sub pages/AmenitiesDining';
import AmenitiesEventSpace from './pages/amenities sub pages/AmenitiesEventSpace';
import AmenitiesRooms from './pages/amenities sub pages/AmenitiesRooms';
import Landing from './pages/Landing';
import LoginPage from './components/admin portal/LoginPage';
import ProtectedRoute from './components/protectected route/ProtectedRoute';
import AdminPortal from './components/admin portal/AdminPortal';

function App() {
  const [isAuthenticated, setState] = React.useState(false);
  const login = () => {
    setState(true);
  };

  const logout = () => {
    setState(false);
  };

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Landing/>} />
          <Route path="/home" exact element={<Home/>} />
          <Route path="/property_map" element={<HotelMap/>} />
          <Route path="/events_info" element={<EventsInfo/>} />
          <Route path="/checkInOut" element={<CheckInInfo/>} />
          <Route path="/spa" element={<AmenitiesSpa/>} />
          <Route path="/dining" element={<AmenitiesDining/>} />
          <Route path="/event_spaces" element={<AmenitiesEventSpace/>} />
          <Route path="/rooms" element={<AmenitiesRooms/>} />
          <Route path="/login" element={<LoginPage login={login} />}/>
          {isAuthenticated ? (
            <Route path="/admin_portal" element={<AdminPortal/>} />
          ) : <Route path="/login" element={<LoginPage login={login} />}/>}
        </Routes>
    </BrowserRouter>
  );
}

export default App;
