import { useEffect, useState } from "react";
import NavBar from "../navBar/NavBar";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { getTasksDeletedAPI } from "../../redux/slices/Tasks/taskSlice";
import axiosURL from "../../axiosConfig/axiosURL";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";

const Trash = () => {
  const dispatch = useAppDispatch();
  const [mediumScreen, setMediumScreen] = useState(window.innerWidth <= 1024);
  const tasksDeleted = useAppSelector((state) => state.Task.tasksDeleted);
  console.log(tasksDeleted);

  useEffect(() => {
    dispatch(getTasksDeletedAPI());
    const handleResize = () => {
      setMediumScreen(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleElim = async (id: number): Promise<void> => {
    try {
      const { data } = await axiosURL.delete(`/task/${id}`);
      if(data) {
        await dispatch(getTasksDeletedAPI());
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  }

   const handleRestore = async (id:number): Promise<void> => {
    try {
      const { data } = await axiosURL.put(`/task/${id}`, { elim: false });
      if(data) {
        await dispatch(getTasksDeletedAPI());
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
   }

  return (
    <>
      <NavBar />
      {mediumScreen ? (
        <>
          <main className="pt-28 md:pt-52 flex flex-col items-center gap-24">
            <h1 className="text-center">Tareas Completadas</h1>
            <input type="text" placeholder="Buscar tarea..." className="w-72" />
            <section className="w-5/6">
              {tasksDeleted?.map((task) => (
                <article
                  key={task.id}
                  className="border border-white rounded-xl p-5 flex flex-col items-center gap-5 mb-5"
                >
                  <p>{task.description}</p>
                  <div className="border border-white w-1/2"></div>
                  <p>Importancia: {task.important}</p>
                  <div className="border border-white w-1/3"></div>
                  <p>
                    {new Date(task?.date).toLocaleString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div className="flex justify-between w-full">
                    <button onClick={() => handleRestore(task.id)}>Restaurar</button>
                    <button onClick={() => handleElim(task.id)}>Eliminar</button>
                  </div>
                </article>
              ))}
            </section>
          </main>
        <Footer/>
        </>
      ) : (
        <>
          <main className="pt-40 flex flex-col gap-20 pb-10">
            <header className="flex justify-evenly">
              <Link to={'/workSpace'}>
                Back
              </Link>
              <input
                type="text"
                className="w-96"
                placeholder="Buscar tarea..."
              />
              <h1>Tareas Completadas</h1>
            </header>

            <article className="w-4/6 m-auto">
              {tasksDeleted?.map((task) => (
                <section
                  key={task.id}
                  className="border border-white rounded-xl p-8 flex items-center justify-evenly gap-3 mb-5"
                >
                  <p className="border border-white rounded-lg w-5/6 h-36 p-5 text-wrap">{task.description}</p>

                  <div className="flex flex-col mx-10 items-center gap-3 text-center">
                  <p>Importancia: {task.important}</p>
                  <div className="border border-white w-full"></div>
                  <p>
                    {new Date(task?.date).toLocaleString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                  </p>
                    </div>
                  <div className="flex flex-col gap-5 items-center">
                    <button onClick={() => handleRestore(task.id)}>Restaurar</button>
                    <button onClick={() => handleElim(task.id)}>Eliminar</button>
                  </div>
                </section>
              ))}
            </article>
          </main>
        <Footer/>
        </>
      )}
    </>
  );
};
export default Trash;
