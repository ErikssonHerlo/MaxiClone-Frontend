import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const Book = ({ book }) => {
  return (
    <div className="bg-white dark:bg-[#24303F] w-46 mb-10 rounded-md">
      <img className='w-full h-56 object-cover rounded-t-md' src={book.cover} alt={book.title} />
      <div className="pl-2 py-2">
        <h1 className="text-[#1D2A39] dark:text-white font-bold">{book.title}</h1>
        <h2 className="text-sm text-[#3C50E0]">{book.author}</h2>
        <div className="flex flex-row items-center my-2">
          <FaEye style={{ cursor: 'pointer', marginRight: '10px' }} />
          <FaEdit style={{ cursor: 'pointer', marginRight: '10px' }} />
          <FaTrash style={{ cursor: 'pointer' }} />
        </div>
      </div>
    </div>
  );
};

export default Book;
