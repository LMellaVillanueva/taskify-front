import { useSortable } from "@dnd-kit/sortable";
import axiosURL from "../../../axiosConfig/axiosURL";
import { getTasksAPI } from "../../../redux/slices/Tasks/taskSlice";
import { useAppDispatch } from "../../../redux/store";
import { Task } from "../../../types";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
// import { useEffect } from "react";

interface Prop {
  task: Task;
}

const ImportantTask: React.FC<Prop> = ({ task }) => {
  const dispatch = useAppDispatch();
  // const darkMode = window.localStorage.getItem('Theme');

  // useEffect(() => {
  //   const handleTaskColorByDarkMode = async () => {
  //     if (darkMode === 'dark') {
  
  //       switch (task.color) {
  //         case '#f87171':
  //           const {data} = await axiosURL.put(`/task/${task.id}`, { color: '#dc2626' });
  //           console.log(data)
            
  //           break;
        
  //         default:
  //           const response = await axiosURL.put(`/task/${task.id}`, { color: '#f87171' });
  //           console.log(response.data)
  //           break;
  //       }
  
  //     }
  //     getTasksAPI();
  //   }
  //   handleTaskColorByDarkMode();

  // }, [darkMode])


  const handleComplete = async (id: number): Promise<void> => {
    try {
      const { data } = await axiosURL.put(`/task/${id}`, { elim: true });
      if (data) {
        await dispatch(getTasksAPI());
        toast.success('Tarea Completada', {duration: 1500})
      }
    } catch (error) {
      toast.error('Oops...', {description: 'Algo salió mal'});
      if (error instanceof Error) console.error(error.message);
    }
  };
  
  const updateUrgency = async (id: number): Promise<void> => {
    try {
      const { data } = await axiosURL.put(`/task/${id}`, { urgency: true });
      if (data) {
        await dispatch(getTasksAPI());
        toast.success('Tarea urgente actualizada', {duration: 1500})
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  };

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: task.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1
  };

  return (
    <main ref={setNodeRef} {...attributes} style={style}>
      <section
        key={task.id}
        data-task-id={task.id}
        style={{ backgroundColor: task.color }}
        className="flex flex-col rounded-xl border gap-2 border-black items-center justify-center p-4 text-black md:w-56"
      >
        <div {...listeners} className="cursor-pointer flex flex-col items-center justify-center gap-3 w-28 md:w-48">
          <h3><LabelImportantIcon/>{task.description}</h3>
          <div className="border border-black w-32 mx-auto"></div>
          <p className="text-center">
          {new Date(task?.reminder).toLocaleString("es-ES", {
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        </div>

        <div className="p-2 flex flex-col items-center justify-center gap-2">
          <button className="hover:underline" onClick={() => handleComplete(task.id)}>Completar Tarea</button>
          <button className="hover:underline" onClick={() => updateUrgency(task.id)}>Urgente</button>
        </div>
      </section>
    </main>
  );
};
export default ImportantTask;
