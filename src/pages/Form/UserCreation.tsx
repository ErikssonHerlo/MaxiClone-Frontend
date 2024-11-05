import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { ToastContainer, toast } from 'react-toastify';
import { sleep } from '../../common/utils';

const UserCreation = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [email, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [storeId, setStoreId] = useState<number[]>([]);
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
                    `http://35.237.124.228/api/v1/stores?size=100`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${authToken}`,
                        },
                    },
                );
                if (!response.ok) {
                    if(response.status === 401){
                        window.sessionStorage.removeItem('authToken');
                        window.location.href = '/';
                    }
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
                        `http://35.237.124.228/api/v1/users/${id}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${authToken}`,
                            },
                        },
                    );
                    if (!response.ok) {
                        if(response.status === 401){
                            window.sessionStorage.removeItem('authToken');
                            window.location.href = '/';
                        }
                        throw new Error('Network response was not ok');
                    }
                    const userData = await response.json();
                    setUsername(id);
                    setFirstName(userData.data.firstName);
                    setLastName(userData.data.lastName);
                    setStoreId(userData.data.storeId);
                    setRoleCode(userData.data.role);
                } catch (error) { }
            };
            fetchUser();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = id
            ? { firstName, lastName, storeId, role }
            : {
                email,
                firstName,
                lastName,
                storeId,
                password,
                role,
            };

        try {
            console.log(JSON.stringify(userData));
            const response = await fetch(
                `http://35.237.124.228/api/v1/users${id ? `/${id}` : ''}`,
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
                if(response.status === 401){
                    window.sessionStorage.removeItem('authToken');
                    window.location.href = '/';
                }
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log(result);
            showSuccessMessage(
                id
                    ? 'Usuario actualizado exitosamente'
                    : 'Usuario registrado exitosamente',
            );
            await sleep(3000);
            navigate('/tables/users');
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
                                    Email <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Ingresa el email"
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    disabled={id ? true : false}
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Nombres <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    placeholder="Ingresa el nombre"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Apellidos <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    placeholder="Ingresa el nombre"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
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
                                    <option value="ADMINISTRATOR">Administrador</option>
                                    <option value="SUPERVISOR">Supervisor</option>
                                    <option value="STORE">Tienda</option>
                                    <option value="WAREHOUSE">Bodega</option>
                                </select>
                            </div>

                            {role === "STORE" && (
  <div className="mb-4.5">
    <label className="mb-2.5 block text-black dark:text-white">
      Tienda
    </label>
    <select
      value={storeId[0] || ""}
      onChange={(e) => setStoreId([parseInt(e.target.value)])}
      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    >
      <option value="">Selecciona una tienda</option>
      {careerOptions.map((career) => (
        <option key={career.code} value={career.id}>
          {career.name}
        </option>
      ))}
    </select>
  </div>
)}

{role === "WAREHOUSE" && (
  <div className="mb-4.5">
    <label className="mb-2.5 block text-black dark:text-white">
      Tiendas asignadas
    </label>
    <select
      multiple
      value={storeId.map(String)}
      onChange={(e) =>
        setStoreId(Array.from(e.target.selectedOptions, option => parseInt(option.value)))
      }
      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    >
      {careerOptions.map((career) => (
        <option key={career.code} value={career.id}>
          {career.name}
        </option>
      ))}
    </select>
  </div>
)}

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
