import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { ToastContainer, toast } from 'react-toastify';
import { sleep } from '../../common/utils';

const DEFAULT_IMAGE_URL = "https://as2.ftcdn.net/v2/jpg/04/99/93/31/1000_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg";

const ShipmentView = () => {
    const rol = localStorage.getItem('Role');
    const navigate = useNavigate();
    const { id } = useParams();
    const [totalShipment, setTotalShipment] = useState(0);
    const [shipmentStatus, setShipmentStatus] = useState('');
    const [shipmentDetails, setShipmentDetails] = useState([]);
    const [productLoading, setProductLoading] = useState(false);

    const [storeIdFromOrder, setStoreIdFromOrder] = useState('');
    const [userIdFromOrder, setUserIdFromOrder] = useState('');

    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
        navigate('/'); // Si no hay token, redirigir al inicio de sesión
    }

    // Función para buscar los detalles de un producto por SKU (productId)
    const fetchProductDetails = async (productId) => {
        try {
            const response = await fetch(
                `http://35.237.124.228/api/v1/catalog/products/${productId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            if (!response.ok) throw new Error('Producto no encontrado');
            const result = await response.json();
            const product = result.data;

            // Calcular availableStock
            const availableStock = product.totalStock - product.pendingStock;

            return {
                ...product,
                availableStock: availableStock,
            };
        } catch (error) {
            console.error(`Error fetching product details for SKU ${productId}:`, error);
            // Retornar datos básicos con la URL de imagen por defecto
            return {
                sku: productId,
                name: 'Producto Desconocido',
                coverImageUrl: DEFAULT_IMAGE_URL,
                cost: 0,
                price: 0,
                totalStock: 0,
                pendingStock: 0,
                availableStock: 0,
            };
        }
    };

    useEffect(() => {
        // Cargar datos del envío
        if (id) {
            const fetchShipment = async () => {
                try {
                    const response = await fetch(
                        `http://35.237.124.228/api/v1/shipments/${id}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${authToken}`,
                            },
                        },
                    );
                    if (!response.ok) {
                        if (response.status === 401) {
                            window.sessionStorage.removeItem('authToken');
                            window.location.href = '/';
                        }
                        throw new Error('Network response was not ok');
                    }
                    const shipmentData = await response.json();

                    const detailsWithImages = await Promise.all(
                        shipmentData.data.shipmentDetails.map(async (detail) => {
                            const productData = await fetchProductDetails(detail.productId);
                            return {
                                ...detail,
                                productData, // Agregar datos del producto
                            };
                        })
                    );
                    setShipmentDetails(detailsWithImages);
                    setShipmentStatus(shipmentData.data.shipmentStatus);
                    setTotalShipment(shipmentData.data.totalShipment);
                    // Almacenar storeId y userId
                    setStoreIdFromOrder(shipmentData.data.storeId);
                    setUserIdFromOrder(shipmentData.data.userId);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchShipment();
        }
    }, [id]);

    // Función para recibir el envío
    const handleReceiveShipment = async () => {
        try {
            const response = await fetch(
                `http://35.237.124.228/api/v1/shipments/${id}/receive`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            if (!response.ok) {
                if (response.status === 401) {
                    window.sessionStorage.removeItem('authToken');
                    window.location.href = '/';
                }
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            console.log(result);

            // Actualizar el estado del envío
            setShipmentStatus(result.data.shipmentStatus);

            // Mensaje de éxito
            showSuccessMessage('Envío recibido exitosamente');
            await sleep(3000);

            // Redirigir o actualizar la vista según sea necesario
            navigate('../tables/shipments'); // Por ejemplo, redirigir a la lista de envíos
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage('Error al recibir el envío. Por favor, intenta de nuevo.');
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
            <Breadcrumb pageName={'Ver Envío'} />

            <div className="flex justify-between">
                {/* Sección Izquierda */}
                <div className="w-1/2 pr-4">
                    {/* Caja para mostrar detalles del envío */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                {rol === 'STORE' ? 'Recibir Envío' : 'Detalles del Envío'}
                            </h3>
                        </div>
                        <div className="p-6.5">
                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Total Envío
                                </label>
                                <input
                                    type="number"
                                    value={totalShipment}
                                    readOnly
                                    placeholder="Total del envío"
                                    className="w-full rounded border-[1.5px] border-stroke bg-gray-100 py-3 px-5 text-black outline-none transition focus:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                />
                            </div>

                            {/* Mostrar botón de "Recibir Envío" solo si rol es 'STORE' y shipmentStatus es 'DISPATCHED' */}
                            {rol === 'STORE' && shipmentStatus === 'DISPATCHED' && (
                                <button
                                    onClick={handleReceiveShipment}
                                    className="flex w-full justify-center rounded bg-green-600 p-3 font-medium text-white hover:bg-opacity-90"
                                >
                                    Recibir Envío
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sección Derecha */}
                <div className="w-1/2 pl-4">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-full overflow-y-auto">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Detalles del Envío
                            </h3>
                        </div>
                        <div className="p-6.5">
                            {shipmentDetails.length === 0 ? (
                                <p className="text-center text-gray-500">
                                    No hay productos en el envío.
                                </p>
                            ) : (
                                shipmentDetails.map((item) => (
                                    <div
                                        key={item.productId}
                                        className="flex items-center mb-4 border-b pb-4"
                                    >
                                        <img
                                            src={item.productData.coverImageUrl}
                                            alt={item.productData.name}
                                            className="w-16 h-16 object-cover rounded mr-4"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-black dark:text-white">
                                                {item.productData.name}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                SKU: {item.productId}
                                            </p>
                                            <div className="flex items-center mt-2">
                                                <label className="mr-2 text-black dark:text-white">
                                                    Cantidad Enviada:
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantityShipped}
                                                    readOnly
                                                    className="w-20 rounded border-[1.5px] border-stroke py-1 px-2 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </DefaultLayout>
    );
};

export default ShipmentView;
