import logo from '../../assets/logo.png';

const Footer = () => {
  return (
    <>
      <footer
        className={`bg-gray-950 p-20 flex flex-col lg:flex-row gap-10 md:gap-12 text-white dark:text-purple-300`}
      >
        <img src={logo} alt="logoTaskify" className='w-7/12 md:w-2/6 lg:w-64 rounded-full m-auto' />
        <ul className="flex flex-col md:flex-row gap-10 lg:gap-0 w-full lg:justify-evenly md:items-start justify-center lg:w-1/2">
          <li>
            Inicio<p className="mt-3">Introducción a Taskify</p>
          </li>
          <div className="border border-white md:hidden"></div>
          <li>
            Creación<p className="mt-3">Pasos para crear tareas</p>
            <p className="mt-2">Función Urgency</p>
            <p className="mt-2">Ejemplo de uso</p>
          </li>
          <div className="border border-white md:hidden"></div>
          <li>
            Soluciones<p className="mt-3">¿Qué soluciona Taskify?</p>
          </li>
          <div className="border border-white md:hidden"></div>
        </ul>
        <h2>Contacto</h2>
        <form className="flex flex-col gap-2 md:w-2/3 lg:w-1/4">
          <label htmlFor="name">Nombre:</label>
          <input type="text" className="w-2/3" />
          <label htmlFor="email">Email:</label>
          <input type="email" className="w-2/3" />
          <label htmlFor="message">Mensaje:</label>
          <textarea name="message" id="message" rows={4} cols={30}></textarea>
        </form>
      </footer>
    </>
  );
};
export default Footer;
