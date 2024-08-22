import { toast } from "sonner";
import axiosURL from "../../../axiosConfig/axiosURL";
import { getTasksAPI } from "../../../redux/slices/Tasks/taskSlice";
import { useAppDispatch } from "../../../redux/store";
import { Task } from "../../../types";

interface Prop {
    task: Task;
  }

const UrgencyTask: React.FC<Prop> = ({ task }) => {

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

  return (
    <main>
      <section
        key={task.id}
        className="flex flex-col rounded-xl border-2 border-black justify-evenly lg:justify-around h-80 p-2 text-black"
        style={{ backgroundColor: task.color }}
      >
        <p className="text-2xl">{task.description}</p>
        <div className="border border-black w-10/12 mx-auto"></div>
        <p>
          Debe estar lista para: <br></br>
          {new Date(task?.reminder).toLocaleString("es-ES", {
            // year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <button onClick={() => handleComplete(task.id)}>Completar Tarea</button>
      </section>
    </main>
  );
};
export default UrgencyTask;
