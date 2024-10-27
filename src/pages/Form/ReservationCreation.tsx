import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { ToastContainer, toast } from 'react-toastify';

const ReservationCreation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rol, setRol] = useState('user');
  const [username, setUsername] = useState('');
  const [validationResult, setValidationResult] = useState();
  const [isbn_code, setISBNCode] = useState('');
  const [reservation_date, setReservationDate] = useState('');

  const authToken = sessionStorage.getItem('authToken');
  if (!authToken) {
    navigate('/'); // Si no hay token, redirigir al inicio de sesión
  }

  const getUserInfo = () => {
    const userInfo = localStorage.getItem('UserInfo');

    if (userInfo !== null) {
      const userInfoObj = JSON.parse(userInfo);
      return userInfoObj;
    } else {
      return null;
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const validateUsername = async () => {
    try {
      const response = await fetch(
        `http://18.226.172.184:8080/api/v1/user/${username}`,
      );
      if (response.ok) {
        setValidationResult(true);
        console.log('Usuario válido');
        console.log(validationResult);
      } else {
        setValidationResult(false);
        console.log('Usuario inválido');
      }
    } catch (error) {
      console.error('Error:', error);
      setValidationResult('Error al validar el usuario');
    }
  };

  useEffect(() => {
    setRol(getUserInfo().role);
    setISBNCode(id);
    setReservationDate(reservation_date);
    if (rol === 'student') {
      setUsername(getUserInfo().username);
    }
  }, []);

  useEffect(() => {
    setRol(getUserInfo().role);
    if (rol === 'student') {
      setUsername(getUserInfo().username);
    }
  }, [rol]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reservationData = { username, isbn_code, reservation_date };
    console.log(JSON.stringify(reservationData));
    console.log(authToken);

    try {
      const response = await fetch(
        `http://18.226.172.184:8080/api/v1/reservation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(reservationData),
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      showSuccessMessage('Se registro la reservacion exitosamente');
    } catch (error) {
      showErrorMessage(
        'Error al registrar la reservacion. Valida que el libro no esta disponible.',
      );
    }
  };

  const showSuccessMessage = (message) => {
    toast.success(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const showErrorMessage = (message) => {
    toast.error(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };
  
  useEffect(() => {
    setRol(getUserInfo().role);
  }, []);

  

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Crear reservación" />

      <div className="flex justify-center">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark md:w-1/2">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Crear reservación
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Libro <span className="text-meta-1">*</span>
                </label>
                <input
                  value={id}
                  type="text"
                  disabled
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Usuario <span className="text-meta-1">*</span>{' '}
                  {validationResult === true && (
                    <span className="text-sm ml-4 text-green-500">
                      El usuario fue encontrado exitosamente
                    </span>
                  )}
                  {validationResult === false && (
                    <span className="text-sm ml-4 text-red-500">
                      No se encontro un usuario con ese username
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Ingresa el nombre de usuario"
                  value={username}
                  onChange={handleUsernameChange}
                  disabled={rol === 'student'}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                {rol === 'librarian' && (
                  <button
                    type="button"
                    onClick={validateUsername}
                    className="mt-3 bg-primary p-2 text-white rounded-md hover:bg-opacity-90"
                  >
                    Validar existencia de usuario
                  </button>
                )}
              </div>

              <div className="mb-4.5">
                {validationResult && (
                  <p className="text-red-500">{validationResult}</p>
                )}
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  value={reservation_date}
                  onChange={(e) => setReservationDate(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              {validationResult == true && (
                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  Crear reservación
                </button>
              )}
              {rol == 'student' && (
                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  Crear reservación
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </DefaultLayout>
  );
};

export default ReservationCreation;
