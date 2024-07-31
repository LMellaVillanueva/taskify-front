import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Landing from './components/Landing/Landing';
import WorkSpace from './components/WorkSpace/WorkSpace';
import Trash from './components/Trash/Trash';
import CrearCuenta from './components/CrearCuenta/CrearCuenta';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path='/workSpace' element={<WorkSpace/>}/>
          <Route path='/trash' element={<Trash/>}/>
          <Route path='/crearCuenta' element={<CrearCuenta/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;