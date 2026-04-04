const Pagination = ({ pagination, onPageChange }) => {
  const { page, pages, total } = pagination;

  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const pages_arr = [];
    const delta = 2;
    for (let i = Math.max(1, page - delta); i <= Math.min(pages, page + delta); i++) {
      pages_arr.push(i);
    }
    return pages_arr;
  };

  return (
    <div className="flex items-center justify-between mt-8">
      <p className="text-sm text-dark-400">
        Showing page {page} of {pages} ({total} items)
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-2 rounded-lg text-sm text-dark-300 hover:text-white hover:bg-dark-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ←
        </button>

        {page > 3 && (
          <>
            <button onClick={() => onPageChange(1)} className="px-3 py-2 rounded-lg text-sm text-dark-300 hover:text-white hover:bg-dark-800 transition-colors">1</button>
            {page > 4 && <span className="px-2 text-dark-500">...</span>}
          </>
        )}

        {getPageNumbers().map(num => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${num === page
              ? 'bg-primary-500 text-dark-950 font-semibold'
              : 'text-dark-300 hover:text-white hover:bg-dark-800'
              }`}
          >
            {num}
          </button>
        ))}

        {page < pages - 2 && (
          <>
            {page < pages - 3 && <span className="px-2 text-dark-500">...</span>}
            <button onClick={() => onPageChange(pages)} className="px-3 py-2 rounded-lg text-sm text-dark-300 hover:text-white hover:bg-dark-800 transition-colors">{pages}</button>
          </>
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          className="px-3 py-2 rounded-lg text-sm text-dark-300 hover:text-white hover:bg-dark-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default Pagination;