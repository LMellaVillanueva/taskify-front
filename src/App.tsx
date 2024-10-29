import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Landing from './components/Landing/Landing';
import WorkSpace from './components/WorkSpace/WorkSpace';
import Trash from './components/Trash/Trash';
import CrearCuenta from './components/CrearCuenta/CrearCuenta';
import { Toaster } from 'sonner';
import CheckIcon from "@mui/icons-material/Check";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import WarningIcon from '@mui/icons-material/Warning';
import { useEffect } from 'react';
import { useAppDispatch } from './redux/store';
import { getTasksAPI, getTasksDeletedAPI } from './redux/slices/Tasks/taskSlice';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        await dispatch(getTasksAPI());
        await dispatch(getTasksDeletedAPI());
      } catch (error) {
      if (error instanceof Error) console.error(error.message);
      }
    }
    fetchTasks();
  }, [])

  return (
    <>
      <BrowserRouter>
      <div className="fixed z-10">
          <Toaster
            position="top-center"
            duration={2000}
            toastOptions={{
              unstyled: true,
              classNames: {
                toast:
                  "bg-violet-100 dark:bg-black shadow-violet-950 font-serif shadow-lg dark:shadow-violet-800 w-full rounded-lg border border-black flex justify-start gap-5 items-center p-3 text-black dark:text-white z-50",
                title: "font-semibold",
              },
            }}
            icons={{
              success: (<CheckIcon fontSize="small" className="text-green-600" />),
              error: (<HighlightOffIcon fontSize="small" className="text-red-600" />),
              warning: (<WarningIcon fontSize="small" className="text-amber-500" />)
            }}
          />
        </div>
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