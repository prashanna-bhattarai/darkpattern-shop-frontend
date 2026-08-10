import { useEffect, useState } from "react";
import api from "../lib/axios";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get("/products"),
          api.get("/products/categories"),
        ]);
        setProducts(productsRes.data.products);
        setCategories(categoriesRes.data.categories);
      } catch {
        // if the backend isn't reachable yet, the page still renders empty
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filtered =
    activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-base-200">
      {/* False Urgency: sitewide sale banner */}
      <div className="bg-error text-white text-center py-2 text-sm font-semibold">
        ⚡ Mega Sale is LIVE -- prices this low won't be back. Shop now before it ends!
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            className={`btn btn-sm ${activeCategory === "All" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setActiveCategory("All")}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className={`btn btn-sm ${activeCategory === c ? "btn-primary" : "btn-outline"}`}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-base-content/60 py-20">
            No products found. Have you run <code>npm run seed</code> in the backend yet?
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
