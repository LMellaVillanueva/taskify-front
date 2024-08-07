import React, { useEffect, useState } from "react";
import NavBar from "../navBar/NavBar";
import axiosURL from "../../axiosConfig/axiosURL";
import { Important, Task } from "../../types";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { getTasksAPI, searchATask } from "../../redux/slices/Tasks/taskSlice";
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
  const [colorModal, setColorModal] = useState(false);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const localizer = dayjsLocalizer(dayjs);

  const [descriptionNotCreated, setDescriptionNotCreated] = useState("");

  const [task, setTask] = useState<Task>({
    id: 0,
    description: "",
    urgency: false,
    important: Important.HIGH,
    date: new Date(),
    elim: false,
    color: "white",
  });

  useEffect(() => {
    dispatch(getTasksAPI());
  }, []);

  const updateUrgency = async (id: number): Promise<void> => {
    try {
      const { data } = await axiosURL.put(`/task/${id}`, { urgency: true });
      if (data) {
        dispatch(getTasksAPI());
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  };

  // any para manejar funciones desde un textArea y un input normal
  const handleDescription = (event: any) => {
    setTask({
      ...task,
      description: event.target.value,
    });
    setDescriptionNotCreated(event.target.value);
  };

  // any para manejar funciones desde un button y un select
  const handleImportancy = (event: any) => {
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

  const handleColor = (color: string) => {
    setTask({
      ...task,
      color: color,
    });
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    try {
      event.preventDefault();
      const { data } = await axiosURL.post("/task", task);
      if (data) {
        console.log(data);
        setTask({
          id: 0,
          description: "",
          urgency: false,
          important: Important.HIGH,
          date: new Date(),
          elim: false,
          color: "",
        });
        await dispatch(getTasksAPI());
        setDescriptionNotCreated('');
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  };
  console.log(task)

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

  const handleSearch = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    let description = event.target.value;
    setDescriptionNotCreated(description);
    if (description.length) {
      await dispatch(searchATask(description.toUpperCase()));
    } else {
      await dispatch(getTasksAPI());
      // description = '';
    }
  };

  return (
    <React.Fragment>
      <NavBar />
      <main
        className={`pt-28 md:pt-52 px-5 pb-32 lg:pt-48 flex flex-col lg:flex-row w-full justify-around items-center lg:items-baseline overflow-hidden gap-16 lg:gap-0 dark:bg-neutral-900 text-black dark:text-white`}
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
              className="w-4/5 md:w-full border border-black dark:border-white rounded-xl text-black p-1"
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
              <button type="button" onClick={() => setColorModal(true)}>
                Color
              </button>

              {/* Cambiar el color de la task */}
              {colorModal && (
                <section className="absolute m-auto inset-0 w-1/3 h-2/3 bg-amber-100 rounded-xl p-4">
                  <button type="button" onClick={() => setColorModal(false)}>
                    X
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-white text-transparent bg-red-200"
                    onClick={() => {
                      handleColor("#ec8383");
                      setColorModal(false);
                    }}
                  >
                    red
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-white text-transparent bg-green-200"
                    onClick={() => {
                      handleColor("#91ec83");
                      setColorModal(false);
                    }}
                  >
                    red
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-white text-transparent bg-blue-200"
                    onClick={() => {
                      handleColor("#8399ec");
                      setColorModal(false);
                    }}
                  >
                    red
                  </button>
                </section>
              )}
              <button type="submit">Agregar</button>
            </div>
          </form>
        </section>

        <section className="flex flex-col gap-10">
          <input
            onChange={handleSearch}
            value={descriptionNotCreated}
            type="text"
            placeholder="Buscar tarea..."
            style={{ width: "300px" }}
            className="rounded-xl p-1 text-black border border-black"
          />
          {descriptionNotCreated.length > 0 && importantTasks.length <= 0 && (
            <form
              onSubmit={handleSubmit}
              className="border border-black dark:border-white rounded-xl flex flex-col items-center justify-evenly p-3 h-72"
            >
              <h3>¿Quieres crear esta tarea?</h3>
              <input
                type="text"
                placeholder={descriptionNotCreated}
                className="text-black"
                onChange={handleDescription}
                value={descriptionNotCreated}
              />
              <button onClick={handleUrgency}>Urgencia</button>
              <select
                name="important"
                id=""
                className="text-black dark:text-white"
                onClick={handleImportancy}
              >
                <option value={Important.HIGH}>Importancia</option>
                <option value={Important.HIGH}>HIGH</option>
                <option value={Important.MEDIUM}>MEDIUM</option>
                <option value={Important.LOW}>LOW</option>
              </select>
              <button type="submit">Crear</button>
            </form>
          )}
        </section>

        <section>
          <h1 className="text-center text-4xl lg:pb-5">Mis Tareas</h1>
          <article className="flex flex-col gap-16 md:flex-row md:gap-20 pt-5 p-10 lg:p-0">
            <div className="text-center flex flex-col gap-2">
              <h2>Urgente</h2>
              <section className="flex p-4 border border-black dark:border-white rounded-xl h-96 w-44">
                {urgencyTask?.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col justify-evenly lg:justify-around h-full m-auto lg:w-4/5"
                    style={{ backgroundColor: task.color }}
                  >
                    <p className="text-2xl">{task.description}</p>
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
              <article className="flex flex-col items-center justify-around h-96 border border-black dark:border-white rounded-xl p-4 w-48 overflow-y-auto dark:text-black">
                {importantTasks?.map((task) => (
                  <>
                    <section
                      key={task.id}
                      data-task-id={task.id}
                      style={{ backgroundColor: task.color }}
                      className="p-2 rounded-xl"
                    >
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
    </React.Fragment>
  );
};
export default WorkSpace;
