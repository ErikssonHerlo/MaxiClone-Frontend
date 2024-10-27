import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { ToastContainer, toast } from 'react-toastify';

const BookCreation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isbn_code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [quantity, setQuantity] = useState('');
  const [publication_date, setPublicationDate] = useState('');
  const [editorial, setPublisher] = useState('');
  const [cover_image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
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
            `http://35.227.62.223:8082/api/v1/catalogs/products/${id}`,
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
          setCode(result.data.isbn_code);
          setTitle(result.data.title);
          setAuthor(result.data.author);
          setQuantity(result.data.quantity);
          setDescription(result.data.description);
          setImage(result.data.cover_image);
          setPublisher(result.data.editorial);
          setStatus(result.data.status);
        } catch (error) {}
      };

      fetchCareer();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookData = id
      ? { isbn_code,title, author, quantity, description, cover_image, publication_date,editorial, status }
      : { isbn_code,title, author, quantity, description, cover_image, publication_date,editorial, status };

    try {

      console.log(JSON.stringify(bookData));
      const response = await fetch(
        `http://18.226.172.184:8080/api/v1/book${id ? `/${id}` : ''}`,
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
        id ? 'Libro actualizado exitosamente' : 'Libro creado exitosamente',
      );
    } catch (error) {
      console.error('Error:', error);
      showErrorMessage(
        'Error al registrar o actualizar el libro. Por favor, verifica los datos e intenta de nuevo.',
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
      <Breadcrumb pageName={id ? 'Editar libro' : 'Agregar libro'} />

      <div className="flex justify-center">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark md:w-1/2">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
            {id ? 'Editar libro' : 'Agregar libro'}
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Codigo ISBN <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  value={isbn_code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ingresa el codigo"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  disabled={id ? true : false}
                  required
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Título <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ingresa el título"
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Autor <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Ingresa el autor"
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Cantidad <span className="text-meta-1">*</span>
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min={status === 'not_available' ? 0 : 1}
                  max={status === 'not_available' ? 0 : undefined}
                  placeholder="Ingresa la cantidad"
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Fecha de publicación
                </label>
                <input
                  type="date"
                  value={publication_date}
                  onChange={(e) => setPublicationDate(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Editorial <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  value={editorial}
                  onChange={(e) => setPublisher(e.target.value)}
                  placeholder="Ingresa la editorial"
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Imagen <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  value={cover_image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Ingresa la url de la imagen"
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
                  Estado <span className="text-meta-1">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={id ? true : false}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value="">Seleccione el estado</option>
                  <option value="available">Disponible</option>
                  <option value="not_available">No disponible</option>
                </select>
              </div>

              <button
                type="submit"
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                {id ? 'Editar libro' : 'Agregar libro'}
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
