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
import { Important, Task, TasksList } from "../../types";
import Footer from "../Footer/Footer";
import ImportantTask from "./ImportantTask/ImportantTask";
import UrgencyTask from "./UrgencyTask/UrgencyTask";
//Css & Icons
import styles from "./workSpace.module.css";
import CloseIcon from "@mui/icons-material/Close";
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';

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
import ColorTask from "./ColorTask/ColorTask";

const WorkSpace = () => {
  const dispatch = useAppDispatch();

  //!States
  const user = useAppSelector((state) => state.User.user);
  console.log(user)
  const allTasks = useAppSelector((state) => state.Task.allTasks);
  
  const userTasks = allTasks.filter((task) => task.user?.id === user[0]?.id)

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
    important: Important.HIGH,
    date: new Date(),
    elim: false,
    color: "white",
    reminder: new Date(),
    userId: user[0]?.id,
  });
  const [reminder, setReminder] = useState(new Date());
  const [today, setToday] = useState(new Date());

  const [info, setInfo] = useState<{
    from_name: string;
    to_email: string;
    message: string;
  }>({
    from_name: "",
    to_email: "",
    message: "",
  });

  useEffect(() => {
    setInfo({
      ...info,
      from_name: user[0]?.name,
      to_email: user[0]?.email
    })
  }, [])

  //! comparar la fecha del recordatorio con la fecha actual
  // useEffect(() => {
  //   const intervalId = setInterval(async () => {
  //     const today = new Date();
  //     setToday(today);

  //     const tasksDone: TasksList = [];

  //     const deleteAfterReminder = userTasks.map((task) => {
  //       const reminderDate = new Date(task.reminder);

  //       if (reminderDate.getTime() <= today.getTime()) {
  //         tasksDone.push(task);
  //       }
  //     });
        //*No funciona pasarle el nombre de la tarea a mensaje
  //     const taskNames = tasksDone.map((task) => task.description).join(', ');

  //     setInfo({...info, message: taskNames})
  //     console.log(info)

  //     if (tasksDone.length) {
  //       await emailjs
  //         .send("service_ums6x4q", "template_w8rf65t", info, {
  //           publicKey: "zADAsfTnn9pOJcyPO",
  //         })
  //         .then(
  //           () => {
  //             setInfo({ from_name: "", to_email: "", message: "" });
  //           },
  //           (error) => {
  //             console.log("FAILED...", error.text);
  //             toast.error('Algo salió mal...')
  //           }
  //         );
  //     }
  //     await Promise.all(deleteAfterReminder);
  //   }, 60000); 

  //   return () => clearInterval(intervalId);
  // }, [userTasks]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        await dispatch(getTasksAPI());
      } catch (error) {
      if (error instanceof Error) console.error(error.message);
      }
    }
    fetchTasks();
  }, [])

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
      //! Toast warning
      if (!task.description.length) {
        toast.warning('Oops...' ,{
          description: 'Las tareas deben tener una descripción válida'
        })
        return;
      }
      if (allTasks.some((aTask) => aTask.description === task.description)) {
        toast.warning('Oops...' ,{
          description: 'Esta tarea ya existe'
        })
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
        toast.success('Tarea creada!');

        setTask({
          id: 0,
          description: "",
          urgency: false,
          important: Important.HIGH,
          date: new Date(),
          elim: false,
          color: "white",
          reminder: new Date(),
          userId: user[0]?.id,
        });
        await dispatch(getTasksAPI());
        setDescriptionNotCreated("");
        setReminder(new Date());
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
    today.setUTCHours(0, 0, 0, 0);

    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setUTCHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return window.alert(
          "El recordatorio no puede ser menor a la fecha actual!"
        );
      }
      setReminder(date);
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

  return (
    <React.Fragment>
      <NavBar />
      <main
        className={`pt-64 md:pt-52 px-5 pb-32 lg:pt-44 flex flex-col lg:flex-row w-full justify-around items-center lg:items-baseline overflow-hidden gap-16 lg:gap-0 dark:bg-neutral-900 text-black dark:text-white bg-gradient-to-bl from-white via-violet-200 to-purple-600 dark:bg-gradient-to-br dark:from-neutral-700 dark:via-black dark:to-violet-950`}
      >
        <section className="p-2 md:p-10 lg:p-5 lg:w-1/4 h-fit border border-black dark:border-white rounded-xl">
          <h1 className="text-center text-4xl">Crear Nueva Tarea</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-10 md:gap-7 pt-5 h-96 items-center justify-between"
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
              <button type="button" onClick={handleUrgency} name="urgency"  className="p-1 rounded-lg bg-red-500 hover:bg-red-700 dark:bg-red-950 dark:hover:bg-red-900 py-5 px-3 border-black hover:shadow-sm hover:shadow-black dark:hover:shadow-white border focus:bg-red-700 focus:shadow-white">
                <NewReleasesIcon fontSize="small"/> Urgente
              </button>
              <div className="flex flex-col items-center">
                <p>Importancia</p>
                <button
                  type="button"
                  onClick={handleImportancy}
                  name={Important.HIGH}
                  value={Important.HIGH}
                  className="p-1 rounded-lg w-28 text-start bg-green-500 hover:bg-green-700 dark:bg-red-950 dark:hover:bg-red-900 border-black hover:shadow-sm hover:shadow-black dark:hover:shadow-white border focus:bg-green-700"
                >
                  <LabelImportantIcon/>HIGH
                </button>
                <button
                  type="button"
                  onClick={handleImportancy}
                  name={Important.MEDIUM}
                  value={Important.MEDIUM}
                  className="p-1 rounded-lg w-28 text-start bg-yellow-500 hover:bg-yellow-600 dark:bg-red-950 dark:hover:bg-red-900 border-black hover:shadow-sm hover:shadow-black dark:hover:shadow-white border focus:bg-yellow-600"
                >
                  <LabelImportantIcon/>MEDIUM
                </button>
                <button
                  type="button"
                  onClick={handleImportancy}
                  name={Important.LOW}
                  value={Important.LOW}
                  className="p-1 rounded-lg w-28 text-start bg-blue-500 hover:bg-blue-700 dark:bg-red-950 dark:hover:bg-red-900 border-black hover:shadow-sm hover:shadow-black dark:hover:shadow-white border focus:bg-blue-700"
                >
                  <LabelImportantIcon/>LOW
                </button>
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={handleCalendarOpen}
                className="p-1 rounded-lg bg-violet-500 hover:bg-violet-700 dark:bg-violet-950 dark:hover:bg-purple-900 border-black border hover:shadow-sm hover:shadow-black dark:hover:shadow-white"
              >
                Recordatorio
              </button>
              {calendarOpen && (
                <div>
                  <div
                    className={`w-3/5 lg:w-2/5 h-fit lg:h-1/2 p-5 absolute inset-0 m-auto flex flex-col gap-10 bg-purple-200 items-center dark:text-black border border-black rounded-xl ${
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
                      onClick={() => {
                        toast.success("Recordatorio agendado!", {duration: 1500});
                        handleCalendarClose();
                      }}
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
                className="p-1 rounded-full bg-red-400 hover:bg-red-500 dark:bg-red-900 dark:hover:bg-red-800 border border-black text-transparent text-2xl hover:shadow-sm hover:shadow-black dark:hover:shadow-white"
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
                className="p-2 rounded-lg bg-pink-400 hover:bg-pink-500 dark:bg-pink-950 dark:hover:bg-pink-900 border-black border hover:shadow-sm hover:shadow-black dark:hover:shadow-white"
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
              <select
                name="important"
                id=""
                className="text-black p-1 rounded-lg"
                onClick={handleImportancy}
              >
                <option value={Important.HIGH}>Importancia</option>
                <option value={Important.HIGH}>HIGH</option>
                <option value={Important.MEDIUM}>MEDIUM</option>
                <option value={Important.LOW}>LOW</option>
              </select>
              <div className="flex justify-evenly w-full">
              <button
                type="button"
                onClick={handleColorOpen}
                className="p-1 rounded-full bg-red-400 hover:bg-red-500 dark:bg-red-900 dark:hover:bg-red-600 border border-black dark:border-white text-transparent text-lg"
              >
                {" "}
                lmk
              </button>
              <button type="submit" className="p-1 rounded-lg bg-pink-400 hover:bg-pink-500 dark:bg-pink-900 dark:hover:bg-pink-600 border-black dark:border-white border">Crear</button>
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
                    className="flex flex-col items-center justify-around h-96 border border-black dark:border-white rounded-xl p-4 w-44 md:w-72 overflow-y-auto dark:text-black"
                  >
                    {importantTasks?.map((task) => (
                      <main key={task.id}>
                        <ImportantTask task={task} />
                      </main>
                    ))}
                  </article>
                  <Link to={"/trash"} className="pt-2">
                    Tareas Completadas
                  </Link>
                </div>
              </SortableContext>
            </DndContext>
          </article>
        </section>
      </main>
      <Footer />
    </React.Fragment>
  );
};
export default WorkSpace;
