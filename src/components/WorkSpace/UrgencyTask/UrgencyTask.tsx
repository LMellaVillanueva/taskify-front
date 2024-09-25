import { toast } from "sonner";
import axiosURL from "../../../axiosConfig/axiosURL";
import { getTasksAPI } from "../../../redux/slices/Tasks/taskSlice";
import { useAppDispatch } from "../../../redux/store";
import { Task } from "../../../types";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import "./urgencyTask.module.css";

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
        toast.success("Tarea Completada", { duration: 1500 });
      }
    } catch (error) {
      toast.error("Oops...", { description: "Algo salió mal" });
      if (error instanceof Error) console.error(error.message);
    }
  };

  return (
    <main>
      <section
        key={task.id}
        className="flex flex-col rounded-xl border-2 border-black items-center gap-6 h-96 p-4 text-black"
        style={{ backgroundColor: task.color }}
      >
        <p className="text-2xl text-center w-full break-words p-1 overflow-y-auto">
          {task.description}
        </p>
        <NewReleasesIcon fontSize="small" />
        <div className="border border-black w-10/12 mx-auto"></div>

        {/* {today > reminderDate &&  */}
        <p className="text-center">
          Debe estar lista para: <br />
          {new Date(task?.reminder).toLocaleString("es-ES", {
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        {/* } */}
        <button
          onClick={() => handleComplete(task.id)}
          className="text-center p-2 anim"
        >
          Completar Tarea
          {/* animacion */}
          {/* <div className={` border border-black h-fit mt-1`}></div> */}
        </button>
      </section>
    </main>
  );
};
export default UrgencyTask;
