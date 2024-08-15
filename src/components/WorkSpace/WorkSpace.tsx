//!Hooks
import React, { useEffect, useState } from "react";
import axiosURL from "../../axiosConfig/axiosURL";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  getTasksAPI,
  reOrderTasks,
  searchATask,
} from "../../redux/slices/Tasks/taskSlice";
import { Link } from "react-router-dom";

//!Components
import NavBar from "../navBar/NavBar";
import { Important, Task } from "../../types";
import Footer from "../Footer/Footer";
import ImportantTask from "./ImportantTask/ImportantTask";
import UrgencyTask from "./UrgencyTask/UrgencyTask";

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
import Swal from "sweetalert2";

const WorkSpace = () => {
  const dispatch = useAppDispatch();

  //!States
  const allTasks = useAppSelector((state) => state.Task.allTasks);
  const tasksElimFalse = allTasks.filter((task) => task.elim === false);
  const urgencyTask = tasksElimFalse.filter((task) => task.urgency === true);
  const importantTasks = tasksElimFalse.filter(
    (task) => task.urgency === false
  );
  const [colorModal, setColorModal] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
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
  });
  const [reminder, setReminder] = useState(new Date());
  const [today, setToday] = useState(new Date());
  const [allReminderTasks, setAllReminderTasks] = useState<Task[]>([]);
  const [info, setInfo] = useState({
    from_name: "Lucas",
    from_email: "jiji@gmail.com",
    message: "Recordatorio funcionando",
  });

  useEffect(() => {
    dispatch(getTasksAPI());
  }, []);
  console.log(allReminderTasks)

  useEffect(() => {
    const interval = setInterval(() => {
      setToday(new Date());
      today.setHours(0, 0, 0, 0);
      allReminderTasks.forEach(async (task) => {
        task.reminder.setHours(0, 0, 0, 0);

        if (task.reminder.getTime() === today.getTime()) {
          emailjs 
            .send("service_ums6x4q", "template_7sfakso", info, {
              publicKey: "zADAsfTnn9pOJcyPO",
            })
            .then(
              () => {
                Swal.fire({
                  title: "Mensaje enviado correctamente!",
                  text: "Serás contactado a la brevedad.",
                  icon: "success",
                });
                setInfo({ from_name: "", from_email: "", message: "" });
              },
              (error) => {
                console.log("FAILED...", error.text);
                Swal.fire({
                  icon: "error",
                  title: "Algo salió mal!",
                  text: "Verifica los datos ingresados.",
                });
              }
            );
            const { data } = await axiosURL.delete(`/task/${task.id}`);
            if (data) console.log(data);
          clearInterval(interval);
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [allReminderTasks, today]);
  // console.log(today)

  //!Functions
  // any para manejar funciones desde un textArea y un input normal
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
      const { data } = await axiosURL.post("/task", task);
      if (data) {
        console.log(data);
        const response = await axiosURL.put(`/task/${data.id}`, {
          ...data,
          reminder,
        });
        if (response) setAllReminderTasks([...allReminderTasks, response.data]);
        setTask({
          id: 0,
          description: "",
          urgency: false,
          important: Important.HIGH,
          date: new Date(),
          elim: false,
          color: "",
          reminder: new Date(),
        });
        await dispatch(getTasksAPI());
        setDescriptionNotCreated("");
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  };
  // console.log(task);

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
      setTask({ ...task, description: "" });
      setDescriptionNotCreated("");
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    const oldIndex = tasksElimFalse.findIndex((task) => task.id === active.id);
    const newIndex = tasksElimFalse.findIndex((task) => task.id === over.id);
    const newOrderTasks = arrayMove(tasksElimFalse, oldIndex, newIndex);
    if (newOrderTasks) {
      await dispatch(reOrderTasks(newOrderTasks));
    }
  };

  const handleDateReminder = async (date: Date | null, event: any) => {
    event.preventDefault();
    today.setHours(0, 0, 0, 0);

    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return window.alert(
          "El recordatorio no puede ser menor a la fecha actual!"
        );
      }
      setReminder(date);

      // if (selectedDate == today) {
      //   console.log(reminder);
      //   setReminder(date);

      //   window.alert(`Recordatorio para ${date}`);
      // }
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
              <button type="button" onClick={handleUrgency} name="urgency">
                Urgencia
              </button>
              <div className="flex flex-col">
                <p>Importancia</p>
                <button
                  type="button"
                  onClick={handleImportancy}
                  name={Important.HIGH}
                  value={Important.HIGH}
                >
                  HIGH
                </button>
                <button
                  type="button"
                  onClick={handleImportancy}
                  name={Important.MEDIUM}
                  value={Important.MEDIUM}
                >
                  MEDIUM
                </button>
                <button
                  type="button"
                  onClick={handleImportancy}
                  name={Important.LOW}
                  value={Important.LOW}
                >
                  LOW
                </button>
              </div>
            </div>
            <div className="flex justify-center md:w-full">
              <button type="button" onClick={() => setCalendarOpen(true)}>
                Recordatorio
              </button>
              {calendarOpen && (
                <div>
                  {/* <Calendar className='w-screen flex' localizer={localizer} /> */}
                  <div className="w-3/4 h-3/4 absolute inset-0 m-auto flex flex-col bg-red-300 items-center">
                    <button
                      type="button"
                      onClick={() => setCalendarOpen(false)}
                    >
                      X
                    </button>
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={reminder}
                      onChange={handleDateReminder}
                      // minDate={Today}
                      // locale="es-ES"
                      todayButton="Hoy"
                    />
                  </div>
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
                onChange={handleNewTaskSearchDescription}
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
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={importantTasks}
            strategy={verticalListSortingStrategy}
          >
            <section>
              <h1 className="text-center text-4xl lg:pb-5">Mis Tareas</h1>
              <article className="flex flex-col gap-16 md:flex-row md:gap-20 pt-5 p-10 lg:p-0">
                <div className="text-center flex flex-col gap-2">
                  <h2>Urgente</h2>
                  <section className="flex p-4 border border-black dark:border-white rounded-xl h-96 w-44">
                    {urgencyTask?.map((task) => (
                      <main key={task.id}>
                        <UrgencyTask task={task} />
                      </main>
                    ))}
                  </section>
                </div>

                <div className="border border-black dark:border-white w-full md:h-96"></div>

                <div className="text-center flex flex-col gap-2">
                  <h2>Importancia</h2>
                  <article
                    key={task.id}
                    className="flex flex-col items-center justify-around h-96 border border-black dark:border-white rounded-xl p-4 w-48 overflow-y-auto dark:text-black"
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
              </article>
            </section>
          </SortableContext>
        </DndContext>
      </main>
      <Footer />
    </React.Fragment>
  );
};
export default WorkSpace;
