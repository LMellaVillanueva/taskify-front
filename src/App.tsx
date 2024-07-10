import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Landing from './components/Landing/Landing';
import WorkSpace from './components/WorkSpace/WorkSpace';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path='/workSpace' element={<WorkSpace/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;