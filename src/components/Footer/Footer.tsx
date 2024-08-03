import { useState } from 'react';
import logo from '../../assets/logo.png';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

const Footer = () => {
  const [info, setInfo] = useState({ from_name: '', from_email: '', message: '' });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInfo({
          ...info,
          [event.target.name]: event.target.value
      })
  }

  const handleChangeArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInfo({
          ...info,
          [event.target.name]: event.target.value
      })
  }

  const sendEmail = (event: React.FormEvent) => {
      event.preventDefault();
      const regexEmail = /^[a-zA-Z0-9]+(?!.*(?:\+{2,}|\-{2,}|\.{2,}))(?:[\.+\-]{0,1}[a-zA-Z0-9])*@gmail\.com$/;
      if (!regexEmail.test(info.from_email)) {
          return Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "La dirección de correo no es válida.",
            });
      }
      emailjs
            .send('service_ums6x4q', 'template_7sfakso', info, {
                publicKey: 'zADAsfTnn9pOJcyPO',
            })
            .then(
                () => {
                    Swal.fire({
                        title: "Mensaje enviado correctamente!",
                        text: "Serás contactado a la brevedad.",
                        icon: "success"
                      });
                      setInfo({ from_name: '', from_email: '', message: '' });
                },
                (error) => {
                    console.log('FAILED...', error.text);
                    Swal.fire({
                        icon: "error",
                        title: "Algo salió mal!",
                        text: "Verifica los datos ingresados.",
                      });
                },
            );
  };

  const handleNavigation = (event: any, targetId: string) => {
    event.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer
        className={`bg-gray-950 p-16 flex flex-col lg:flex-row gap-10 md:gap-12 text-white dark:text-purple-300`}
      >
        <img src={logo} alt="logoTaskify" className='w-7/12 md:w-2/6 lg:w-64 rounded-full m-auto' />
        <ul className="flex flex-col md:flex-row gap-10 lg:gap-0 w-full lg:justify-evenly md:items-start justify-center lg:w-1/2">
          <li>
            <p className='font-extrabold text-lg'>Inicio</p><p className="mt-3">
              <button onClick={() => handleNavigation(event, 'intro')} className='border-none hover:underline'>Introducción a Taskify</button></p>
          </li>
          <div className="border border-white md:hidden"></div>
          <li>
            <p className='font-extrabold text-lg'>Creación</p><p className="mt-3">
              <button onClick={() => handleNavigation(event, 'steps')} className='border-none hover:underline'>Pasos para crear tareas</button></p>
            <p className="mt-2">
              <button onClick={() => handleNavigation(event, 'fnUrgency')} className='border-none hover:underline'>Función Urgency</button></p>
            <p className="mt-2">Ejemplo de uso</p>
          </li>
          <div className="border border-white md:hidden"></div>
          <li>
            <p className='font-extrabold text-lg'>Soluciones</p><p className="mt-3">
              <button onClick={() => handleNavigation(event, 'solution')} className='border-none hover:underline'>¿Qué soluciona Taskify?</button></p>
          </li>
          <div className="border border-white md:hidden"></div>
        </ul>
        <div className='md:w-2/3 lg:w-1/4 flex flex-col gap-3 md:m-auto'>
        <p className='font-extrabold text-lg'>Contacto</p>
        <form onSubmit={sendEmail} className="flex flex-col gap-3">
          <label htmlFor="name">Nombre:</label>
          <input value={info.from_name} onChange={handleChange} name='from_name' type="text" className="w-2/3 text-black rounded-xl p-1" />
          <label htmlFor="email">Email:</label>
          <input value={info.from_email} onChange={handleChange} name='from_email' type="email" className="w-2/3 text-black rounded-xl p-1" />
          <label htmlFor="message">Mensaje:</label>
          <textarea value={info.message} onChange={handleChangeArea} name="message" id="message" rows={4} cols={30} className='rounded-xl p-1 text-black'></textarea>
          <button type='submit' className='m-auto mt-3 px-5 py-2 rounded-xl bg-indigo-900 hover:bg-indigo-600 border-white border'>Enviar Mensaje</button>
        </form>
        </div>
      </footer>
    </>
  );
};
export default Footer;
