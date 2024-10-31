import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { ToastContainer, toast } from 'react-toastify';
import { sleep } from '../../common/utils';

const DEFAULT_IMAGE_URL = "https://as2.ftcdn.net/v2/jpg/04/99/93/31/1000_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg";

const OrderView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [totalOrder, setTotalOrder] = useState(0);
    const [orderStatus, setOrderStatus] = useState('');
    const [role, setRoleCode] = useState('');
    const [skuInput, setSkuInput] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [orderDetails, setOrderDetails] = useState([]);
    const [productLoading, setProductLoading] = useState(false);

    const authToken = sessionStorage.getItem('authToken');
    const storeId = localStorage.getItem('StoreId');
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

    const fetchOrderStatusUpdate = async (status,rejectionReason) => {
        try {
            const response = await fetch(
                `http://35.237.124.228/api/v1/orders/${id}/status`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({ orderStatus:status, rejectionReason }),
                }
            );
            if (!response.ok) {
                showErrorMessage('Error al actualizar orden');
                throw new Error('Error al actualizar orden')
            };
            const result = await response.json();
        } catch (error) {
            console.error(`Error fetching order update details for order ${id}:`, error);
        }
    };

    useEffect(() => {
        // Cargar datos de la orden si se está editando
        if (id) {
            const fetchOrder = async () => {
                try {
                    const response = await fetch(
                        `http://35.237.124.228/api/v1/orders/${id}`,
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
                    const orderData = await response.json();
                    const detailsWithImages = await Promise.all(
                        orderData.data.orderDetails.map(async (detail) => {
                            const productData = await fetchProductDetails(detail.productId);
                            return {
                                ...detail,
                                productData, // Agregar datos del producto, incluyendo la imagen y availableStock
                            };
                        })
                    );
                    setOrderDetails(detailsWithImages);
                    setOrderStatus(orderData.data.orderStatus);
                    setTotalOrder(orderData.data.totalOrder);
                    setRoleCode(orderData.data.role);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchOrder();
        }
    }, [id]);

    // Función para buscar producto por SKU
    const handleOrderReject = async (e) => {
        e.preventDefault();
        setProductLoading(true);
        try {
            const order = await fetchOrderStatusUpdate('REJECTED',rejectionReason);
            showSuccessMessage('Orden rechazada exitosamente');
            await sleep(3000);
            navigate('../tables/orders');
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage('Orden no pudo ser rechazada');
        } finally {
            setProductLoading(false);
        }
    };

    const handleQuantityChange = (productId, quantity) => {
        const updatedOrderDetails = orderDetails.map((item) => {
            if (item.productId === productId) {
                const quantityChange = quantity - item.quantityRequested;
                const maxQuantity = item.productData.availableStock + item.quantityRequested;

                if (quantity > maxQuantity) {
                    showErrorMessage(`No hay suficiente stock para ${item.productData.name}. Disponible: ${maxQuantity}`);
                    return item;
                }

                // Actualizar el availableStock del producto en consecuencia
                const updatedProductData = {
                    ...item.productData,
                    availableStock: item.productData.availableStock - quantityChange,
                };

                const newTotalCost = item.unitCost * quantity;
                return {
                    ...item,
                    quantityRequested: quantity,
                    totalCost: newTotalCost,
                    productData: updatedProductData,
                };
            }
            return item;
        });

        setOrderDetails(updatedOrderDetails);

        // Recalcular el total de la orden
        const newTotalOrder = updatedOrderDetails.reduce(
            (sum, item) => sum + item.totalCost,
            0
        );
        setTotalOrder(newTotalOrder);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url =  `http://35.237.124.228/api/v1/orders/${id}/status`
            const method =  'PUT' ;

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({orderStatus:'REQUESTED'}),
            });

            if (!response.ok) {
                console.error(response);
                if (response.status === 401) {
                    window.sessionStorage.removeItem('authToken');
                    window.location.href = '/';
                }
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log(result);

            // Mensaje de éxito según la operación
            showSuccessMessage(id ? 'Orden Aprobada exitosamente' : 'Orden aprobada exitosamente');
            await sleep(3000);

            // Redirigir o limpiar el formulario según sea necesario
            navigate('../tables/orders'); // Por ejemplo, redirigir a la lista de órdenes
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage(
                id
                    ? 'Error al aprobar la orden. Por favor, intenta de nuevo.'
                    : 'Error al crear la orden. Por favor, intenta de nuevo.'
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
            <Breadcrumb pageName={id ? 'Aprobar o Rechazar Orden' : 'Crear Orden'} />

            <div className="flex justify-between">
                {/* Sección Izquierda */}
                <div className="w-1/2 pr-4">
                    {/* Caja para crear orden */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                {id ? 'Aprobar Orden' : 'Crear Orden'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6.5">
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Total Orden <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={totalOrder}
                                        readOnly
                                        placeholder="Total de la orden"
                                        className="w-full rounded border-[1.5px] border-stroke bg-gray-100 py-3 px-5 text-black outline-none transition focus:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded bg-green-600 p-3 font-medium text-gray hover:bg-opacity-90"
                                >
                                    {id ? 'Aprobar Orden' : 'Crear Orden'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Caja para buscar SKU */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Rechazar Orden
                            </h3>
                        </div>
                        <form onSubmit={handleOrderReject}>
                            <div className="p-6.5">
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Motivo de Rechazo <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        required
                                        placeholder="Ingrese el motivo del rechazo"
                                        className="w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded bg-red-600 p-3 font-medium text-gray hover:bg-opacity-90"
                                    disabled={productLoading}
                                >
                                    {productLoading ? 'Rechazando...' : 'Rechazar Orden'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sección Derecha */}
                <div className="w-1/2 pl-4">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-full overflow-y-auto">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Detalles de la Orden
                            </h3>
                        </div>
                        <div className="p-6.5">
                            {orderDetails.length === 0 ? (
                                <p className="text-center text-gray-500">
                                    No hay productos en la orden.
                                </p>
                            ) : (
                                orderDetails.map((item) => (
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
                                                Precio Unitario: ${item.unitCost}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Stock Disponible: {item.productData.availableStock + item.quantityRequested}
                                            </p>
                                            <div className="flex items-center mt-2">
                                                <label className="mr-2 text-black dark:text-white">
                                                    Cantidad:
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantityRequested}
                                                    onChange={(e) =>
                                                        handleQuantityChange(
                                                            item.productId,
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                    className="w-20 rounded border-[1.5px] border-stroke py-1 px-2 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                                    disabled={true}
                                                />
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Total: ${item.totalCost.toFixed(2)}
                                            </p>
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

export default OrderView;
