import { useEffect, useState } from "react";
import NavBar from "../navBar/NavBar";
import axiosURL from "../../axiosConfig/axiosURL";
import { Important, Task } from "../../types";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { getTasksAPI } from "../../redux/slices/Tasks/taskSlice";
import { Link } from "react-router-dom";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import styles from "./workSpace.module.css";
import Footer from "../Footer/Footer";

const WorkSpace = () => {
  const dispatch = useAppDispatch();

  const allTasks = useAppSelector((state) => state.Task.allTasks);
  const tasksElimFalse = allTasks.filter((task) => task.elim === false);
  const urgencyTask = tasksElimFalse.filter((task) => task.urgency === true);
  const importantTasks = tasksElimFalse.filter(
    (task) => task.urgency === false
  );

  const [calendarOpen, setCalendarOpen] = useState(false);
  const localizer = dayjsLocalizer(dayjs);

  const [task, setTask] = useState<Task>({
    id: 0,
    description: "",
    urgency: false,
    important: Important.HIGH,
    date: new Date(),
    elim: false,
  });

  useEffect(() => {
    dispatch(getTasksAPI());
  }, []);

  console.log(urgencyTask);

  const updateUrgency = async (id: number): Promise<void> => {
    try {
      const { data } = await axiosURL.put(`/task/${id}`, { urgency: true });
      if (data) {
        console.log(data);
        dispatch(getTasksAPI());
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  };

  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTask({
      ...task,
      description: event.target.value,
    });
  };

  const handleImportancy = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const value = event.currentTarget.value as keyof typeof Important;
    setTask({
      ...task,
      important: Important[value],
      urgency: false,
    });
  };

  const handleUrgency = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setTask({ ...task, urgency: true, important: Important.HIGH });
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    try {
      event.preventDefault();
      const { data } = await axiosURL.post("/task", task);
      if (data) {
        setTask({
          id: 0,
          description: "",
          urgency: false,
          important: Important.HIGH,
          date: new Date(),
          elim: false,
        });
        await dispatch(getTasksAPI());
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  };

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
    <>
      <NavBar />
      <main
        className={`pt-28 md:pt-52 px-5 lg:pt-40 flex flex-col lg:flex-row w-full justify-around items-center lg:items-baseline overflow-hidden gap-16 lg:gap-0 dark:bg-neutral-900 text-black dark:text-white`}
      >
        <section>
          <h1 className="text-center text-4xl">Crear Nueva Tarea</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-10 md:gap-7 pt-5 items-center"
          >
            <textarea
              name="description"
              id="description"
              cols={50}
              rows={3}
              value={task.description}
              onChange={handleDescription}
              className="w-4/5 md:w-full border border-black dark:border-white rounded-xl"
            ></textarea>
            <div className="flex justify-evenly gap-10 md:gap-0 md:w-full">
              <button onClick={handleUrgency} name="urgency">
                Urgencia
              </button>
              <div className="flex flex-col">
                <p>Importancia</p>
                <button
                  onClick={handleImportancy}
                  name={Important.HIGH}
                  value={Important.HIGH}
                >
                  HIGH
                </button>
                <button
                  onClick={handleImportancy}
                  name={Important.MEDIUM}
                  value={Important.MEDIUM}
                >
                  MEDIUM
                </button>
                <button
                  onClick={handleImportancy}
                  name={Important.LOW}
                  value={Important.LOW}
                >
                  LOW
                </button>
              </div>
            </div>
            <div className="flex justify-center md:w-full">
              <button onClick={() => setCalendarOpen(true)}>
                Recordatorio
              </button>
              {calendarOpen && (
                <div>
                  <button onClick={() => setCalendarOpen(false)}>X</button>
                  <Calendar className={styles.calendar} localizer={localizer} />
                </div>
              )}
            </div>
            <div className="flex justify-around gap-10 md:gap-0 md:w-full">
              <button>Color</button>
              <button type="submit">Agregar</button>
            </div>
          </form>
        </section>

        <section>
          <input
            type="text"
            placeholder="Buscar tarea..."
            style={{ width: "300px" }}
          />
        </section>

        <section>
          <h1 className="text-center text-4xl lg:pb-5">Mis Tareas</h1>
          <article className="flex flex-col gap-16 md:flex-row md:gap-20 pt-5 p-10 lg:p-0">
            <div className="text-center flex flex-col gap-2">
              <h2>Urgente</h2>
              <section className="flex p-4 border border-black dark:border-white rounded-xl h-96 w-44">
                {urgencyTask?.map((task) => (
                  <div
                    key={task.description}
                    className="flex flex-col justify-evenly lg:justify-around h-full m-auto lg:w-4/5"
                  >
                    <p className="text-3xl">{task.description}</p>
                    <div className="border border-black dark:border-white w-10/12 mx-auto"></div>
                    <p>
                      Debe estar lista para: <br></br>
                      {new Date(task?.date).toLocaleString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <button onClick={() => handleDelete(task.id)}>
                      Completar Tarea
                    </button>
                  </div>
                ))}
              </section>
            </div>

            <div className="border border-black dark:border-white w-full md:h-96"></div>

            <div className="text-center flex flex-col gap-2">
              <h2>Importancia</h2>
              <article className="flex flex-col items-center justify-around h-96 border border-black dark:border-white rounded-xl p-4 w-48 overflow-y-auto">
                {importantTasks?.map((task) => (
                  <>
                    <section key={task.description}>
                      <h3>{task.important}</h3>
                      <div className="border border-black dark:border-white w-10/12 mx-auto"></div>
                      <p className="text-xl">{task.description}</p>
                      <button onClick={() => handleDelete(task.id)}>
                        Completar Tarea
                      </button>
                      <button onClick={() => updateUrgency(task.id)}>
                        Urgente
                      </button>
                    </section>
                  </>
                ))}
              </article>
              <Link to={"/trash"} className="pt-2">
                Tareas Completadas
              </Link>
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
};
export default WorkSpace;
