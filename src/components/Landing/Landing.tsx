import NavBar from "../navBar/NavBar";
import taskify1 from "../../assets/taskify1.png";
import Footer from "../Footer/Footer";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useEffect } from "react";

const Landing = () => {
  const location = useLocation();
  const { targetId } = location.state || {};
  const user = useAppSelector(state => state.User.user);

  useEffect(() => {
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, [targetId])

  return (
    <>
      <NavBar />
      <main id="intro" 
        className={`lg:p-10 flex flex-col justify-start gap-20 md:gap-16 pt-64 md:pt-52 px-5 lg:pt-72 dark:bg-neutral-900 text-black dark:text-white bg-gradient-to-bl from-white via-violet-100 to-purple-600 dark:bg-gradient-to-br dark:from-neutral-700 dark:via-black dark:to-violet-950`}
      >
        <article
          className={`flex flex-col md:flex-row justify-center gap-10 items-center py-10 md:py-48 lg:pb-32 lg:pt-0`}
        >
          <div className="text-sm md:w-2/3 lg:w-2/5">
            <h2 className={`text-3xl lg:text-5xl text-center font-titles`}>
              ¿Sientes que tu desorden es caótico?
            </h2>
            <p className={`text-center lg:text-2xl font-text`}>
              <br />
              Pon un fin a la planificación convencional. Con Taskify podrás
              ordenar tu día, semana e incluso tu mes! Gracias al modelo
              productivo y organizacional de su <b></b>
              {user.length === 0 ? (
              <span className="underline cursor-pointer">
                <Link to={"/crearCuenta"}>Creación de Tareas.</Link>
              </span>
              ) : (
              <span className="underline cursor-pointer">
                <Link to={"/workSpace"}>Creación de Tareas.</Link>
              </span>
              )}
            </p>
          </div>
          <img src={taskify1} alt="image" className={`w-96 lg:w-5/12`} />
        </article>

        <section className={`flex flex-col items-center py-20`}>
          <h2 className="text-4xl lg:text-5xl pb-5 text-center font-titles">
            Comienza tu Creación de Tareas aquí
          </h2>
          {user.length === 0 ? (
          <Link to={"/crearCuenta"}>
            <button className="flex items-center gap-1 text-xl border border-black dark:border-white rounded-lg p-3 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">Comienza Ya! <ArrowForwardIcon/></button>
          </Link>
          ) : (
          <Link to={"/workSpace"}>
            <button className="flex items-center gap-1 text-xl border border-black dark:border-white rounded-lg p-3 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">Comienza Ya! <ArrowForwardIcon/></button>
          </Link>
          )}
        </section>

        <article 
          id="steps"
          className={`text-start flex flex-col justify-center gap-10 items-center lg:items-start lg:flex-row px-4 py-20`}
        >
          <header className={`lg:w-1/2`}>
            <h1 className="text-4xl md:text-5xl pb-5 text-center font-titles">
              Pasos Para la Creación de Tareas
            </h1>
            <p className="font-text text-xl">
              Para crear tus tareas de manera simple, sigue los siguientes
              pasos:
            </p>
            <br />
            <ol className={`list-decimal font-text text-xl`}>
              <li>Añade una descripción a tu tarea.</li>
              <li>Selecciona un recordatorio para tu tarea.</li>
              <li>La modalidad 'Urgente' te permite priorizar tu tarea por sobre las demás, de forma que siempre estarás al pendiente de la misma.</li>
              <li>
                Puedes seleccionar un color a gusto a modo distintivo para tu
                tarea.
              </li>
              <li>¡Listo! Tu tarea esta creada. Ya puedes comenzar con tu organización.</li>
            </ol>
          </header>
          <img src={taskify1} alt="image2" className={`md:w-10/12 lg:w-5/12`} />
        </article>

        <article id="fnUrgency"
          className={`text-center flex flex-col items-center gap-16 py-16`}
        >
          <img src={taskify1} alt="image3" className={`w-96 lg:w-4/12`} />
          <header className={`lg:w-1/2`}>
            <h1 className="text-4xl md:text-5xl pb-10 font-titles">Función Urgency</h1>
            <p className="font-text text-xl">
              Ten siempre tus tareas urgentes organizadas. Gracias a la función
              'Urgency' solo tendrás una tarea urgente. Pero, ¿Por qué solo una?
              Porque así nunca perderás de vista tu tarea con mayor urgencia y
              siempre estará a la vista en la sección 'Urgente'. Una vez que
              completes tu tarea urgente, automáticamente la primera tarea que
              creaste después de esa será la que
              pasará a ser urgente, y así sucesivamente hasta completar todas
              tus tareas.
            </p>
          </header>
        </article>

        <article id="solution" className={`text-center lg:w-2/3 m-auto py-5 mt-14 mb-32 md:py-10`}>
          <h1 className="text-4xl md:text-5xl pb-10 font-titles">
            ¿Qué problemas soluciona Taskify?
          </h1>
          <p className="font-text text-xl">
            ¿Te ha pasado que más de alguna vez te has sentido en desorden?,
            ¿Que tienes muchas cosas que hacer pero muy poco tiempo? Aquí es
            donde entra en juego Taskify, que te ayudará a mantener tu vida
            organizada y bajo control. Dile adiós a las tareas incompletas o
            compromisos incumplidos, siempre tendrás tu orden personalizado. Y
            en caso que te identifiques con una mente olvidadiza... ¡No hay
            problema! Taskify cuenta con sistema de recordatorios, por lo que
            siempre podrás estar al tanto del siguiente compromiso por cumplir.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
};
export default Landing;
