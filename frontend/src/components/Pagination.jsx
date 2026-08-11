const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-8">
      <div className="join">
        <button
          className="join-item btn btn-sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          «
        </button>
        {pages.map((p) => (
          <button
            key={p}
            className={`join-item btn btn-sm ${p === page ? "btn-primary" : ""}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        <button
          className="join-item btn btn-sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Pagination;
