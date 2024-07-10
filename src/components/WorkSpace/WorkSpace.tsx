import NavBar from "../navBar/NavBar";

const WorkSpace = () => {
  return (
    <>
      <NavBar />
      <main className={`pt-20 md:pt-52 px-5 lg:pt-72 h-screen flex flex-col lg:flex-row w-full justify-around`}>
        <section>
            <h1>Crear Nueva Tarea</h1>
            <article>
                <textarea name="description" id="description" cols={50} rows={3}></textarea>
                <div>
                    <select name="fecha" id="fecha">Fecha</select>
                    <select name="recor" id="recor">Recordatorio</select>
                </div>
                <div>
                    <button>Urgencia</button>
                    <div>
                        <p>Importancia</p>
                        <button>HIGH</button>
                        <button>MEDIUM</button>
                        <button>LOW</button>
                    </div>
                </div>
                <div>
                    <button>Color</button>
                    <button>Agregar</button>
                </div>
            </article>
        </section>

        <section>
            <h1>buscar tarea</h1>
        </section>

        <section>
            <h1>Mis Tareas</h1>
        </section>
      </main>
    </>
  );
};
export default WorkSpace;
