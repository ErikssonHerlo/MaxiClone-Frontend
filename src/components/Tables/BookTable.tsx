import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface DataItem {
  [key: string]: any;
}

const fetchData = async (endpoint: string, token: string) => {
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if(response.status === 401){
    window.sessionStorage.removeItem('authToken');
    window.location.href = '/';
    }
  return response.json();
};

const deleteData = async (endpoint: string, token: string) => {
  await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

interface TableCustomProps {
  endpoint: string;
  module: string;
  urlKey: string;
}

const BookTable: React.FC<TableCustomProps> = ({
  endpoint,
  module,
  urlKey,
}) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [rol, setRol] = useState('user');
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const defaultImage =
    'https://as2.ftcdn.net/v2/jpg/04/99/93/31/1000_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg';

  const token = window.sessionStorage.getItem('authToken');

  useEffect(() => {
    const loadData = async () => {
      if (token) {
        const result = await fetchData(endpoint, token);
        setData(result.data);
        setFilteredData(result.data);
        setTotalPages(Math.ceil(result.data.length / size));
      }
    };

    loadData();
  }, [endpoint, token, size]);

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
    const filtered = data.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === 'string' &&
          value.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );

    setFilteredData(filtered);
    setTotalPages(Math.ceil(filtered.length / size));
    setPage(0);
  }, [searchTerm, data, size]);

  const handleDelete = async (id: string) => {
    if (token) {
      await deleteData(`${endpoint}/${id}`, token);
      setData((prevData) => prevData.filter((item) => item[urlKey] !== id));
    }
  };

  const handleEdit = (item: DataItem) => {
    navigate(`/forms/${module}/${item[urlKey]}`);
  };

  const handleResevation = (item: DataItem) => {
    navigate(`/forms/reservation-creation/${item[urlKey]}`);
  };

  const paginatedData = filteredData.slice(page * size, (page + 1) * size);
  console.log(paginatedData);
  return (
    <div style={{ overflowX: 'auto' }}>
      <div className="flex my-4 items-start max-w-sm">
        <label className="sr-only">Search</label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search..."
            required
          />
        </div>
      </div>

      <div className="flex ">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
          {paginatedData.map((book) => (
            <div
              key={book[urlKey]}
              className="bg-white dark:bg-[#24303F] w-46 rounded-md"
            >

<img
  className="w-full h-72 object-cover rounded-t-md"
  src={
    (book.coverImageUrl?.startsWith('http') ||
      book.coverImageUrl?.startsWith('https')) &&
    !book.coverImageUrl?.startsWith('https://example.com')
      ? book.coverImageUrl
      : defaultImage
  }
  alt={book.title}
  onClick={rol === 'ADMINISTRATOR' ? () => handleEdit(book) : undefined}
/>
              <div className="pl-2 py-2">
                <h1 className="text-[#1D2A39] dark:text-white font-bold">
                  {book.title}
                </h1>
                <div className='flex justify-between items-center'>
                  <h2 className="text-sm text-blue-500">{book.name}</h2>
                  <h2 className={`text-sm ${book.totalStock > 0 ? 'text-green-500' : 'text-red-500'} px-4`}>{book.totalStock > 0 ? 'Unidades: '+book.totalStock : 'No Disponible'}</h2>
                </div>
                <div className="flex flex-row justify-between items-center">
                    {rol === 'ADMINISTRATOR' && (
  <div className="flex">
  <FaEye
    style={{ cursor: 'pointer', marginRight: '10px' }}
    onClick={() => handleEdit(book)}
  />
  <FaEdit
    style={{ cursor: 'pointer', marginRight: '10px' }}
    onClick={() => handleEdit(book)}
  />
  <FaTrash
    style={{ cursor: 'pointer' }}
    onClick={() => handleDelete(book[urlKey])}
  />
</div>
                        )}

                  <div className="flex px-4 py-2">
                    {book.status !== 'available' && (
                      <button
                        className="bg-[#3C50E0] text-white px-2 py-1 rounded-md text-sm"
                        onClick={() => handleResevation(book)}
                      >
                        Ordenar
                      </button>
                    )}
                    {book.status === 'available' && (
                      <button
                        className="bg-[#3C50E0] text-white px-2 py-1 rounded-md text-sm"
                        onClick={() => handleResevation(book)}
                      >
                        Prestar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}
      >
        <button onClick={() => setPage(page - 1)} disabled={page === 0}>
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page + 1 === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookTable;
