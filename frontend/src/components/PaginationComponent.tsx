import { useBlog } from '../context/BlogContext';

const PaginationComponent = () => {
  const { page, setPage, paginationData } = useBlog();
  const totalPages = paginationData?.totalPages;

  // Generate an array of page numbers
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex items-center justify-center mt-3">
      <nav aria-label="Page navigation">
        <ul className="inline-flex items-center -space-x-px">
          {/* First Page Button */}
          <li>
            <button
              className={`px-3 py-2 border border-gray-300 ${
                page === 1
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-gray-200'
              }`}
              disabled={page === 1}
              onClick={() => setPage(1)}
            >
              First
            </button>
          </li>

          {/* Previous Page Button */}
          <li>
            <button
              className={`px-3 py-2 border border-gray-300 ${
                page === 1
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-gray-200'
              }`}
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
          </li>

          {/* Page Number Buttons */}
          {pages.map((item, index) => (
            <li key={index}>
              <button
                className={`px-3 py-2 border border-gray-300 ${
                  item === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setPage(item)}
              >
                {item}
              </button>
            </li>
          ))}

          {/* Next Page Button */}
          <li>
            <button
              className={`px-3 py-2 border border-gray-300 ${
                page === totalPages
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-gray-200'
              }`}
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </li>

          {/* Last Page Button */}
          <li>
            <button
              className={`px-3 py-2 border border-gray-300 ${
                page === totalPages
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-gray-200'
              }`}
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
            >
              Last
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PaginationComponent;
