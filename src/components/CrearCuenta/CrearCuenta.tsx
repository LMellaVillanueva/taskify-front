import { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import NavBar from "../navBar/NavBar";
import axiosURL from "../../axiosConfig/axiosURL";
import { useAppDispatch } from "../../redux/store";
import { logInUser, logOutUser } from "../../redux/slices/Users/userSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

  return (
    <>
      <NavBar />
      <main className="flex flex-col dark:bg-neutral-900 text-black dark:text-white pt-64 md:pt-44 lg:pt-32">
        <section className="flex flex-col justify-evenly border border-white h-screen p-4 bg-gradient-to-b from-white to-purple-600 text-center">
          <h1 className="text-center text-4xl text-black dark:text-white">
            Crear una cuenta
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-10 h-4/5 text-black lg:text-xl mx-auto md:w-1/2 lg:w-1/3"
          >
            <h2>Regístrate para continuar</h2>

            <div className="flex justify-between items-center">
              <label htmlFor="name">Nombre y Apellido: </label>
              <input
                value={newUser.name}
                onChange={handleChange}
                name="name"
                type="text"
                className="rounded-xl border-black lg:w-64 p-1"
              />
            </div>

            <div className="flex justify-between items-center">
              <label htmlFor="email">Correo: </label>
              <input
                value={newUser.email}
                onChange={handleChange}
                name="email"
                type="email"
                className="rounded-xl border-black lg:w-64 p-1"
              />
            </div>

            <div className="flex justify-between items-center">
              <label htmlFor="password">Contraseña: </label>
              <input
                value={newUser.password}
                onChange={handleChange}
                name="password"
                type="password"
                className="rounded-xl border-black lg:w-64 p-1"
              />
            </div>

            <div className="flex justify-between items-center gap-10">
              <label htmlFor="password">Repite tu contraseña: </label>
              <input
                value={repeatPassword}
                onChange={handleChange}
                name="repeatPassword"
                type="password"
                className="rounded-xl border-black -ml-5 lg:w-64 p-1"
              />
            </div>
            <button
              type="submit"
              className="dark:text-white text-lg px-5 py-2 rounded-xl bg-indigo-900 hover:bg-indigo-600 text-white border-white border"
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
