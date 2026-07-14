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

  const renderFilterGroup = (title, list, idKey, labelKey, activeValue, filterKey) => (
    <div className="border-l-2 p-4" style={{ borderColor: "var(--color-bg-light)", background: "var(--color-bg-light)" }}>
      <h2 className="text-xs uppercase tracking-[0.5em] mb-3 flex items-center gap-2" style={{ color: "var(--color-accent)" }}>
        <span style={{ color: "var(--color-accent-secondary)" }}>///</span> {title}
      </h2>
      <div
        className="max-h-48 overflow-y-auto pr-2 space-y-1"
        style={{ scrollbarColor: "var(--color-accent) var(--color-bg-light)", scrollbarWidth: "thin" }}
      >
        {list.map((item) => (
          <button
            key={item[idKey]}
            onClick={() => updateFilter(filterKey, item[labelKey])}
            className="block text-left text-xs uppercase tracking-widest transition-all w-full px-2 py-1"
            style={
              activeValue === item[labelKey]
                ? { color: "var(--color-bg-dark)", background: "var(--color-accent)" }
                : { color: "var(--color-text-muted)" }
            }
            onMouseEnter={e => {
              if (activeValue !== item[labelKey]) {
                e.currentTarget.style.color = "var(--color-accent)";
                e.currentTarget.style.borderLeft = "1px solid var(--color-accent)";
                e.currentTarget.style.paddingLeft = "0.75rem";
              }
            }}
            onMouseLeave={e => {
              if (activeValue !== item[labelKey]) {
                e.currentTarget.style.color = "var(--color-text-muted)";
                e.currentTarget.style.borderLeft = "none";
                e.currentTarget.style.paddingLeft = "0.5rem";
              }
            }}
          >
            {activeValue === item[labelKey] ? "> " : ""}{item[labelKey]}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <section className="min-h-screen px-16 py-12" style={{ background: "var(--color-bg-dark)", fontFamily: "Space Grotesk" }}>

      <div className="mb-10">
        <div
          className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-[0.5em] mb-4"
          style={{ background: "var(--color-accent)", color: "var(--color-bg-dark)" }}
        >
          SHOP
        </div>
        <h1 className="text-[40px] font-bold uppercase tracking-tighter leading-none" style={{ color: "var(--color-text)" }}>
          CATÁLOGO_COMPLETO
        </h1>
      </div>

      <div className="grid md:grid-cols-4 gap-10">

        {/* SIDEBAR */}
        <aside className="md:col-span-1 space-y-6">
          {renderFilterGroup("COLORES", colorsList, "id_color", "name", colors, "colors")}
          {renderFilterGroup("KEYWORDS", keywordsList, "id_keyword", "name", keywords, "keywords")}
          {renderFilterGroup("SERIES", seriesList, "id_series", "title", series, "series")}
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