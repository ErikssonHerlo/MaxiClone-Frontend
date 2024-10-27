import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { ToastContainer, toast } from 'react-toastify';

const UserCreation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [username, setUsername] = useState('');
  const [full_name, setName] = useState('');
  const [career_code, setCareerCode] = useState('');
  const [dob, setBirthdate] = useState('');
  const [password, setPassword] = useState('');
  const [careerOptions, setCareerOptions] = useState([]);
  const [role, setRoleCode] = useState('');

  const authToken = sessionStorage.getItem('authToken');
  if (!authToken) {
    navigate('/'); // Si no hay token, redirigir al inicio de sesión
  }
  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await fetch(
          `http://18.226.172.184:8080/api/v1/career/all`,
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
        const careerData = await response.json();
        setCareerOptions(careerData.data);
      } catch (error) {
        console.error('Error fetching careers:', error);
      }
    };
    fetchCareers();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await fetch(
            `http://18.226.172.184:8080/api/v1/user/${id}`,
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
          const userData = await response.json();
          setUsername(id);
          setName(userData.data.full_name);
          setCareerCode(userData.data.career_code);
          setBirthdate(userData.data.dob);
          setRoleCode(userData.data.role);
        } catch (error) {}
      };
      fetchUser();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = id
      ? { full_name, career_code, role, dob, password }
      : {
          username,
          full_name,
          career_code,
          role,
          dob,
          password,
        };

    try {
      console.log(JSON.stringify(userData));
      const response = await fetch(
        `http://18.226.172.184:8080/api/v1/user${id ? `/${id}` : ''}`,
        {
          method: id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(userData),
        },
      );

      if (!response.ok) {
        console.error(response);
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result);
      showSuccessMessage(
        id
          ? 'Usuario actualizado exitosamente'
          : 'Usuario registrado exitosamente',
      );
    } catch (error) {
      console.error('Error:', error);
      showErrorMessage(
        'Error al registrar o actualizar el usuario. Por favor, verifica los datos e intenta de nuevo.',
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

  

  return (
    <DefaultLayout>
      <Breadcrumb pageName={id ? 'Editar usuario' : 'Crear usuario'} />

      <div className="flex justify-center">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark md:w-1/2">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              {id ? 'Editar usuario' : 'Crear usuario'}
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Username <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa el username"
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  disabled={id ? true : false}
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Nombre Completo <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  value={full_name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ingresa el nombre"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Código de carrera
                </label>
                <select
                  value={career_code}
                  onChange={(e) => setCareerCode(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value="">Selecciona una carrera</option>
                  {careerOptions.map((career) => (
                    <option key={career.code} value={career.code}>
                      {career.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Rol de usuario <span className="text-meta-1">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRoleCode(e.target.value)}
                  disabled={id ? true : false}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value="">Seleccione el rol</option>
                  <option value="student">Estudiante</option>
                  <option value="librarian">Bibliotecario</option>
                </select>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Password <span className="text-meta-1">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa una password"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                {id ? 'Actualizar usuario' : 'Registrar usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </DefaultLayout>
  );
};

export default UserCreation;
