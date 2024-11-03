import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { ToastContainer, toast } from 'react-toastify';

const ReportTop5ProductsOrdersTime = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [quantity, setQuantity] = useState<number>(0);
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [orderStatus, setOrderStatus] = useState('');
    const authToken = sessionStorage.getItem('authToken');
    const storeId = localStorage.getItem('StoreId');
    if (!authToken) {
        navigate('/'); // Si no hay token, redirigir al inicio de sesión
    }


    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            const response = await fetch(
                `http://35.237.124.228/api/v1/orders/report/topProductsByQuantity?startDate=${startDate}&endDate=${endDate}&limit=${quantity}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
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
            const reportData = {
                reportName: "Reporte de top productos mas solicitados",
                elements: result.data,
            };
            const report = await fetch(
                `http://35.237.124.228/api/v1/reports/generate`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify(reportData),
                },
            );
            if (!report.ok) {
                console.error(response);
                if(report.status === 401){
                    window.sessionStorage.removeItem('authToken');
                    window.location.href = '/';
                }
                throw new Error('Network response was not ok');
            }
            // Convierte la respuesta en un Blob
            const pdfBlob = await report.blob();

            // Crea una URL de descarga para el Blob
            const downloadUrl = URL.createObjectURL(pdfBlob);

            // Crea un enlace de descarga y haz que se haga clic automáticamente
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'reporte.pdf';
            document.body.appendChild(link);
            link.click();

            // Limpia el objeto URL
            URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(link);
            showSuccessMessage(
                'Reporte generado correctamente',
            );
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage(
                'Error al generar el reporte',
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
            <Breadcrumb pageName='Generar Reporte' />

            <div className="flex justify-center">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark md:w-1/2">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Crear reporte
                        </h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6.5">
                        <div className="mb-4.5">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Limite
                                        </label>
                                        <input
                                            required
                                            value={quantity}
                                            type="number" // Cambiado a datetime-local
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                        <div className="mb-4.5">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Fecha de Inicio
                                        </label>
                                        <input
                                            required
                                            value={startDate}
                                            type="date" // Cambiado a datetime-local
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

                                    <div className="mb-4.5">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Fecha Final
                                        </label>
                                        <input
                                            required
                                            value={endDate}
                                            type="date" // Cambiado a datetime-local
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>



                            <button
                                type="submit"
                                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                            >
                               Generar Reporte
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </DefaultLayout>
    );
};

export default ReportTop5ProductsOrdersTime;
