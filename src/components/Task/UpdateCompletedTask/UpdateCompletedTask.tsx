import React, { useEffect, useState } from "react";
import { TasksList } from "../../../types";
import DatePicker from "react-datepicker";
import { toast } from "sonner";
import axiosURL from "../../../axiosConfig/axiosURL";
import { useAppDispatch } from "../../../redux/store";
import { getTasksAPI } from "../../../redux/slices/Tasks/taskSlice";

type Props = {
  tasksToUpdate: TasksList;
  setTaskToUpdate: (value: TasksList) => void;
  handleCompleteTaskClose: () => void;
};

const UpdateCompletedTask: React.FC<Props> = ({
  tasksToUpdate,
  handleCompleteTaskClose,
  setTaskToUpdate,
}) => {
  const dispatch = useAppDispatch();
  const [taskId, setTaskId] = useState(0);
  const [reminder, setReminder] = useState(new Date());
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (tasksToUpdate.length === 1) {
      changeOneTaskValues(tasksToUpdate[0].id);
    }
  }, [tasksToUpdate]);

  const handleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
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

  // Formatear la hora para mostrarla en el input type="time"
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0"); // Asegurarse que tenga dos dígitos
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const changeOneTaskValues = (taskId: number) => {
    const selectedTask = tasksToUpdate.find((task) => task.id === taskId);
    if (selectedTask) {
      setTaskId(selectedTask.id);
      setReminder(new Date(selectedTask.reminder));
      setDescription(selectedTask.description);
    }
  };

  const handleChangeTaskId = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTask = tasksToUpdate.find(
      (task) => task.id === Number(event.target.value)
    );
    if (selectedTask) {
      setTaskId(selectedTask.id);
      setReminder(new Date(selectedTask.reminder));
      setDescription(selectedTask.description);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      let response;

      if (description.length > 0) {
        response = await axiosURL.put(`/task/${taskId}`, {
          reminder: reminder,
          description: description,
          completed: false,
        });
      } else {
        response = await axiosURL.put(`/task/${taskId}`, {
          reminder: reminder,
          completed: false,
        });
      }

      if (response.data) {
        console.log(response.data);

        const updatedTasks = tasksToUpdate.filter((task) => task.id !== taskId);

        if (tasksToUpdate.length > 1) {
          setReminder(new Date());
          setTaskId(0);
          setDescription("");
          await dispatch(getTasksAPI());
          setTaskToUpdate(updatedTasks);
          return toast.success("Tu tarea fue actualizada con éxito!");
        } else {
          setReminder(new Date());
          setTaskId(0);
          setDescription("");
          setTaskToUpdate([]);
          handleCompleteTaskClose();
          toast.success("Tu tarea fue actualizada con éxito!");
        }
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  };

  return (
    <main className="p-2 flex flex-col md:flex-row justify-evenly text-black">
      {tasksToUpdate.length > 1 && (
        <div>
          <select name="" onChange={handleChangeTaskId}>
            <option value="">Selecciona tu tarea:</option>
            {tasksToUpdate?.map((task) => (
              <option key={task.id} value={task.id}>
                {task.description}
              </option>
            ))}
          </select>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 items-center"
      >
        <section className="flex flex-col md:flex-row gap-3">
          <label htmlFor="" className="text-black dark:text-white">Nueva fecha de recordatorio :</label>
          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={reminder}
            onChange={handleDateReminder}
            todayButton="Hoy"
          />
        </section>

        <section>
          <label htmlFor="" className="text-black dark:text-white">Nueva hora de recordatorio :</label>
          <input
            type="time"
            onChange={handleHour}
            value={formatTime(reminder)} // Usar formatTime para mostrar la hora en formato "HH:mm"
          />
        </section>

        <section className="flex flex-col md:flex-row gap-3">
          <label className="text-black dark:text-white">Nueva descripción (opcional) :</label>
          <input type="text" onChange={handleDescription} value={description} />
        </section>

        <button className="text-black dark:text-white hover:underline" type="submit">Actualizar</button>
      </form>
    </main>
  );
};

export default UpdateCompletedTask;
