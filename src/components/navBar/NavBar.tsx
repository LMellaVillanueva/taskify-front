import { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import axiosURL from "../../axiosConfig/axiosURL";
import Swal from "sweetalert2";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { logInUser, logOutUser } from "../../redux/slices/Users/userSlice";
import DarkMode from "../DarkMode/DarkMode";
import BurguerMenu from "../BurguerMenu/BurguerMenu";

const NavBar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.User.user);

  //Creación de cuentas
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const [mediumScreen, setMediumScreen] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setMediumScreen(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const handleLogOut = () => {
    dispatch(logOutUser());
    window.localStorage.clear();
  };

  const handleScroll = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const steps = document.getElementById("steps");
    if (steps) {
      steps.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav
        className={`absolute font-serif lg:text-base inset-0 h-32 lg:h-24 flex md:justify-between lg:justify-around rounded-b-3xl lg:rounded-b-full p-5 bg-gradient-to-br from-violet-700 via-purple-500 to-indigo-400 dark:text-white text-dark dark:bg-gradient-to-bl dark:from-violet-950 dark:to-purple-700`}
      >
        {/* Vista de calular */}
        <header className={`md:hidden m-auto text-center`}>
          <img
            src={logo}
            alt="logoTaskify"
            width={170}
            className="rounded-full m-auto ml-12"
          />
          <p className="ml-10">La armonía de tu desorden</p>
        </header>
        <ul
          className={`hidden md:flex items-center justify-center gap-6 lg:w-1/2 lg:justify-evenly lg:gap-0 md:text-lg lg:text-base`}
        >
          <header>
            <img
              src={logo}
              alt="logoTaskify"
              className="w-1/2 md:w-1/2 lg:w-16 rounded-full m-auto"
            />
            <p className="text-center md:text-sm">
              La armonía de tu desorden
            </p>
          </header>
          <li className="hover:underline">
            <Link to={"/"}>Inicio</Link>
          </li>
          <li className="hover:underline">
            <Link to={"/workSpace"}>Creación</Link>
          </li>
          <li>
            <button
              onClick={handleScroll}
              className="border-none hover:underline"
            >
              Ayuda
            </button>
          </li>
          <li>
            <DarkMode />
          </li>
        </ul>
        <BurguerMenu />

        {!user.length ? (
          mediumScreen ? (
            <form
              onSubmit={handleLogIn}
              className={`hidden md:flex items-center gap-5 ml-8 text-black dark:text-white`}
            >
              <div className="flex flex-col items-start">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={userInfo.email}
                  className="rounded-xl border-2 border-black dark:border-white dark:border dark:bg-neutral-600"
                />
                <label htmlFor="password">Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={userInfo.password}
                  className="rounded-xl border-2 border-black dark:border-white dark:border dark:bg-neutral-600"
                />
              </div>
              <div className="text-center text-sm flex flex-col gap-2">
                <button
                  type="submit"
                  className="p-2 rounded-lg bg-indigo-400 hover:bg-blue-500 dark:bg-indigo-900 dark:hover:bg-indigo-600 border-black dark:border-white border"
                >
                  Iniciar sesión
                </button>
                <Link to={"/crearCuenta"}>
                  <span className="cursor-pointer hover:underline">
                    Crear cuenta
                  </span>
                </Link>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleLogIn}
              className={`hidden lg:flex items-center justify-evenly w-6/12 text-black dark:text-white`}
            >
              <div className={`flex flex-col items-start`}>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={userInfo.email}
                  className="rounded-xl border-2 border-black dark:border-white dark:border dark:bg-neutral-600"
                />
              </div>
              <div className={`flex flex-col items-start`}>
                <label htmlFor="password">Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={userInfo.password}
                  className="rounded-xl border-2 border-black dark:border-white dark:border dark:bg-neutral-600"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="my-2 p-1 rounded-lg bg-indigo-400 hover:bg-blue-500 dark:bg-indigo-900 dark:hover:bg-indigo-600 border-black dark:border-white border"
                >
                  Iniciar sesión
                </button>
                <p className="text-sm">
                  ¿No tienes una cuenta? <b></b>
                  <Link to={"/crearCuenta"}>
                    <span className="underline cursor-pointer mr-2">
                      Crea una aquí
                    </span>
                  </Link>
                </p>
              </div>
            </form>
          )
        ) : (
          <section className="flex items-center justify-around p-1 w-1/2 md:w-full gap-4 md:gap-10 lg:w-1/5">
            <h2 className="text-xs md:text-sm w-full lg:text-xl text-center">
              Bienvenido/a de nuevo {user[0].name}!
            </h2>
            <button onClick={handleLogOut}>Cerrar Sesión</button>
          </section>
        )}
      </nav>
    </>
  );
};

export default NavBar;
