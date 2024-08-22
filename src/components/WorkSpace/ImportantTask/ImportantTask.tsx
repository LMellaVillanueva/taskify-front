import { useSortable } from "@dnd-kit/sortable";
import axiosURL from "../../../axiosConfig/axiosURL";
import { getTasksAPI } from "../../../redux/slices/Tasks/taskSlice";
import { useAppDispatch } from "../../../redux/store";
import { Task } from "../../../types";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";

interface Prop {
  task: Task;
}

const ImportantTask: React.FC<Prop> = ({ task }) => {
  const dispatch = useAppDispatch();

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

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <main ref={setNodeRef} {...attributes} style={style}>
      <section
        key={task.id}
        data-task-id={task.id}
        style={{ backgroundColor: task.color }}
        className="p-2 rounded-xl text-black"
      >
        <div {...listeners} className="cursor-pointer">
          <h3>{task.important}</h3>
          <div className="border border-black w-10/12 mx-auto"></div>
          <p className="text-xl p-1">{task.description}</p>
        </div>

        <div className="p-2">
          <button onClick={() => handleComplete(task.id)}>Completar Tarea</button>
          <button onClick={() => updateUrgency(task.id)}>Urgente</button>
        </div>
      </section>
    </main>
  );
};
export default ImportantTask;
