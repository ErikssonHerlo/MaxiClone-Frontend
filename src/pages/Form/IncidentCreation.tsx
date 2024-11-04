import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { ToastContainer, toast } from 'react-toastify';
import { sleep } from '../../common/utils';

const DEFAULT_IMAGE_URL = "https://as2.ftcdn.net/v2/jpg/04/99/93/31/1000_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg";

const IncidentCreation = () => {
    const rol = localStorage.getItem('Role');
    const navigate = useNavigate();
    const { id } = useParams();
    const [totalShipment, setTotalShipment] = useState(0);
    const [shipmentStatus, setShipmentStatus] = useState('');
    const [shipmentDetails, setShipmentDetails] = useState([]);
    const [productLoading, setProductLoading] = useState(false);

    const [storeIdFromOrder, setStoreIdFromOrder] = useState('');
    const [userIdFromOrder, setUserIdFromOrder] = useState('');

    const [productsWithIncidents, setProductsWithIncidents] = useState([]);
    const [reasonInputs, setReasonInputs] = useState({});
    const [showReasonInputs, setShowReasonInputs] = useState({});

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

    // Función para agregar incidencia
    const handleAddIncidentClick = (productId) => {
        setShowReasonInputs((prev) => ({
            ...prev,
            [productId]: true,
        }));
    };

    const handleReasonInputChange = (productId, value) => {
        setReasonInputs((prev) => ({
            ...prev,
            [productId]: value,
        }));
    };

    const handleReasonInputKeyDown = (e, item) => {
        if (e.key === 'Enter') {
            const reason = reasonInputs[item.productId];
            if (reason && reason.trim() !== '') {
                // Agregar el producto a la lista de incidencias
                setProductsWithIncidents((prev) => [
                    ...prev,
                    {
                        productId: item.productId,
                        productData: item.productData,
                        affectedQuantity: item.quantityShipped, // Valor por defecto
                        reason: reason.trim(),
                        maxQuantity: item.quantityShipped,
                    },
                ]);
                // Ocultar el input y limpiar
                setShowReasonInputs((prev) => ({
                    ...prev,
                    [item.productId]: false,
                }));
                setReasonInputs((prev) => ({
                    ...prev,
                    [item.productId]: '',
                }));
            } else {
                alert('Por favor ingrese una razón para la incidencia.');
            }
        }
    };

    const handleAffectedQuantityChange = (productId, value) => {
        let quantity = parseInt(value, 10);
        if (isNaN(quantity)) quantity = 1;
        setProductsWithIncidents((prev) =>
            prev.map((item) =>
                item.productId === productId
                    ? {
                        ...item,
                        affectedQuantity: Math.min(Math.max(quantity, 1), item.maxQuantity),
                    }
                    : item
            )
        );
    };

    const handleRemoveIncident = (productId) => {
        setProductsWithIncidents((prev) =>
            prev.filter((item) => item.productId !== productId)
        );
    };

    const handleCreateIncident = async () => {
        // Preparar el payload
        const payload = {
            shipmentId: id,
            storeId: storeIdFromOrder,
            userEmail: userIdFromOrder,
            status: "OPEN",
            solution: "",
            details: productsWithIncidents.map((item) => ({
                productSku: item.productId,
                affectedQuantity: item.affectedQuantity,
                reason: item.reason,
            })),
        };

        try {
            const response = await fetch('http://35.237.124.228/api/v1/incidents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                if (response.status === 401) {
                    window.sessionStorage.removeItem('authToken');
                    window.location.href = '/';
                }
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            console.log(result);

            // Mostrar mensaje de éxito
            showSuccessMessage('Incidente creado exitosamente');
            await sleep(3000);

            // Redirigir o actualizar la vista según sea necesario
            navigate('../tables/shipments'); // Por ejemplo, redirigir a la lista de incidentes
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage('Error al crear el incidente. Por favor, intenta de nuevo.');
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

    const isProductInIncidents = (productId) => {
        return productsWithIncidents.some((product) => product.productId === productId);
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName={'Crear Incidente'} />

            <div className="flex justify-between">
                {/* Sección Izquierda */}
                <div className="w-1/2 pr-4">
                    {/* Caja para mostrar productos con incidencias */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-full overflow-y-auto">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Productos con Incidencias
                            </h3>
                        </div>
                        <div className="p-6.5">
                            {productsWithIncidents.length === 0 ? (
                                <p className="text-center text-gray-500">
                                    No hay productos con incidencia.
                                </p>
                            ) : (
                                productsWithIncidents.map((item) => (
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
                                            <p className="text-sm text-gray-500">
                                                Razón: {item.reason}
                                            </p>
                                            <div className="flex items-center mt-2">
                                                <label className="mr-2 text-black dark:text-white">
                                                    Cantidad Afectada:
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={item.maxQuantity}
                                                    value={item.affectedQuantity}
                                                    onChange={(e) =>
                                                        handleAffectedQuantityChange(
                                                            item.productId,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-20 rounded border-[1.5px] border-stroke py-1 px-2 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveIncident(item.productId)}
                                            className="ml-4 text-red-500 hover:text-red-700"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))
                            )}

                            {/* Botón para crear incidente */}
                            {productsWithIncidents.length > 0 && (
                                <button
                                    onClick={handleCreateIncident}
                                    className="flex w-full justify-center rounded bg-green-600 p-3 font-medium text-white hover:bg-opacity-90 mt-4"
                                >
                                    Crear Incidente
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
                                                <span className="text-black dark:text-white">
                                                    {item.quantityShipped}
                                                </span>
                                            </div>
                                        </div>
                                        {shipmentStatus === 'RECEIVED' && (
                                             <div className="flex flex-col">
                                             {(!isProductInIncidents(item.productId )) && (
                                                 <button
                                                     onClick={() => handleAddIncidentClick(item.productId)}
                                                     className="ml-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                 >
                                                     Agregar Incidencia
                                                 </button>
                                             )}
                                             {showReasonInputs[item.productId] && (
                                                 <input
                                                     type="text"
                                                     value={reasonInputs[item.productId] || ''}
                                                     onChange={(e) =>
                                                         handleReasonInputChange(
                                                             item.productId,
                                                             e.target.value
                                                         )
                                                     }
                                                     onKeyDown={(e) => handleReasonInputKeyDown(e, item)}
                                                     placeholder="Ingrese la razón"
                                                     className="ml-4 mt-2 w-full rounded border-[1.5px] border-stroke py-1 px-2 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                                 />
                                             )}

                                              </div>
                                        )}

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

export default IncidentCreation;
