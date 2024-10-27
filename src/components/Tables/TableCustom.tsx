import React, { useState, useEffect } from 'react';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface DataItem {
  [key: string]: any;
}

interface Column {
  label: string;
  renderCell: (item: DataItem) => React.ReactNode;
}

const theme = {
  Table: `
    --data-table-library_grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    font-size: 16px;
    color: #ffffff;
    background-color: #333333;
    border-radius: 10px;
    overflow-x: auto;
    @media (max-width: 600px) {
      --data-table-library_grid-template-columns: 1fr;
    }
  `,
  HeaderRow: `
    background-color: #1D2A39;
  `,
  HeaderCell: `
    padding: 15px;
  `,
  Row: `
    &:nth-of-type(odd) {
      background-color: #fff;
      color: #333;
    }
    &:nth-of-type(even) {
      background-color: #1D2A39;
    }
  `,
  Cell: `
    padding: 15px;
  `,
};

const fetchData = async (endpoint: string, token: string) => {
  const response = await fetch(endpoint + '/all', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
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
  columns: Column[];
  module: string;
  urlKey: string;
}

const TableCustom: React.FC<TableCustomProps> = ({
  endpoint,
  columns,
  module,
  urlKey
}) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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

  useEffect(() => {
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

  const paginatedData = filteredData.slice(page * size, (page + 1) * size);

  const fixedColumns = [
    ...columns,
    {
      label: 'Actions',
      renderCell: (item: DataItem) => (
        <div className="flex flex-row items-center">
          {module !== 'reservation-creation' && (
            <FaEye
            onClick={() => handleEdit(item)}
            style={{ cursor: 'pointer', marginRight: '10px' }}
          />
          )}
          {module !== 'reservation-creation' && (
          <FaEdit
            onClick={() => handleEdit(item)}
            style={{ cursor: 'pointer', marginRight: '10px' }}
          />
          )}
          <FaTrash
            onClick={() => handleDelete(item[urlKey])}
            style={{ cursor: 'pointer' }}
          />
        </div>
      ),
    },
  ];

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

      <CompactTable
        columns={fixedColumns}
        data={{ nodes: paginatedData }}
        theme={useTheme(theme)}
      />
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

export default TableCustom;
