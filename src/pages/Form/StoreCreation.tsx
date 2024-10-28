import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { ToastContainer, toast } from 'react-toastify';
import { sleep } from '../../common/utils';

const StoreCreation = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [storeType, setStoreType] = useState('NORMAL');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [urlImage, setImage] = useState(null);
    const [rol, setRol] = useState('user');

    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
        navigate('/'); // Si no hay token, redirigir al inicio de sesión
    }

    useEffect(() => {
        if (id) {
            // Si hay un ID presente, obtener los datos de la carrera
            const fetchCareer = async () => {
                try {
                    const response = await fetch(
                        `http://35.237.124.228/api/v1/stores/${id}`,
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
                    setImage(result.data.urlImage);
                    setAddress(result.data.address);
                    setStoreType(result.data.storeType);
                    setPhone(result.data.phone);

                } catch (error) { }
            };

            fetchCareer();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const bookData = id
            ? { code, name, urlImage: urlImage, address, storeType, phone }
            : { code, name, urlImage: urlImage, address, storeType, phone };

        try {
            const response = await fetch(
                `http://35.237.124.228/api/v1/stores${id ? `/${id}` : ''}`,
                {
                    method: id ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify(bookData),
                },
            );

            if (!response.ok) {
                console.error(response);
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log(result);
            showSuccessMessage(
                id ? 'Tienda actualizada exitosamente' : 'Tienda creado exitosamente',
            );
            await sleep(3000);
            navigate('/tables/stores');
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage(
                'Error al registrar o actualizar la Tienda. Por favor, verifica los datos e intenta de nuevo.',
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
            <Breadcrumb pageName={id ? 'Editar Tienda' : 'Agregar Tienda'} />

            <div className="flex justify-center">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark md:w-1/2">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            {id ? 'Editar Producto' : 'Agregar Producto'}
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
                                    placeholder="Ingresa el Codigo"
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Direccion <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Ingresa la direccion"
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                                    min={status === 'not_available' ? 0 : 1}
                                    max={status === 'not_available' ? 0 : undefined}
                                    placeholder="Ingresa el nombre"
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Telefono <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    min={status === 'not_available' ? 0 : 1}
                                    max={status === 'not_available' ? 0 : undefined}
                                    placeholder="Ingresa el telefono"
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Tipo de Tienda <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={storeType}
                                    onChange={(e) => setStoreType(e.target.value)}
                                    placeholder="Ingresa el tipo de tienda"
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>



                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Imagen <span className="text-meta-1"></span>
                                </label>
                                <input
                                    type="text"
                                    value={urlImage}
                                    onChange={(e) => setImage(e.target.value)}
                                    placeholder="Ingresa la url de la imagen"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>

                            <button
                                type="submit"
                                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                            >
                                {id ? 'Editar Tienda' : 'Agregar Tienda'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </DefaultLayout>
    );
};

export default StoreCreation;
