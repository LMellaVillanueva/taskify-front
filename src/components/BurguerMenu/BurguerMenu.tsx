import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Link } from "react-router-dom";
import DarkMode from "../DarkMode/DarkMode";
import axiosURL from "../../axiosConfig/axiosURL";
import { logInUser, logOutUser } from "../../redux/slices/Users/userSlice";
import Swal from "sweetalert2";

const BurguerMenu = () => {
  const user = useAppSelector((state) => state.User.user);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);

  //Creación de cuentas
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

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
        return Swal.fire({
          icon: "success",
          title: "Sesión iniciada con éxito!",
          text: "Explora con total libertad",
        });
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Email o contraseña incorrecta/as.",
      });
    }
  };

  return (
    <React.Fragment>
      <main className="md:hidden">
        <button onClick={() => setOpen(true)}>☰</button>
        {open && (
          <section className="fixed inset-0 flex flex-col items-center bg-amber-700 dark:bg-amber-900 dark:bg-opacity-95 bg-opacity-95 p-10 gap-8">
            {user.length > 0 && <h3>Bienvenido/a de nuevo {user[0]?.name}!</h3>}
            <button onClick={() => setOpen(false)}>X</button>
            <DarkMode />

            <div className="flex flex-col items-center">
              <ul className="flex flex-col items-center justify-around h-56 m-8">
                <li>
                  <Link to={"/"}>Inicio</Link>
                </li>
                <li>
                  <Link to={"/workSpace"}>Creación</Link>
                </li>
                <li>
                  <button onClick={() => {handleScroll(event); setOpen(false);}}>Ayuda</button>
                </li>
              </ul>

              <form
                onSubmit={handleLogIn}
                className={`flex flex-col items-center gap-5 text-black`}
              >
                <div className={`flex flex-col items-start`}>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    value={userInfo.email}
                  />
                </div>
                <div className={`flex flex-col items-start`}>
                  <label htmlFor="password">Contraseña:</label>
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    value={userInfo.password}
                  />
                </div>
                  <button type="submit" className="my-2">
                    Iniciar sesión
                  </button>
                  <p className="text-sm text-center">
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
