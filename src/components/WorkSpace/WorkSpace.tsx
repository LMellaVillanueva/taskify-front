//!Hooks
import React, { useEffect, useState } from "react";
import axiosURL from "../../axiosConfig/axiosURL";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  getTasksAPI,
  getTasksDeletedAPI,
  reOrderTasks,
  searchATask,
} from "../../redux/slices/Tasks/taskSlice";
import { Link } from "react-router-dom";

//!Components
import NavBar from "../navBar/NavBar";
import { Task, TasksList } from "../../types";
import Footer from "../Footer/Footer";
import UrgencyTask from "../Task/UrgencyTask/UrgencyTask";
import ImportantTask from "../Task/ImportantTask/ImportantTask";

//Css & Icons
import styles from "./workSpace.module.css";
import CloseIcon from "@mui/icons-material/Close";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

//!DragAndDrop
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

//!Selector de fechas
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import emailjs from "@emailjs/browser";

//!Notificaciones
import { toast } from "sonner";
import ColorTask from "../Task/ColorTask/ColorTask";
import UpdateCompletedTask from "../Task/UpdateCompletedTask/UpdateCompletedTask";

const WorkSpace = () => {
  const dispatch = useAppDispatch();

  //!States
  const user = useAppSelector((state) => state.User.user);
  const allTasks = useAppSelector((state) => state.Task.allTasks);

  const userTasks = allTasks.filter((task) => task.user?.id === user[0]?.id);

  const urgencyTask = userTasks.filter((task) => task.urgency === true);
  const importantTasks = userTasks.filter((task) => task.urgency === false);
  const [colorOpen, setColorOpen] = useState(false);
  const [colorClose, setColorClose] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarClose, setCalendarClose] = useState(false);
  const [descriptionNotCreated, setDescriptionNotCreated] = useState("");
  const [task, setTask] = useState<Task>({
    id: 0,
    description: "",
    urgency: false,
    date: new Date(),
    elim: false,
    completed: false,
    color: "white",
    reminder: new Date(),
    userId: user[0]?.id,
  });
  const [reminder, setReminder] = useState(new Date());
  const [dateReminder, setDateReminder] = useState(false);
  const [hourReminder, setHourReminder] = useState(false);
  const [taskCompletedOpen, setTaskCompletedOpen] = useState(false);
  const [taskCompletedClose, setTaskCompletedClose] = useState(false);
  const [taskToComplete, setTaskToComplete] = useState<TasksList>([]);
  const [showModal, setShowModal] = useState(false);
  const [info, setInfo] = useState({
    from_name: "",
    to_email: "",
    message: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    setInfo({
      ...info,
      from_name: user[0]?.name,
      to_email: user[0]?.email,
    });
  }, []);
  console.log(user[0]?.name);
  console.log(taskToComplete);

  //! comparar la fecha del recordatorio con la fecha actual
  useEffect(() => {
    const intervalId = setInterval(() => {
      const today = new Date();
      let tasksToComplete: TasksList = [];

      userTasks.forEach((task) => {
        const reminderDate = new Date(task.reminder);

        const reminderCoincidence = reminderDate.getTime() <= today.getTime();

        if (reminderCoincidence) {
          tasksToComplete.push(task);

          if (!taskToComplete.some((taskSaved) => taskSaved.id === task.id)) {
            //!para usarlo como array de dependencias en useEffect del modal
            setTaskToComplete([...taskToComplete, task]);
            setShowModal(!showModal);
          }
        }
      });

      const taskNames = tasksToComplete
        .map((task) => task.description)
        .join(", ");

      if (
        taskToComplete.length &&
        !taskToComplete.some((task) => task.completed)
      ) {
        const updatedInfo = { ...info, message: taskNames };

        setInfo(updatedInfo);

        console.log("RECORDATORIO ENVIADO!");

        const mailSimulated = async () => {
          try {
            const completedTasks = tasksToComplete.map(async (task) => {
              const { data } = await axiosURL.put(`/task/${task.id}`, {
                completed: true,
              });
              return data;
            });
            const allTasksCompleted = await Promise.all(completedTasks);
            setTaskToComplete(allTasksCompleted);
            console.log(completedTasks);
            setShowModal(true);
          } catch (error) {
            if (error instanceof Error) console.error(error);
          }

          // emailjs
          // .send("service_0jum38a", "template_w8rf65t", updatedInfo, {
          //   publicKey: "zADAsfTnn9pOJcyPO",
          // })
          // .then(
          //   async () => {
          //     setInfo({ ...info, message: "" });

          //     // al enviar el correo se actualiza el task a completed true
          //   const completedTasks = tasksToComplete.map((task) => {
          //     axiosURL.put(`/task/${task.id}`, {
          //       completed: true,
          //     });
          //     setTaskToComplete([task]);
          //   });
          //   await Promise.all(completedTasks);
          //   setShowModal(true);
          // },
          //   (error) => {
          //     console.log("FAILED...", error.text);
          //     toast.error("Recordatorio no enviado");
          //     }
          //   );
        };
        mailSimulated();
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [userTasks, info]);

  useEffect(() => {
    //verificar si una tarea esta completa y ya se envió el correo
    const reminderSent = taskToComplete.some((task) => task.completed === true);

    if (reminderSent) {
      setTimeout(() => {
        setTaskCompletedOpen(true);
        setTaskCompletedClose(false);
      }, 10000);
    } else {
      handleCompleteTaskClose();
    }
  }, [showModal]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        await dispatch(getTasksAPI());
      } catch (error) {
        if (error instanceof Error) console.error(error.message);
      }
    };
    fetchTasks();
  }, []);

  //!Functions
  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTask({
      ...task,
      description: event.target.value,
    });
  };

  const handleNewTaskSearchDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTask({
      ...task,
      description: event.target.value,
    });
  };

  const handleUrgency = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setTask({ ...task, urgency: true });
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
      //! Toast warning
      if (!task.description.length) {
        toast.warning("Oops...", {
          description: "Las tareas deben tener una descripción válida",
        });
        return;
      }
      if (!dateReminder || !hourReminder) {
        toast.warning("Debes seleccionar un recordatorio para tu tarea!");
        return;
      }
      if (allTasks.some((aTask) => aTask.description === task.description)) {
        toast.warning("Oops...", {
          description: "Esta tarea ya existe",
        });
        return;
      }
      const exactReminder = new Date(reminder.getTime());

      const { data } = await axiosURL.post("/task", task);
      if (data) {
        await axiosURL.put(`/task/${data.id}`, {
          ...data,
          reminder: exactReminder,
        });

        //* Toast success
        toast.success("Tarea creada!");

        setTask({
          id: 0,
          description: "",
          urgency: false,
          date: new Date(),
          elim: false,
          completed: false,
          color: "white",
          reminder: new Date(),
          userId: user[0]?.id,
        });
        await dispatch(getTasksAPI());
        setDescriptionNotCreated("");
        setReminder(new Date());
        setDateReminder(false);
        setHourReminder(false);
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
      dispatch(searchATask(description.toUpperCase()));
      setTask({ ...task, description });
    } else {
      await dispatch(getTasksAPI());
      await dispatch(getTasksDeletedAPI());
      setTask({ ...task, description: "" });
      setDescriptionNotCreated("");
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    const oldIndex = allTasks.findIndex((task) => task.id === active.id);
    const newIndex = allTasks.findIndex((task) => task.id === over.id);
    const newOrderTasks = arrayMove(allTasks, oldIndex, newIndex);
    if (newOrderTasks) {
      await dispatch(reOrderTasks(newOrderTasks));
    }
  };

  const handleDateReminder = async (date: Date | null, event: any) => {
    await event.preventDefault();

    const today = new Date();

    today.setUTCHours(0, 0, 0, 0);
    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setUTCHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return toast.warning(
          "El recordatorio no puede ser menor a la fecha actual!"
        );
      }
      setReminder(date);
      setDateReminder(true);
    }
  };

  const handleHour = (event: React.ChangeEvent<HTMLInputElement>) => {
    // separa las horas de los minutos con : y volverlas nums
    const [hour, minutes] = event.target.value.split(":").map(Number);
    // crear una copia de reminder
    const hourReminder = new Date(reminder);
    // setear las horas
    hourReminder.setHours(hour, minutes, 0, 0);
    setReminder(hourReminder);
    setHourReminder(true);
  };

  const submitReminder = () => {
    if (!dateReminder || !hourReminder) {
      return toast.warning(
        "Debes seleccionar una fecha y hora válida para tu recordatorio!"
      );
    }
    toast.success("Recordatorio agendado!", {
      duration: 1500,
    });
    handleCalendarClose();
  };

  const handleDeleteTaskReminder = async () => {
    try {
      const updateToElim = taskToComplete.map(async (task) => {
        await axiosURL.put(`/task/${task.id}`, { elim: true });
      });
      await Promise.all(updateToElim);

      const completedTasks = taskToComplete.map(async (task) => {
        await axiosURL.delete(`/task/${task.id}`);
      });
      await Promise.all(completedTasks);

      await dispatch(getTasksAPI());
      handleCompleteTaskClose();
      setTaskToComplete([]);
      toast.success("Tarea Completada!");
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  };

  //! modales
  const handleCalendarOpen = () => {
    setCalendarOpen(true);
    setCalendarClose(false);
  };

  const handleCalendarClose = () => {
    setCalendarClose(true);
    setTimeout(() => {
      setCalendarOpen(false);
    }, 300);
  };

  const handleColorOpen = () => {
    setColorOpen(true);
    setColorClose(false);
  };

  const handleCompleteTaskClose = () => {
    setTaskCompletedClose(true);
    setTimeout(() => {
      setTaskCompletedOpen(false);
    }, 300);
  };

  return (
    <React.Fragment>
      <NavBar />
      <main
        className={`pt-64 md:pt-52 px-5 pb-32 lg:pt-32 flex flex-col lg:flex-row w-full justify-around items-center lg:items-baseline overflow-hidden gap-16 lg:gap-0 dark:bg-neutral-900 text-black dark:text-white bg-gradient-to-bl from-white via-violet-200 to-purple-600 dark:bg-gradient-to-br dark:from-neutral-700 dark:via-black dark:to-violet-950`}
      >
        <section className="p-2 md:p-10 lg:p-5 lg:w-1/4 h-fit border border-black dark:border-white rounded-xl">
          <h1 className="text-center text-4xl">Crear Nueva Tarea</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-10 md:gap-7 pt-5 h-96 items-center justify-center md:justify-around"
          >
            <textarea
              name="description"
              id="description"
              cols={50}
              rows={3}
              value={task.description}
              onChange={handleDescription}
              className={`w-4/5 md:w-full md:max-w-56 border border-black dark:border-white rounded-xl text-black p-1 ${styles.textarea}`}
            ></textarea>
            <div className="flex justify-around items-center gap-10 md:gap-0 w-4/6 md:w-full">
              <button
                type="button"
                onClick={handleUrgency}
                name="urgency"
                className="px-3 py-2 md:p-3 rounded-lg bg-red-500 hover:bg-red-400 dark:bg-red-800 dark:hover:bg-red-900 border-black dark:border-white hover:shadow-sm hover:shadow-black dark:hover:shadow-white border focus:bg-red-700 focus:shadow-white transition-colors"
              >
                <NewReleasesIcon fontSize="small" /> Urgente
              </button>
              <button
                type="button"
                onClick={handleCalendarOpen}
                className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500 hover:bg-yellow-400 dark:bg-amber-700 dark:hover:bg-amber-800 border-black dark:border-white border hover:shadow-sm hover:shadow-black dark:hover:shadow-white transition-colors"
              >
                <DateRangeIcon /> Recordatorio
              </button>
              {calendarOpen && (
                <div>
                  <div
                    className={`w-3/5 lg:w-2/5 h-fit lg:h-1/2 p-5 absolute inset-0 m-auto flex flex-col gap-10 bg-yellow-200 dark:bg-amber-600 items-center dark:text-black border border-black rounded-xl ${
                      calendarClose ? styles.close : styles.open
                    }`}
                  >
                    <button type="button" onClick={handleCalendarClose}>
                      <CloseIcon />
                    </button>
                    <section>
                      <p>Selecciona una fecha:</p>
                      <DatePicker
                        dateFormat="dd/MM/yyyy"
                        selected={reminder}
                        onChange={handleDateReminder}
                        todayButton="Hoy"
                      />
                    </section>

                    <section>
                      <p>Selecciona una hora:</p>
                      <input type="time" onChange={handleHour} />
                    </section>
                    <button
                      type="button"
                      className="p-1 rounded-lg bg-violet-500 hover:bg-purple-500 border-black border"
                      onClick={submitReminder}
                    >
                      Aceptar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between gap-10 md:gap-0 w-3/4 md:w-full">
              <button
                type="button"
                onClick={handleColorOpen}
                className="p-1 rounded-full bg-red-400 hover:bg-red-500 bg-gradient-to-br from-yellow-500 to-purple-600 dark:bg-gradient-to-br dark:from-amber-500 dark:via-violet-700 dark:to-black dark:hover:bg-red-800 border border-black dark:border-white text-transparent text-2xl hover:shadow-sm hover:shadow-black dark:hover:shadow-white transition-colors"
              >
                {" "}
                llm
              </button>

              {/* Cambiar el color de la task */}
              {colorOpen && (
                <ColorTask
                  colorClose={colorClose}
                  setColorClose={setColorClose}
                  setColorOpen={setColorOpen}
                  handleColor={handleColor}
                  taskColor={task.color}
                />
              )}
              <button
                type="submit"
                className="p-2 rounded-lg bg-lime-400 hover:bg-lime-300 dark:bg-purple-800 dark:hover:bg-purple-900 border-black dark:border-white border hover:shadow-sm hover:shadow-black dark:hover:shadow-white transition-colors"
              >
                Agregar
              </button>
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
              className="border border-black dark:border-white rounded-xl flex flex-col items-center justify-evenly p-3 h-72 animate-fade"
            >
              <h3>¿Quieres crear esta tarea?</h3>
              <input
                type="text"
                placeholder={descriptionNotCreated}
                className="text-black rounded-lg p-1"
                onChange={handleNewTaskSearchDescription}
                value={descriptionNotCreated}
              />
              <button onClick={handleUrgency}>Urgente</button>
              <div className="flex justify-evenly w-full">
                <button
                  type="button"
                  onClick={handleColorOpen}
                  className="p-1 rounded-full bg-red-400 hover:bg-red-500 dark:bg-red-900 dark:hover:bg-red-600 border border-black dark:border-white text-transparent text-lg"
                >
                  {" "}
                  lmk
                </button>
                <button
                  type="submit"
                  className="p-1 rounded-lg bg-pink-400 hover:bg-pink-500 dark:bg-pink-900 dark:hover:bg-pink-600 border-black dark:border-white border"
                >
                  Crear
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="p-4 border border-black dark:border-white rounded-xl lg:w-1/2">
          <h1 className="text-center text-4xl lg:pb-5">Mis Tareas</h1>
          <article className="flex flex-col items-center md:items-start justify-center gap-16 md:flex-row md:gap-15 pt-5 p-10 lg:p-0">
            <div className="text-center flex flex-col gap-2">
              <h2>Urgente</h2>
              <section className="flex items-center border border-black dark:border-white rounded-xl w-56 justify-center">
                {urgencyTask?.map((task) => (
                  <main key={task.id} className="w-full">
                    <UrgencyTask task={task} />
                  </main>
                ))}
              </section>
            </div>

            <div className="border border-black dark:border-white md:w-fit w-full md:h-96"></div>

            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={importantTasks}
                strategy={verticalListSortingStrategy}
              >
                <div className="text-center flex flex-col gap-2">
                  <h2>Importancia</h2>
                  <article
                    key={task.id}
                    className="flex flex-col-reverse items-center justify-around h-96 border border-black dark:border-white rounded-xl p-4 w-44 md:w-72 overflow-y-auto dark:text-black"
                  >
                    {importantTasks?.map((task) => (
                      <main key={task.id}>
                        <ImportantTask task={task} />
                      </main>
                    ))}
                  </article>
                  <button className="hover:underline w-fit m-auto">
                    <Link to={"/trash"} className="pt-2">
                      <TaskAltIcon /> Tareas Completadas
                    </Link>
                  </button>
                </div>
              </SortableContext>
            </DndContext>
          </article>
        </section>
        {taskCompletedOpen && (
          <div
            className={`fixed inset-0 lg:inset-auto lg:top-0 m-auto p-6 lg:mt-5 flex flex-col gap-8 lg:gap-7 text-center bg-purple-700 opacity-95 w-4/5 h-5/6 lg:w-3/5 lg:h-5/6 text-black border border-black rounded-lg ${
              taskCompletedClose ? styles.close : styles.open
            }`}
          >
            <button onClick={handleCompleteTaskClose} className="w-fit mx-auto">
              <CloseIcon />
            </button>
            <h1 className="font-titles font-bold text-2xl md:text-4xl">
              Recordatorio enviado!
            </h1>
            <span className="font-text text-lg md:text-2xl">
              ¿Qué quieres hacer con esta/as tarea/as?
            </span>

            <section className="flex flex-col">
              {taskToComplete.map((task) => (
                <main>
                  <h2 className="font-titles font-bold text-xl md:text-3xl">
                    - {task.description}
                  </h2>
                </main>
              ))}
            </section>

            <button
              className="hover:underline"
              onClick={handleDeleteTaskReminder}
            >
              Completar Tarea
            </button>

            <div className="w-3/4 border mx-auto border-black"></div>

            <h2>Actualizar Tarea</h2>
            <UpdateCompletedTask />
            <button>Cancelar</button>
          </div>
        )}
      </main>
      <Footer />
    </React.Fragment>
  );
};
export default WorkSpace;
