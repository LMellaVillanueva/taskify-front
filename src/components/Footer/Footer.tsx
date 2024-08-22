import { useState } from "react";
import logo from "../../assets/logo.png";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

const Footer = () => {
  const [info, setInfo] = useState({
    from_name: "",
    from_email: "",
    message: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInfo({
      ...info,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInfo({
      ...info,
      [event.target.name]: event.target.value,
    });
  };

  const sendEmail = (event: React.FormEvent) => {
    event.preventDefault();
    if (!info.from_name.length) return toast.warning('Debes indicar tu nombre');
    if (!info.from_email.length) return toast.warning('Debes indicar tu correo');
    if (!info.message.length) return toast.warning('Debes escribir un mensaje');
    const regexEmail =
      /^[a-zA-Z0-9]+(?!.*(?:\+{2,}|\-{2,}|\.{2,}))(?:[\.+\-]{0,1}[a-zA-Z0-9])*@gmail\.com$/;
    if (!regexEmail.test(info.from_email)) {
      return toast.error('Oops...', {description: 'La dirección de correo no es válida'});
    }
    emailjs
      .send("service_ums6x4q", "template_7sfakso", info, {
        publicKey: "zADAsfTnn9pOJcyPO",
      })
      .then(
        () => {
          toast.success('Mensaje enviado!', {description: 'Serás contactado a la brevedad'});
          setInfo({ from_name: "", from_email: "", message: "" });
        },
        (error) => {
          console.log("FAILED...", error.text);
          toast.error('Oops...', {description: 'Algo salió mal, verifica los datos ingresados'});
        }
      );
  };

  const handleNavigation = (event: any, targetId: string) => {
    event.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <footer
        className={`bg-gray-950 p-16 flex flex-col lg:flex-row gap-10 md:gap-12 text-white dark:text-purple-300`}
      >
        <div className="text-center flex flex-col h-80">
          <img
            src={logo}
            alt="logoTaskify"
            className="w-7/12 md:w-2/6 lg:w-56 rounded-full m-auto"
          />
          <p className="text-lg">La armonía de tu desorden</p>
        </div>
        <ul className="flex flex-col md:flex-row gap-10 lg:gap-0 w-full lg:justify-evenly md:items-start justify-center lg:w-1/2">
          <li>
            <p className="font-extrabold text-lg">Inicio</p>
            <p className="mt-3">
              <button
                onClick={() => handleNavigation(event, "intro")}
                className="border-none hover:underline"
              >
                Introducción a Taskify
              </button>
            </p>
          </li>
          <div className="border border-white md:hidden"></div>
          <li>
            <p className="font-extrabold text-lg">Creación</p>
            <p className="mt-3">
              <button
                onClick={() => handleNavigation(event, "steps")}
                className="border-none hover:underline"
              >
                Pasos para crear tareas
              </button>
            </p>
            <p className="mt-2">
              <button
                onClick={() => handleNavigation(event, "fnUrgency")}
                className="border-none hover:underline"
              >
                Función Urgency
              </button>
            </p>
            <p className="mt-2">Ejemplo de uso</p>
          </li>
          <div className="border border-white md:hidden"></div>
          <li>
            <p className="font-extrabold text-lg">Soluciones</p>
            <p className="mt-3">
              <button
                onClick={() => handleNavigation(event, "solution")}
                className="border-none hover:underline"
              >
                ¿Qué soluciona Taskify?
              </button>
            </p>
          </li>
          <div className="border border-white md:hidden"></div>
        </ul>
        <div className="md:w-2/3 lg:w-1/4 flex flex-col gap-3 md:m-auto">
          <p className="font-extrabold text-lg">Contacto</p>
          <form onSubmit={sendEmail} className="flex flex-col gap-3">
            <label htmlFor="name">Nombre:</label>
            <input
              value={info.from_name}
              onChange={handleChange}
              name="from_name"
              type="text"
              className="w-2/3 text-black rounded-xl p-1"
            />
            <label htmlFor="email">Email:</label>
            <input
              value={info.from_email}
              onChange={handleChange}
              name="from_email"
              type="email"
              className="w-2/3 text-black rounded-xl p-1"
            />
            <label htmlFor="message">Mensaje:</label>
            <textarea
              value={info.message}
              onChange={handleChangeArea}
              name="message"
              id="message"
              rows={4}
              cols={30}
              className="rounded-xl p-1 text-black"
            ></textarea>
            <button
              type="submit"
              className="m-auto mt-3 px-5 py-2 rounded-xl bg-indigo-900 hover:bg-indigo-600 border-white border"
            >
              Enviar Mensaje
            </button>
          </form>
        </div>
      </footer>
    </>
  );
};
export default Footer;
