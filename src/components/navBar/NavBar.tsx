import { useState, useEffect } from "react";
import logo from '../../assets/logo.jpeg';
import { Link } from "react-router-dom";

const NavBar = () => {
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

  return (
    <>
      <nav
        className={`md:absolute inset-0 h-32 lg:h-1/6 flex justify-between lg:justify-around md:border-2 border-teal-300 rounded-2xl p-5 m-1 bg-teal-600 dark:bg-teal-200`}
      >
        <header className={`md:hidden m-auto text-center`}>
        <img src={logo} alt="logoTaskify" className='w-6/12 rounded-full m-auto' />
          <p>La armonía de tu desorden</p>
        </header>
        <ul className={`hidden md:flex items-center justify-center gap-4 lg:w-1/2 lg:justify-evenly lg:gap-0`}>
          <header>
        <img src={logo} alt="logoTaskify" className='w-5/12 lg:w-20 rounded-full m-auto' />
            <p className="text-center">La armonía de tu desorden</p>
          </header>
          <li>
            <Link to={'/'}>Inicio</Link>
          </li>
          <li>Funciones</li>
          <li>Soluciones</li>
        </ul>
        {mediumScreen ? (
          <form className={`hidden md:flex items-center gap-2 ml-8`}>
            <div className="flex flex-col items-start">
              <label htmlFor="email">Email:</label>
              <input type="email" name="email" />
              <label htmlFor="password">Contraseña:</label>
              <input type="password" name="password" />
            </div>
            <button>Iniciar sesión</button>
          </form>
        ) : (
          <form className={`hidden lg:flex items-center justify-evenly w-5/12`}>
            <div className={`flex flex-col items-start`}>
              <label htmlFor="email">Email:</label>
              <input type="email" name="email" />
            </div>
            <div className={`flex flex-col items-start`}>
              <label htmlFor="password">Contraseña:</label>
              <input type="password" name="password" />
            </div>
            <button>Iniciar sesión</button>
          </form>
        )}
      </nav>
    </>
  );
};

export default NavBar;