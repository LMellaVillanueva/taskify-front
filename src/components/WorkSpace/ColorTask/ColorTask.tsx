import CloseIcon from "@mui/icons-material/Close";
import CircleIcon from "@mui/icons-material/Circle";
import styles from "./colorTask.module.css";
import { toast } from "sonner";

type Props = {
  colorClose: boolean;
  setColorClose: (value: boolean) => void;
  setColorOpen: (value: boolean) => void;
  handleColor: Function;
  taskColor: string;
};

const ColorTask: React.FC<Props> = ({
  colorClose,
  setColorClose,
  setColorOpen,
  handleColor,
  taskColor
}) => {
  const darkMode = window.localStorage.getItem("Theme");

  const handleColorClose = () => {
    setColorClose(true);
    setTimeout(() => {
      setColorOpen(false);
    }, 500);
  };

  const colors = [
    { icon: <CircleIcon className="text-red-300 dark:text-red-500"fontSize="large"/> ,color: darkMode === "dark" ? "#ef4444" : "#fca5a5" },
    { icon:  <CircleIcon className="text-green-300 dark:text-green-500"fontSize="large"/> ,color: darkMode === "dark" ? "#22c55e" : "#86efac" },
    { icon:  <CircleIcon className="text-blue-300 dark:text-blue-500"fontSize="large"/> ,color: darkMode === "dark" ? "#3b82f6" : "#93c5fd" },
    { icon:  <CircleIcon className="text-amber-300 dark:text-amber-500"fontSize="large"/> ,color: darkMode === "dark" ? "#f59e0b" : "#fcd34d" },
    { icon:  <CircleIcon className="text-cyan-300 dark:text-cyan-500"fontSize="large"/> ,color: darkMode === "dark" ? "#06B6D4" : "#67E8F9" },
    { icon:  <CircleIcon className="text-indigo-300 dark:text-indigo-500"fontSize="large"/> ,color: darkMode === "dark" ? "#6366F1" : "#A5B4FC" },
    { icon:  <CircleIcon className="text-lime-300 dark:text-lime-500"fontSize="large"/> ,color: darkMode === "dark" ? "#84CC16" : "#BEEB64" },
    { icon:  <CircleIcon className="text-violet-300 dark:text-violet-500"fontSize="large"/> ,color: darkMode === "dark" ? "#8B5CF6" : "#C4B5FD" },
    { icon:  <CircleIcon className="text-purple-300 dark:text-purple-500"fontSize="large"/> ,color: darkMode === "dark" ? "#A855F7" : "#D8B4FE" },
    { icon:  <CircleIcon className="text-pink-300 dark:text-pink-500"fontSize="large"/> ,color: darkMode === "dark" ? "#EC4899" : "F9A8D4" },
  ];

  return (
    <main
      className={`absolute flex flex-col gap-10 items-center m-auto inset-0 w-2/3 md:w-1/4 h-fit bg-purple-200 dark:bg-stone-600 rounded-xl p-5 border border-black dark:border-white ${
        colorClose ? styles.close : styles.open
      }`}
    >
      <button type="button" onClick={handleColorClose}>
        <CloseIcon className="text-black" />
      </button>

      <p>Seleccione un color:</p>

      <div className="flex flex-wrap items-center justify-center gap-2 border border-black rounded-xl p-4 w-3/4 md:w-full lg:w-3/4">
        {colors.map((oneColor) => (
          <button
            key={oneColor.color}
            type="button"
            className="focus:shadow-black focus:shadow-lg bg-transparent rounded-full"
            onClick={() => {
              handleColor(oneColor.color);
            }}
          >
            {oneColor.icon}
          </button>
        ))}
      </div>
      <button
      type="button"
        onClick={() => {
          if (taskColor !== 'white') {
            toast.success('Color seleccionado!', {duration: 1500});
          } else {
            toast.warning('Color por defecto!');
          }
          handleColorClose();
        }
        }
        className="p-1 rounded-lg bg-lime-400 hover:bg-lime-500 dark:bg-green-800 dark:hover:bg-green-600 border-black dark:border-white border"
      >
        Aceptar
      </button>
    </main>
  );
};

export default ColorTask;
