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
    }, 300);
  };

  const colors = [
    { icon: <CircleIcon className="text-red-400 dark:text-red-600"fontSize="large"/> ,color: darkMode === "dark" ? "#dc2626" : "#f87171" },
    { icon:  <CircleIcon className="text-green-400 dark:text-green-600"fontSize="large"/> ,color: darkMode === "dark" ? "#16a34a" : "#4ade80" },
    { icon:  <CircleIcon className="text-blue-400 dark:text-blue-600"fontSize="large"/> ,color: darkMode === "dark" ? "#2563eb" : "#60a5fa" },
    { icon:  <CircleIcon className="text-amber-400 dark:text-amber-600"fontSize="large"/> ,color: darkMode === "dark" ? "#d97706" : "#fbbf24" },
    { icon:  <CircleIcon className="text-cyan-400 dark:text-cyan-600"fontSize="large"/> ,color: darkMode === "dark" ? "#0891b2 " : "#22d3ee" },
    { icon:  <CircleIcon className="text-indigo-400 dark:text-indigo-600"fontSize="large"/> ,color: darkMode === "dark" ? "#4f46e5" : "#818cf8" },
    { icon:  <CircleIcon className="text-lime-400 dark:text-lime-600"fontSize="large"/> ,color: darkMode === "dark" ? "#65a30d" : "#a3e635" },
    { icon:  <CircleIcon className="text-violet-400 dark:text-violet-600"fontSize="large"/> ,color: darkMode === "dark" ? "#7c3aed" : "#a78bfa" },
    { icon:  <CircleIcon className="text-purple-400 dark:text-purple-600"fontSize="large"/> ,color: darkMode === "dark" ? "#9333ea" : "#c084fc" },
    { icon:  <CircleIcon className="text-pink-400 dark:text-pink-600"fontSize="large"/> ,color: darkMode === "dark" ? "#db2777" : "#f472b6" },
  ];

  return (
    <main
      className={`fixed flex flex-col gap-10 items-center m-auto inset-0 w-2/3 md:w-1/3 h-fit bg-gradient-to-tr from-amber-200 to-fuchsia-300 dark:bg-gradient-to-tr dark:from-amber-700 dark:via-black dark:to-violet-600 rounded-xl p-5 border border-black z-20 ${
        colorClose ? styles.close : styles.open
      }`}
    >
      <button type="button" onClick={handleColorClose}>
        <CloseIcon className="text-black" />
      </button>

      <p>Seleccione un color:</p>

      <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl p-4 w-3/4 md:w-full lg:w-3/4">
        {colors.map((oneColor) => (
          <button
            key={oneColor.color}
            type="button"
            className="focus:shadow-black dark:focus:shadow-white focus:shadow-lg bg-transparent rounded-full"
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
        className="p-2 rounded-lg bg-lime-400 hover:bg-lime-300 dark:bg-purple-800 dark:hover:bg-purple-900 border-black dark:border-white border hover:shadow-sm hover:shadow-black dark:hover:shadow-white transition-colors font-buttons"
      >
        Aceptar
      </button>
    </main>
  );
};

export default ColorTask;
