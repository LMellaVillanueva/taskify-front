import { useState } from "react";
import Footer from "../Footer/Footer";
import NavBar from "../navBar/NavBar";
import axiosURL from "../../axiosConfig/axiosURL";
import Swal from "sweetalert2";
import { useAppDispatch } from "../../redux/store";
import { logInUser, logOutUser } from "../../redux/slices/Users/userSlice";

const CrearCuenta = () => {

    const dispatch = useAppDispatch();
    const [newUser, setNewUser] = useState({name: '', email: '', password: ''});
    const [repeatPassword, setRepeatPassword] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewUser({
            ...newUser,
            [event.target.name]: event.target.value
        });
        if (event.target.name === 'repeatPassword') {
            setRepeatPassword(event.target.value);
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        try {
            event.preventDefault();
            if (newUser.password !== repeatPassword) {
                return Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Las contraseñas no coinciden...",
                  });
            }
            const { data } = await axiosURL.post('/user', newUser);
            const { name, email } = data;
            const userLocaleStorage = {name, email}
            if (data) {
                dispatch(logOutUser());
                window.localStorage.setItem("User", JSON.stringify(userLocaleStorage));
                dispatch(logInUser(data));
                setNewUser({name: '', email: '', password: ''});
                setRepeatPassword('');
                return Swal.fire({
                    icon: "success",
                    title: "Cuenta creada con éxito!",
                    text: 'Explora con total libertad'
                  });
            }
        } catch (error) {
      if (error instanceof Error) console.error(error.message);
        }
    }

  return (
    <>
      <NavBar />
      <main className="flex flex-col gap-10 px-5 dark:bg-neutral-900 text-black dark:text-white py-56 md:py-96 lg:py-64">
        <h1 className="text-3xl text-center md:text-start">Crear una cuenta</h1>
        <section className="flex flex-col justify-evenly border border-white h-64 p-4 bg-purple-400">
            <h2>Ingresa tus datos personales</h2>
            <form onSubmit={handleSubmit} className="flex flex-col justify-evenly h-full text-black lg:text-xl m-auto md:w-1/2 lg:w-1/3">
                    <div className="flex justify-between items-center">
                        <label htmlFor="name">Nombre: </label>
                        <input value={newUser.name} onChange={handleChange} name="name" type="text" className="rounded-xl border-2 border-black lg:w-64 p-1" />
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <label htmlFor="email">Correo: </label>
                        <input value={newUser.email} onChange={handleChange} name="email" type="email" className="rounded-xl border-2 border-black lg:w-64 p-1" />

                    </div>

                    <div className="flex justify-between items-center">
                        <label htmlFor="password">Contraseña: </label>
                        <input value={newUser.password} onChange={handleChange} name="password" type="password" className="rounded-xl border-2 border-black lg:w-64 p-1" />

                    </div>

                    <div className="flex justify-between items-center gap-10">
                        <label htmlFor="password">Repite tu contraseña: </label>
                        <input value={repeatPassword} onChange={handleChange} name="repeatPassword" type="password" className="rounded-xl border-2 border-black -ml-5 lg:w-64 p-1" />
                    </div>
                    <button type="submit">Crear Cuenta</button>
            </form>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CrearCuenta;
