import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from "./pages/Home";
import { useState } from "react";
import Login from './pages/Login';
import Register from './pages/Register';
import AddArtist from './pages/AddArtist';
import Artist from './pages/Artist';
import ArtistDetail from './components/ArtistDetail';
import AlbumDetails from './components/AlbumDetails';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/add' element={<AddArtist />} />
        <Route path="/artist" element={<Artist />} />
        <Route path="/artist/:artistName" element={<ArtistDetail />} />
        <Route path="/albums/:artistName/:albumName/:albumId" element={<AlbumDetails />} />
        <Route path="/myprofile" element={<Profile />} />
        <Route path="/Profile/:username" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
