import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from "./pages/Home";
import { useState } from "react";
import Login from './pages/Login';
import Register from './pages/Register';
import Artist from './pages/Artist';

const App = () => {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/login' element = {<Login/>}/>
      <Route path='/register' element = {<Register/>}/>
      <Route path='/artist' element = {<Artist/>}/>
    </Routes>
    </BrowserRouter>
  )
}
export default App;
