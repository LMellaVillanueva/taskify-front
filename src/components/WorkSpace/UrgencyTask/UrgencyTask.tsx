import axiosURL from "../../../axiosConfig/axiosURL";
import { getTasksAPI } from "../../../redux/slices/Tasks/taskSlice";
import { useAppDispatch } from "../../../redux/store";
import { Task } from "../../../types";

interface Prop {
    task: Task;
  }

const UrgencyTask: React.FC<Prop> = ({ task }) => {

    const dispatch = useAppDispatch();

    const handleDelete = async (id: number): Promise<void> => {
        try {
          const { data } = await axiosURL.put(`/task/${id}`, { elim: true });
          if (data) {
            await dispatch(getTasksAPI());
          }
        } catch (error) {
          if (error instanceof Error) console.error(error.message);
        }
      };

  return (
    <main>
      <section
        key={task.id}
        className="flex flex-col justify-evenly lg:justify-around h-full m-auto lg:w-4/5 text-black"
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
        <button onClick={() => handleDelete(task.id)}>Completar Tarea</button>
      </section>
    </main>
  );
};
export default UrgencyTask;
