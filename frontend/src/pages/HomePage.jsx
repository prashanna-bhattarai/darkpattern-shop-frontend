import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import api from "../lib/axios";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 12;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  // Read the page from the URL.
  // If there is no page parameter, default to page 1.
  const urlPage = Number(searchParams.get("page")) || 1;

  const [page, setPage] = useState(urlPage);
  const [totalPages, setTotalPages] = useState(1);

  // Keep React state synchronized with the URL.
  useEffect(() => {
    const newPage = Number(searchParams.get("page")) || 1;

    if (newPage !== page) {
      setPage(newPage);
    }
  }, [searchParams]);

  // Load categories
  useEffect(() => {
    api
      .get("/products/categories")
      .then((res) => setCategories(res.data.categories));
  }, []);

  // Load products whenever category or page changes
  useEffect(() => {
    setIsLoading(true);

    const params = new URLSearchParams({
      page,
      limit: PAGE_SIZE,
    });

    if (activeCategory !== "All") {
      params.set("category", activeCategory);
    }

    api
      .get(`/products?${params.toString()}`)
      .then((res) => {
        setProducts(res.data.products);
        setTotalPages(res.data.pagination.totalPages);
      })
      .finally(() => setIsLoading(false));
  }, [activeCategory, page]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);

    // Reset to page 1 when category changes
    setPage(1);

    // Update URL
    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ page: "1" });
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);

    // Update the URL
    if (newPage === 1) {
      setSearchParams({});
    } else {
      setSearchParams({ page: String(newPage) });
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-error text-white text-center py-2 text-sm font-semibold">
        ⚡ Mega Sale is LIVE -- prices this low won't be back. Shop now before
        it ends!
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            className={`btn btn-sm ${
              activeCategory === "All" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => handleCategoryChange("All")}
          >
            All
          </button>

          {categories.map((c) => (
            <button
              key={c}
              className={`btn btn-sm ${
                activeCategory === c ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => handleCategoryChange(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-base-content/60 py-20">
            No products found.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
