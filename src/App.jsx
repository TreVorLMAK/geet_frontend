import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from "./pages/Home";
import { useState } from "react";
import Login from './pages/Login';
import Register from './pages/Register';
import AddArtist from './pages/AddArtist';
import Artist from './pages/Artist';
import ArtistDetail from './components/ArtistDetail';

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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
