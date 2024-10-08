import { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import axiosURL from "../../axiosConfig/axiosURL";
import { useAppDispatch } from "../../redux/store";
import { logInUser, logOutUser } from "../../redux/slices/Users/userSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CrearCuenta = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const [repeatPassword, setRepeatPassword] = useState("");

  useEffect(() => {
    toast.warning('Debes tener una cuenta para crear tus propias tareas!', {duration: 2000})
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser,
      [event.target.name]: event.target.value,
    });
    if (event.target.name === "repeatPassword") {
      setRepeatPassword(event.target.value);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      if (newUser.password !== repeatPassword) {
        toast.error("Oops...", { description: "Las contraseñas no coinciden." });
      }
      const { data } = await axiosURL.post("/user", newUser);
      const userLocaleStorage = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        tasks: data.user.tasks,
      };
      if (data) {
        dispatch(logOutUser());
        window.localStorage.setItem("User", JSON.stringify(userLocaleStorage));
        dispatch(logInUser(userLocaleStorage));
        setNewUser({ name: "", email: "", password: "" });
        setRepeatPassword("");
        toast.success('Usuario registrado con éxito!');
        return navigate('/workSpace')
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  };

  const caro = () => {
    return navigate('/');
  }

  return (
    <>
      <main className="flex flex-col text-black dark:text-white">
        <section className="flex flex-col pb-36 p-3 bg-gradient-to-tr from-purple-600 dark:from-neutral-900 via-violet-400 dark:via-violet-950 to-neutral-100 dark:to-neutral-900 text-center">
          <button onClick={caro} className="text-start w-fit">
            <ArrowBackIcon fontSize="large" className="hover:cursor-pointer"/>
          </button>
          <h1 className="text-center p-5 text-4xl md:text-5xl text-black dark:text-white font-titles">
            Crea una cuenta
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-10 h-4/5 text-black lg:text-xl mx-auto md:w-1/2 lg:w-1/3 dark:text-white font-text border-2 border-black dark:border-white rounded-xl m-10 p-2 dark:bg-gradient-to-t dark:from-neutral-950"
          >
            <h2 className="font-titles underline text-2xl">Regístrate para continuar</h2>

            <div className="flex justify-between items-center">
              <label htmlFor="name">Nombre y Apellido: </label>
              <input
                value={newUser.name}
                onChange={handleChange}
                name="name"
                type="text"
                className="rounded-xl border-black border-2 bg-neutral-200 lg:w-64 p-1 dark:text-black"
              />
            </div>

            <div className="flex justify-between items-center">
              <label htmlFor="email">Correo: </label>
              <input
                value={newUser.email}
                onChange={handleChange}
                name="email"
                type="email"
                className="rounded-xl border-black border-2 bg-neutral-200 lg:w-64 p-1 dark:text-black"
              />
            </div>

            <div className="flex justify-between items-center">
              <label htmlFor="password">Contraseña: </label>
              <input
                value={newUser.password}
                onChange={handleChange}
                name="password"
                type="password"
                className="rounded-xl border-black border-2 bg-neutral-200 lg:w-64 p-1 dark:text-black"
              />
            </div>

            <div className="flex justify-between items-center gap-10">
              <label htmlFor="password">Repite tu contraseña: </label>
              <input
                value={repeatPassword}
                onChange={handleChange}
                name="repeatPassword"
                type="password"
                className="rounded-xl border-black border-2 bg-neutral-200 -ml-5 lg:w-64 p-1 dark:text-black"
              />
            </div>
            <button
              type="submit"
              className="text-xl border-2 border-black dark:border-white rounded-lg p-3 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              Crear Cuenta
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CrearCuenta;
