import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Cambiado useHistory por useNavigate
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { ToastContainer, toast } from 'react-toastify';

const CarreerCreation = () => {
  const { id } = useParams(); // Obtener el ID de la carrera de la URL si existe
  const navigate = useNavigate(); // Usar useNavigate para la navegación después del éxito
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [rol, setRol] = useState('user');

  const authToken = sessionStorage.getItem('authToken');
  if (!authToken) {
    navigate('/'); // Si no hay token, redirigir al inicio de sesión
  }

  useEffect(() => {
    if (id) {
      // Si hay un ID presente, obtener los datos de la carrera
      const fetchCareer = async () => {
        const authToken = sessionStorage.getItem('authToken');
        if (!authToken) {
          navigate('/'); // Si no hay token, redirigir al inicio de sesión
        }
        try {
          const response = await fetch(
            `http://18.226.172.184:8080/api/v1/career/${id}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
              },
            },
          );

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const result = await response.json();
          setCode(result.data.code);
          setName(result.data.name);
        } catch (error) {}
      };

      fetchCareer();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const careerData = id ? { name } : { code, name };

    try {
      const response = await fetch(
        `http://18.226.172.184:8080/api/v1/career${id ? `/${id}` : ''}`,
        {
          method: id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(careerData),
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      showSuccessMessage(
        id ? 'Se edito la informacion de la carrera' : 'Se registro la carrera exitosamente',
      );
    } catch (error) {
      showErrorMessage(
        'Error al registrar la carrera. Valida la informacion y tus datos.',
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

  const getUserInfo = () => {
    const userInfo = localStorage.getItem('UserInfo');
    if (userInfo !== null) {
      const userInfoObj = JSON.parse(userInfo);
      return userInfoObj;
    } else {
      return null;
    }
  };

  useEffect(() => {
    setRol(getUserInfo().role);
  }, []);

  useEffect(() => {
    if (rol === 'student') {
      navigate('/'); // Si el rol es estudiante, redirigir al inicio
    }
  }, [rol]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName={id ? 'Editar carrera' : 'Registrar carrera'} />

      <div className="flex justify-center">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark md:w-1/2">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              {id ? 'Editar carrera' : 'Registrar carrera'}
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Codigo <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ingresa el codigo"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  disabled={id ? true : false}
                  required
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Nombre <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ingresa el nombre"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                {id ? 'Actualizar carrera' : 'Registrar carrera'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </DefaultLayout>
  );
};

export default CarreerCreation;
