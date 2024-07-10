import NavBar from "../navBar/NavBar";
import taskify1 from "../../assets/taskify1.png";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <>
      <NavBar />
      <main
        className={`lg:p-10 flex flex-col justify-start gap-20 md:gap-16 pt-20 md:pt-52 px-5 lg:pt-72 h-screen`}
      >
        <article
          className={`flex flex-col md:flex-row justify-center gap-10 items-center py-10 md:py-48 lg:pb-32 lg:pt-0`}
        >
          <div className="text-sm md:w-2/3 lg:w-2/5 ">
            <h2 className={`text-3xl lg:text-4xl text-center`}>
              ¿Sientes que tu desorden es caótico?
            </h2>
            <p className={`text-center lg:text-2xl`}>
              <br />
              Pon un fin a la planificación convencional. Con Taskify podrás
              ordenar tu día, semana e incluso tu mes! Gracias al modelo
              productivo y organizacional de su <b></b>
              <span className="underline cursor-pointer">
                Creación de Tareas.
              </span>
            </p>
          </div>
          <img src={taskify1} alt="image" className={`w-96 lg:w-5/12`} />
        </article>

        <section className={`flex flex-col items-center py-20`}>
          <h2 className="text-4xl pb-5 text-center">
            Comienza tu Creación de Tareas aquí
          </h2>
          <Link to={"/workSpace"}>
            <button>Comienza Ya!</button>
          </Link>
        </section>

        <article
          className={`text-start flex flex-col justify-center gap-10 items-center lg:items-start lg:flex-row px-4 py-20`}
        >
          <header className={`lg:w-1/2`}>
            <h1 className="text-4xl md:text-5xl pb-5 text-center">
              Pasos Para la Creación de Tareas
            </h1>
            <p>
              Para crear tus tareas de manera simple, sigue los siguientes
              pasos:
            </p>
            <br />
            <ol className={`list-decimal`}>
              <li>Añade una descripción a tu tarea.</li>
              <li>Selecciona una fecha y recordatorio para tu tarea.</li>
              <li>Escoge entre 'Urgencia' o 'Importancia' para tu tarea.</li>
              <li>
                Importancia: 'HIGH', 'MEDIUM' y 'LOW' son las 3 opciones que
                puede tener tu tarea. Dependiendo del nivel de importancia que
                escogas es que tu próxima tarea (HIGH) pasará a ser 'Urgente'
                después de haber completado la tarea 'Urgente' anterior.
              </li>
              <li>
                Puedes seleccionar un color a gusto a modo distintivo para tu
                tarea.
              </li>
              <li>¡Listo! Tu tarea esta creada.</li>
            </ol>
          </header>
          <img src={taskify1} alt="image2" className={`md:w-10/12 lg:w-5/12`} />
        </article>

        <article
          className={`text-center flex flex-col items-center gap-16 py-16`}
        >
          <img src={taskify1} alt="image3" className={`w-96 lg:w-4/12`} />
          <header className={`lg:w-1/2`}>
            <h1 className="text-4xl md:text-5xl pb-10">Función Urgency</h1>
            <p>
              Ten siempre tus tareas urgentes organizadas. Gracias a la función
              'Urgency' solo tendrás una tarea urgente. Pero, ¿Por qué solo una?
              Porque así nunca perderás de vista tu tarea con mayor urgencia y
              siempre estará a la vista en la sección 'Urgente'. Una vez que
              completes tu tarea urgente, automáticamente la primera tarea que
              creaste después de esa y con importancia 'HIGH', será la que
              pasará a ser urgente, y así sucesivamente hasta completar todas
              tus tareas 'HIGH'.
            </p>
          </header>
        </article>

        <article className={`text-center lg:w-2/3 m-auto py-5 md:py-10`}>
          <h1 className="text-4xl md:text-5xl pb-10">
            ¿Qué problemas soluciona Taskify?
          </h1>
          <p>
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
        <Footer />
      </main>
    </>
  );
};
export default Landing;
