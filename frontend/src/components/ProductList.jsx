import { useEffect, useState } from "react";
import { getProducts, searchProducts } from "../services/api";
import ProductCard from "./ProductCard";

export default function ProductList({ filter, searchQuery, colors, keywords, series, isSold, onCardClick }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams();
  
    if (colors) params.append("colors", colors);
    if (filter && filter !== "all") params.append("category", filter);
    if (isSold !== undefined) params.append("is_sold", isSold);
    else params.append("is_sold", false);
    if (keywords) params.append("keywords", keywords);
    if (series) params.append("series", series);
  
    const queryString = params.toString() 
    ? `?${params.toString().replace(/\+/g, "%20")}` 
    : "";
    
  
    if (searchQuery) {
      searchProducts(searchQuery)
        .then((data) => setProducts(data.results))
        .catch(console.error);
    } else {
      getProducts(queryString)
        .then(setProducts)
        .catch(console.error);
    }
  
  }, [searchQuery, filter, colors, keywords, series]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id_product}
          product={product}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
}