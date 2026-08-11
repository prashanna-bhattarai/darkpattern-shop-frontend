import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import api from "../lib/axios";
import ProductCard from "../components/ProductCard";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api
      .get(`/products/search?q=${encodeURIComponent(q)}`)
      .then((res) => setProducts(res.data.products))
      .finally(() => setIsLoading(false));
  }, [q]);

  return (
    <div className="min-h-screen bg-base-200 max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">
        {isLoading ? "Searching..." : `${products.length} results for "${q}"`}
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
      {!isLoading && products.length === 0 && (
        <p className="text-center text-base-content/60 py-16">
          No products found.
        </p>
      )}
    </div>
  );
};

export default SearchResultsPage;
