import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Link } from "react-router-dom";
import DarkMode from "../DarkMode/DarkMode";
import axiosURL from "../../axiosConfig/axiosURL";
import { logInUser, logOutUser } from "../../redux/slices/Users/userSlice";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import styles from './burgerMenu.module.css';
import { toast } from "sonner";

const BurguerMenu = () => {
  const user = useAppSelector((state) => state.User.user);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);

  //Creación de cuentas
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => {
      setClose(false);
    }, 300);
  }

  const handleClose = () => {
    setClose(true);
    setTimeout(() => {
      setOpen(false);
    }, 400);
  }

  const handleScroll = (event: any) => {
    event.preventDefault();
    const steps = document.getElementById("steps");
    if (steps) {
      steps.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({
      ...userInfo,
      [event.target.name]: event.target.value,
    });
  };

  const handleLogIn = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      const { data } = await axiosURL.post("/user/login", userInfo);
      const userLocaleStorage = {
        name: data.user.name,
        email: data.user.email,
      };
      if (data) {
        dispatch(logOutUser());
        window.localStorage.setItem("User", JSON.stringify(userLocaleStorage));
        dispatch(logInUser(data));
        setUserInfo({ email: "", password: "" });
        toast.success('Sesión iniciada con éxito!');
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
      toast.error("Oops...", { description: "Email y/o contraseña incorrectas." });
      
    }
  };

  return (
    <React.Fragment>
      <main className="md:hidden">
        <button onClick={handleOpen} className="border-none"><MenuIcon fontSize="large"/></button>
        
        {open && (
          <section className={`fixed inset-0 flex flex-col items-center bg-gradient-to-br from-violet-700 via-purple-500 to-indigo-400 dark:text-white text-dark dark:bg-gradient-to-bl dark:from-violet-950 dark:to-purple-700 opacity-95 p-10 gap-8 text-xl ${close ? styles.close : styles.open}`}>
            {user.length > 0 && <h3>Bienvenido/a de nuevo {user[0]?.name}!</h3>}
            <button onClick={handleClose} className="absolute right-0 top-0 p-3"><CloseIcon fontSize="large" className="animate-fade animate-delay-500"/></button>


            <div className="flex flex-col items-center justify-evenly">
            <DarkMode />
              <ul className="flex flex-col items-center justify-between h-44 m-8">
                <li className="animate-fade-left animate-duration-300 animate-delay-500 hover:underline">
                  <Link to={"/"}>Inicio</Link>
                </li>
                <li className="animate-fade-left animate-duration-500 animate-delay-500 hover:underline">
                  <Link to={"/workSpace"}>Creación</Link>
                </li>
                <li className="animate-fade-left animate-duration-7000 animate-delay-500">
                  <button onClick={() => {handleScroll(event); handleClose();}} className="hover:underline">Ayuda</button>
                </li>
              </ul>

              <form
                onSubmit={handleLogIn}
                className={`flex flex-col items-center gap-5 text-black dark:text-white animate-fade-left animate-duration-1000 animate-delay-500`}
              >
                <div className={`flex flex-col items-start`}>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    value={userInfo.email}
                    className="rounded-xl border-2 border-black dark:border-white dark:bg-neutral-600"
                  />
                </div>
                <div className={`flex flex-col items-start`}>
                  <label htmlFor="password">Contraseña:</label>
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    value={userInfo.password}
                    className="rounded-xl border-2 border-black dark:border-white dark:bg-neutral-600"
                  />
                </div>
                  <button type="submit" className="my-2 p-2 rounded-lg bg-indigo-400 hover:bg-blue-500 dark:bg-indigo-900 dark:hover:bg-indigo-600 border-black dark:border-white border">
                    Iniciar sesión
                  </button>
                  <p className="text-lg text-center">
                    ¿No tienes una cuenta? <br />
                    <Link to={"/crearCuenta"}>
                      <span className="underline cursor-pointer">
                        {" "}
                        Crea una aquí
                      </span>
                    </Link>
                  </p>
              </form>
            </div>
          </section>
        )}
      </main>
    </React.Fragment>
  );
};
export default BurguerMenu;
