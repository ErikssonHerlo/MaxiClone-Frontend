import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { ToastContainer, toast } from 'react-toastify';
import { sleep } from '../../common/utils';

const BookCreation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sku, setSku] = useState('');
    const [cost, setCost] = useState('');
    const [price, setPrice] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [totalStock, setTotalStock] = useState('');
    const [coverImageUrl, setImage] = useState(null);
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
                        `http://35.237.124.228/api/v1/catalog/products/${id}`,
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
                    setSku(result.data.sku);
                    setCost(result.data.cost);
                    setPrice(result.data.price);
                    setName(result.data.name);
                    setTotalStock(result.data.totalStock);
                    setImage(result.data.coverImageUrl);
                    setDescription(result.data.description);

                } catch (error) { }
            };

            fetchCareer();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const bookData = id
            ? { sku, cost, price, name, totalStock: totalStock, coverImageUrl: coverImageUrl, description: description }
            : { sku, cost, price, name, totalStock: totalStock, coverImageUrl: coverImageUrl,description: description };

        try {

            console.log(JSON.stringify(bookData));
            const response = await fetch(
                `http://35.237.124.228/api/v1/catalog/products${id ? `/${id}` : ''}`,
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
                id ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente',
            );
            await sleep(3000);
            navigate('/'+rol.toLowerCase()+'-dashboard');
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage(
                'Error al registrar o actualizar el Producto. Por favor, verifica los datos e intenta de nuevo.',
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
            <Breadcrumb pageName={id ? 'Editar Producto' : 'Agregar Producto'} />

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
                                    Codigo SKU <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)}
                                    placeholder="Ingresa el codigo"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    disabled={id ? true : false}
                                    required
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Costo <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={cost}
                                    onChange={(e) => setCost(e.target.value)}
                                    placeholder="Ingresa el título"
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Precio <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="Ingresa el precio"
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
                                    Stock Total <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={totalStock}
                                    onChange={(e) => setTotalStock(e.target.value)}
                                    placeholder="Ingresa el stock total"
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Descripción
                                </label>
                                <textarea
                                    rows={6}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Ingresa la descripción"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                ></textarea>
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Imagen <span className="text-meta-1"></span>
                                </label>
                                <input
                                    type="text"
                                    value={coverImageUrl}
                                    onChange={(e) => setImage(e.target.value)}
                                    placeholder="Ingresa la url de la imagen"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>

                            <button
                                type="submit"
                                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                            >
                                {id ? 'Editar Producto' : 'Agregar Producto'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </DefaultLayout>
    );
};

export default BookCreation;
