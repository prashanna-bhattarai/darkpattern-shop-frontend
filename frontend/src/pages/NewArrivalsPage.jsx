import { useEffect, useState } from "react";
import api from "../lib/axios";
import ProductCard from "../components/ProductCard";
import AdBanner from "../components/AdBanner";

const NewArrivalsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products?section=new-arrivals")
      .then((res) => setProducts(res.data.products))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-base-200 max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">New Arrivals</h1>
      {isLoading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <AdBanner />
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewArrivalsPage;
