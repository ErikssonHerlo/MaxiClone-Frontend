import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { ToastContainer, toast } from 'react-toastify';
import { sleep } from '../../common/utils';

const DEFAULT_IMAGE_URL = "https://as2.ftcdn.net/v2/jpg/04/99/93/31/1000_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg";

const IncidentView = () => {
    const rol = localStorage.getItem('Role');
    const navigate = useNavigate();
    const { id } = useParams();
    const [incidentDetails, setIncidentDetails] = useState([]);
    const [incidentStatus, setIncidentStatus] = useState('');
    const [solution, setSolution] = useState('');
    const [incidentData, setIncidentData] = useState(null);

    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
        navigate('/'); // Redirige al inicio de sesión si no hay token
    }

    // Función para buscar los detalles de un producto por SKU y agregar la imagen
    const fetchProductDetails = async (productSku) => {
        try {
            const response = await fetch(
                `http://35.237.124.228/api/v1/catalog/products/${productSku}`,
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
            return {
                ...result.data,
                coverImageUrl: result.data.coverImageUrl || DEFAULT_IMAGE_URL,
            };
        } catch (error) {
            console.error(`Error fetching product details for SKU ${productSku}:`, error);
            return {
                sku: productSku,
                name: 'Producto Desconocido',
                coverImageUrl: DEFAULT_IMAGE_URL,
            };
        }
    };

    useEffect(() => {
        // Cargar datos de la incidencia
        const fetchIncident = async () => {
            try {
                const response = await fetch(
                    `http://35.237.124.228/api/v1/incidents/${id}`,
                    {
                        method: 'GET',
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
                const incidentData = await response.json();

                // Obtener detalles del producto con imágenes
                const detailsWithImages = await Promise.all(
                    incidentData.data.details.map(async (detail) => {
                        const productData = await fetchProductDetails(detail.productSku);
                        return { ...detail, productData };
                    })
                );
                setSolution(incidentData.data.solution || '');
                setIncidentStatus(incidentData.data.status);
                setIncidentData(incidentData.data);
                setIncidentDetails(detailsWithImages);
            } catch (error) {
                console.error(error);
            }
        };

        fetchIncident();
    }, [id, authToken]);

    // Función para cerrar la incidencia
    const handleResolveIncident = async () => {
        if (!solution.trim()) {
            alert('Por favor, ingrese una solución para la incidencia.');
            return;
        }

        const payload = {
            status: "CLOSED",
            solution: solution.trim(),
        };

        try {
            const response = await fetch(`http://35.237.124.228/api/v1/incidents/${id}`, {
                method: 'PUT',
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

            showSuccessMessage('Incidente Resuelto Exitosamente');
            await sleep(3000);

            navigate('../tables/incidents');
        } catch (error) {
            console.error('Error al resolver la incidencia:', error);
            showErrorMessage('Error al resolver la incidencia. Por favor, intenta de nuevo.');
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
            <Breadcrumb pageName={'Ver Incidente'} />

            <div className="flex justify-center">
                <div className="w-full max-w-3xl">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-full overflow-y-auto">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Productos con Incidencias
                            </h3>
                        </div>
                        <div className="p-6.5">
                            {incidentDetails.length === 0 ? (
                                <p className="text-center text-gray-500">
                                    No hay productos en esta incidencia.
                                </p>
                            ) : (
                                incidentDetails.map((item) => (
                                    <div
                                        key={item.incidentDetailId}
                                        className="flex items-center mb-4 border-b pb-4"
                                    >
                                        <img
                                            src={item.productData.coverImageUrl}
                                            alt={item.productData.name}
                                            className="w-16 h-16 object-cover rounded mr-4"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-black dark:text-white">
                                                {item.productData.name || 'Producto Desconocido'}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                SKU: {item.productSku}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Cantidad Afectada: {item.affectedQuantity}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Razón: {item.reason}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}

                            {/* Input para solución de la incidencia */}
                            <div className="mt-6">
                                <label htmlFor="solution" className="block text-black dark:text-white mb-2">
                                    Solución:
                                </label>
                                {(incidentStatus === 'OPEN' && rol === 'WAREHOUSE') && (
                                        <input
                                          type="text"
                                          id="solution"
                                          value={solution}
                                          onChange={(e) => setSolution(e.target.value)}
                                          placeholder="Ingrese la solución"
                                          className="w-full rounded border-[1.5px] border-stroke py-2 px-4 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                      />
                                )}
                            {incidentStatus === 'CLOSED' && (
                                <label htmlFor="solution" className="block text-black dark:text-white mb-2">
                                {solution}
                            </label>
                            )}
                            </div>

                            {/* Botón para resolver incidencia */}
                            {(incidentStatus === 'OPEN'&& rol === 'WAREHOUSE') && (

                                <button
                                onClick={handleResolveIncident}
                                className="flex w-full justify-center rounded bg-green-600 p-3 font-medium text-white hover:bg-opacity-90 mt-6"
                                >
                                Solucionar Incidencia
                                </button>
                            )}

                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </DefaultLayout>
    );
};

export default IncidentView;
