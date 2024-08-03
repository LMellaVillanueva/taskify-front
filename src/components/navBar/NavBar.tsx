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
        className={`md:absolute inset-0 h-32 flex justify-between lg:justify-around md:border-2 border-teal-300 rounded-2xl p-5 m-1 bg-purple-600 dark:bg-purple-300 text-white dark:text-black`}
      >
        <header className={`md:hidden m-auto text-center`}>
          <img
            src={logo}
            alt="logoTaskify"
            className="w-6/12 rounded-full m-auto"
          />
          <p className="text-black dark:text-white">
            La armonía de tu desorden
          </p>
        </header>
        <ul
          className={`hidden md:flex items-center justify-center gap-4 lg:w-1/2 lg:justify-evenly lg:gap-0`}
        >
          <header>
            <img
              src={logo}
              alt="logoTaskify"
              className="w-1/2 md:w-1/3 lg:w-20 rounded-full m-auto"
            />
            <p className="text-center text-black dark:text-white">
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
            <button onClick={handleScroll} className="border-none hover:underline">Ayuda</button>
          </li>
        </ul>

        <div className="hidden md:block">
          <DarkMode />
        </div>

        <BurguerMenu />

        {!user.length ? (
          mediumScreen ? (
            <form
              onSubmit={handleLogIn}
              className={`hidden md:flex items-center gap-2 ml-8 text-black`}
            >
              <div className="flex flex-col items-start">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={userInfo.email}
                />
                <label htmlFor="password">Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={userInfo.password}
                />
              </div>
              <div>
                <button type="submit" className="p-2">
                  Iniciar sesión
                </button>
                <Link to={"/crearCuenta"}>
                  <span className="underline cursor-pointer">
                    {" "}
                    Crear cuenta
                  </span>
                </Link>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleLogIn}
              className={`hidden lg:flex items-center justify-evenly w-6/12 text-black`}
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
              <div>
                <button type="submit" className="my-2">
                  Iniciar sesión
                </button>
                <p className="text-sm">
                  ¿No tienes una cuenta?
                  <Link to={"/crearCuenta"}>
                    <span className="underline cursor-pointer">
                      {" "}
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
