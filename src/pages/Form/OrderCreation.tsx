import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { ToastContainer, toast } from 'react-toastify';
import { sleep } from '../../common/utils';

const OrderCreation = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [totalOrder, setTotalOrder] = useState(0);
    const [role, setRoleCode] = useState('');
    const [skuInput, setSkuInput] = useState('');
    const [orderDetails, setOrderDetails] = useState([]);
    const [productLoading, setProductLoading] = useState(false);

    const authToken = sessionStorage.getItem('authToken');
    const storeId = localStorage.getItem('StoreId');
    if (!authToken) {
        navigate('/'); // Si no hay token, redirigir al inicio de sesión
    }

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
                        if (response.status === 401) {
                            window.sessionStorage.removeItem('authToken');
                            window.location.href = '/';
                        }
                        throw new Error('Network response was not ok');
                    }
                    const userData = await response.json();
                    setTotalOrder(userData.data.totalOrder);
                    setRoleCode(userData.data.role);
                } catch (error) { }
            };
            fetchUser();
        }
    }, [id]);

    // Función para buscar producto por SKU
    // Función para buscar producto por SKU con validación de stock
const handleSkuSearch = async (e) => {
    e.preventDefault();
    setProductLoading(true);
    try {
        const response = await fetch(
            `http://35.237.124.228/api/v1/catalog/products/${skuInput}`,
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
            throw new Error('Producto no encontrado');
        }

        const result = await response.json();
        const product = result.data;

        // Verificar si el producto ya está en los detalles
        const existingProduct = orderDetails.find(
            (item) => item.productId === product.sku
        );

        if (existingProduct) {
            showErrorMessage('El producto ya está en la lista');
        } else if (product.totalStock === 0) {
            // Validación para productos sin stock
            showErrorMessage(`El producto ${product.name} no tiene stock disponible y no puede ser agregado.`);
        } else {
            // Agregar producto a los detalles de la orden
            const newOrderDetail = {
                productId: product.sku,
                quantityRequested: 1,
                unitCost: product.cost,
                totalCost: product.cost * 1,
                productData: product, // Guardamos los datos adicionales del producto
            };

            setOrderDetails([...orderDetails, newOrderDetail]);
            setTotalOrder(
                totalOrder + newOrderDetail.totalCost
            );
            setSkuInput('');
        }
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage('Producto no encontrado');
    } finally {
        setProductLoading(false);
    }
};


    // Función para eliminar un producto de la lista
    const handleRemoveProduct = (productId) => {
        const updatedOrderDetails = orderDetails.filter(
            (item) => item.productId !== productId
        );
        const removedProduct = orderDetails.find(
            (item) => item.productId === productId
        );
        setOrderDetails(updatedOrderDetails);
        setTotalOrder(
            totalOrder - removedProduct.totalCost
        );
    };

    // Función para actualizar la cantidad solicitada
    // Función para actualizar la cantidad solicitada con validación de stock
const handleQuantityChange = (productId, quantity) => {
    const updatedOrderDetails = orderDetails.map((item) => {
        if (item.productId === productId) {
            // Validación para que la cantidad no exceda el stock disponible
            if (quantity > item.productData.totalStock) {
                showErrorMessage(`No hay suficiente stock para ${item.productData.name}. Disponible: ${item.productData.totalStock}`);
                return item; // Retornar sin cambiar la cantidad
            }
            const newTotalCost = item.unitCost * quantity;
            return {
                ...item,
                quantityRequested: quantity,
                totalCost: newTotalCost,
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

        const orderData = {
            totalOrder,
            createOrderDetailDto: orderDetails.map((item) => ({
                productId: item.productId,
                quantityRequested: item.quantityRequested,
                unitCost: item.unitCost,
                totalCost: item.totalCost,
            })),
        };

        try {
            console.log(JSON.stringify(orderData));
            const response = await fetch(
                `http://35.237.124.228/api/v1/stores/${storeId}/order`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify(orderData),
                },
            );

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
            showSuccessMessage('Orden creada exitosamente');
            sleep(3000);
            // Redirigir o limpiar el formulario según sea necesario
            navigate('../tables/orders'); // Por ejemplo, redirigir a la lista de órdenes
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage(
                'Error al crear la orden. Por favor, intenta de nuevo.'
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
            <Breadcrumb pageName={'Crear orden'} />

            <div className="flex justify-between">
                {/* Sección Izquierda */}
                <div className="w-1/2 pr-4">
                    {/* Caja para crear orden */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Crear orden
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
                                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                                >
                                    Crear orden
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Caja para buscar SKU */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Buscar Producto por SKU
                            </h3>
                        </div>
                        <form onSubmit={handleSkuSearch}>
                            <div className="p-6.5">
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        SKU del Producto <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={skuInput}
                                        onChange={(e) => setSkuInput(e.target.value)}
                                        required
                                        placeholder="Ingrese el SKU del producto"
                                        className="w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded bg-secondary p-3 font-medium text-gray hover:bg-opacity-90"
                                    disabled={productLoading}
                                >
                                    {productLoading ? 'Buscando...' : 'Agregar Producto'}
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
                                                />
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Total: ${item.totalCost.toFixed(2)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveProduct(item.productId)}
                                            className="ml-4 text-red-500 hover:text-red-700"
                                        >
                                            Eliminar
                                        </button>
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

export default OrderCreation;