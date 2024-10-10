import { useEffect, useState } from "react";
import NavBar from "../navBar/NavBar";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { getTasksAPI, getTasksDeletedAPI, searchATask } from "../../redux/slices/Tasks/taskSlice";
import axiosURL from "../../axiosConfig/axiosURL";
import { Link } from "react-router-dom";
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import Footer from "../Footer/Footer";

const Trash = () => {
  const dispatch = useAppDispatch();
  const [mediumScreen, setMediumScreen] = useState(window.innerWidth <= 1024);
  const user = useAppSelector(state => state.User.user);
  const deleteTasks = useAppSelector((state) => state.Task.tasksDeleted);
  const tasksDeleted = deleteTasks.filter((task) => task.user?.id === user[0]?.id)
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () => {
      setMediumScreen(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        await dispatch(getTasksDeletedAPI());
      } catch (error) {
        if (error instanceof Error) console.error(error.message);
      }
    };
    fetchTasks();
  }, []);

  const handleElim = async (id: number): Promise<void> => {
    try {
      const { data } = await axiosURL.delete(`/task/${id}`);
      if (data) {
        await dispatch(getTasksDeletedAPI());
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  };

  const handleRestore = async (id: number): Promise<void> => {
    try {
      const { data } = await axiosURL.put(`/task/${id}`, { elim: false });
      if (data) {
        await dispatch(getTasksDeletedAPI());
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  };

  const handleSearch = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    let description = event.target.value;
    if (description.length) {
      dispatch(searchATask(description.toUpperCase()));
    } else {
      await dispatch(getTasksDeletedAPI());
      await dispatch(getTasksAPI());
    }
  };

  return (
    <>
      <NavBar />
      {mediumScreen ? (
        <>
          <main className="pt-64 md:pt-52 py-10 flex flex-col items-center gap-24 text-black bg-gradient-to-bl from-white via-violet-200 to-purple-600 dark:bg-gradient-to-br dark:from-neutral-700 dark:via-black dark:to-violet-950">
            <h1 className="text-center text-4xl text-black dark:text-white font-titles">
              Tareas Completadas
            </h1>
            <div className="flex p-5 w-4/5 gap-8 justify-center">

            <input
            onChange={handleSearch}
            type="text"
            placeholder="Buscar tarea..."
            className="rounded-xl p-1 text-black border border-black w-72"
            />
            <Link to={"/workSpace"} className="dark:text-white text-lg px-5 py-2 rounded-xl bg-neutral-900 hover:bg-stone-700 text-white border-white border font-text">
              Volver
            </Link>
            </div>
            <section className="w-5/6 p-5 md:p-10">
              {tasksDeleted.length ? (
                tasksDeleted.map((task) => (
                  <article
                    key={task.id}
                    className="border border-black rounded-xl p-5 flex flex-col items-center gap-5 mb-5"
                    style={{ backgroundColor: task.color }}
                  >
                    <p className="font-medium text-xl"><LabelImportantIcon/>{task.description}</p>
                    <div className="border border-black rounded-xl w-3/4"></div>
                    <p>
                      Creada el: <b></b>
                      {new Date(task?.date).toLocaleString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <div className="flex justify-between w-full">
                      <button
                        onClick={() => handleRestore(task.id)}
                        className="m-auto mt-3 px-5 py-2 rounded-xl bg-neutral-900 hover:bg-stone-700 text-white border-white border"
                      >
                        Restaurar
                      </button>
                      <button
                        onClick={() => handleElim(task.id)}
                        className="m-auto mt-3 px-5 py-2 rounded-xl bg-neutral-900 hover:bg-stone-700 text-white border-white border"
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <article className="border border-black dark:border-white rounded-xl p-5 flex flex-col items-center gap-5 mb-5 py-5 text-black dark:text-white">
                  No hay tareas completas...
                </article>
              )}
            </section>
          </main>
          <Footer />
        </>
      ) : (
        <>
          <main className="pt-40 flex flex-col gap-20 py-10 text-black bg-gradient-to-bl from-white via-violet-200 to-purple-600 dark:bg-gradient-to-br dark:from-neutral-700 dark:via-black dark:to-violet-950">
            <header className="flex justify-evenly">
              <h1 className="text-4xl text-black dark:text-white font-titles">
                Tareas Completadas
              </h1>
              <input
            onChange={handleSearch}
                type="text"
                className="w-96 rounded-xl p-1 text-black border border-black"
                placeholder="Buscar tarea..."
              />
              <Link to={"/workSpace"} className="dark:text-white text-lg px-5 py-2 rounded-xl bg-neutral-900 hover:bg-stone-700 text-white border-white border font-text">
                Volver
              </Link>
            </header>

            <article className="w-4/6 m-auto p-5 md:p-10">
              {tasksDeleted.length ? (
                tasksDeleted.map((task) => (
                  <article
                    key={task.id}
                    className="border border-black rounded-xl p-5 flex flex-col items-center gap-5 mb-5 py-5"
                    style={{ backgroundColor: task.color }}
                  >
                    <p className="font-medium text-2xl"><LabelImportantIcon/>{task.description}</p>
                    <div className="border border-black rounded-xl w-1/2"></div>
                    <p>
                      {" "}
                      Creada el: <b></b>
                      {new Date(task?.date).toLocaleString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <div className="flex justify-between w-full">
                      <button
                        onClick={() => handleRestore(task.id)}
                        className="m-auto mt-3 px-5 py-2 rounded-xl bg-neutral-900 hover:bg-stone-700 text-white border-white border"
                      >
                        Restaurar
                      </button>
                      <button
                        onClick={() => handleElim(task.id)}
                        className="m-auto mt-3 px-5 py-2 rounded-xl bg-neutral-900 hover:bg-stone-700 text-white border-white border"
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <article className="border border-black dark:border-white rounded-xl p-5 flex flex-col items-center gap-5 mb-5 text-black dark:text-white">
                  No hay tareas completas...
                </article>
              )}
            </article>
          </main>
          <Footer />
        </>
      )}
    </>
  );
};
export default Trash;
