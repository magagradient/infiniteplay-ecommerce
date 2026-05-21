import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductList from "../../components/ProductList";
import { getColors, getKeywords, getSeries } from "../../services/api";

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();

  const [colorsList, setColorsList] = useState([]);
  const [keywordsList, setKeywordsList] = useState([]);
  const [seriesList, setSeriesList] = useState([]);

  useEffect(() => {
    getColors().then(setColorsList).catch(console.error);
    getKeywords().then(setKeywordsList).catch(console.error);
    getSeries().then(setSeriesList).catch(console.error);
  }, []);

  const params = new URLSearchParams(location.search);
  const series = params.get("series") || "";
  const category = params.get("category") || "all";
  const query = params.get("q") || "";
  const colors = params.get("colors") || "";
  const keywords = params.get("keywords") || "";

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(location.search);
    if (newParams.get(key) === value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    navigate(`/products?${newParams.toString()}`);
  };

  return (
    <section className="min-h-screen bg-[#141218] px-16 py-12" style={{ fontFamily: "Space Grotesk" }}>

      <div className="mb-10">
        <div className="inline-block px-2 py-1 bg-[#ffb4ab] text-[#690005] text-xs font-semibold uppercase tracking-[0.5em] mb-4">
          SHOP
        </div>
        <h1 className="text-[40px] font-bold text-[#e6e0e9] uppercase tracking-tighter leading-none">
          CATÁLOGO_COMPLETO
        </h1>
      </div>

      <div className="grid md:grid-cols-4 gap-10">


        {/* SIDEBAR */}
<aside className="md:col-span-1 space-y-6">

  <div className="border-l-2 border-[#381e72] bg-[#1d1b20] p-4">
    <h2 className="text-[#ffb4ab] text-xs uppercase tracking-[0.5em] mb-3 flex items-center gap-2">
      <span className="text-[#494551]">///</span> COLORES
    </h2>
    <div 
      className="max-h-48 overflow-y-auto pr-2 space-y-1"
      style={{ scrollbarColor: "#ffb4ab #1d1b20", scrollbarWidth: "thin" }}
    >
      {colorsList.map((color) => (
        <button
          key={color.id_color}
          onClick={() => updateFilter("colors", color.name)}
          className={`block text-left text-xs uppercase tracking-widest transition-all w-full px-2 py-1 ${
            colors === color.name 
              ? "text-[#141218] bg-[#ffb4ab]" 
              : "text-[#cbc4d2] hover:text-[#ffb4ab] hover:border-l hover:border-[#ffb4ab] hover:pl-3"
          }`}
        >
          {colors === color.name ? "> " : ""}{color.name}
        </button>
      ))}
    </div>
  </div>

  <div className="border-l-2 border-[#381e72] bg-[#1d1b20] p-4">
    <h2 className="text-[#ffb4ab] text-xs uppercase tracking-[0.5em] mb-3 flex items-center gap-2">
      <span className="text-[#494551]">///</span> KEYWORDS
    </h2>
    <div 
      className="max-h-48 overflow-y-auto pr-2 space-y-1"
      style={{ scrollbarColor: "#ffb4ab #1d1b20", scrollbarWidth: "thin" }}
    >
      {keywordsList.map((keyword) => (
        <button
          key={keyword.id_keyword}
          onClick={() => updateFilter("keywords", keyword.name)}
          className={`block text-left text-xs uppercase tracking-widest transition-all w-full px-2 py-1 ${
            keywords === keyword.name 
              ? "text-[#141218] bg-[#ffb4ab]" 
              : "text-[#cbc4d2] hover:text-[#ffb4ab] hover:border-l hover:border-[#ffb4ab] hover:pl-3"
          }`}
        >
          {keywords === keyword.name ? "> " : ""}{keyword.name}
        </button>
      ))}
    </div>
  </div>

  <div className="border-l-2 border-[#381e72] bg-[#1d1b20] p-4">
    <h2 className="text-[#ffb4ab] text-xs uppercase tracking-[0.5em] mb-3 flex items-center gap-2">
      <span className="text-[#494551]">///</span> SERIES
    </h2>
    <div 
      className="max-h-48 overflow-y-auto pr-2 space-y-1"
      style={{ scrollbarColor: "#ffb4ab #1d1b20", scrollbarWidth: "thin" }}
    >
      {seriesList.map((serie) => (
        <button
          key={serie.id_series}
          onClick={() => updateFilter("series", serie.title)}
          className={`block text-left text-xs uppercase tracking-widest transition-all w-full px-2 py-1 ${
            series === serie.title 
              ? "text-[#141218] bg-[#ffb4ab]" 
              : "text-[#cbc4d2] hover:text-[#ffb4ab] hover:border-l hover:border-[#ffb4ab] hover:pl-3"
          }`}
        >
          {series === serie.title ? "> " : ""}{serie.title}
        </button>
      ))}
    </div>
  </div>

</aside>

        {/* PRODUCT GRID */}
        <div className="md:col-span-3">
          <ProductList
            filter={category}
            searchQuery={query}
            colors={colors}
            keywords={keywords}
            series={series}
          />
        </div>

      </div>
    </section>
  );
}