import { useEffect, useState } from "react";
import {
  getPricingRules,
  updatePricingRule,
} from "../../services/pricingRules/pricingRulesService";

const inputStyle = {
  width: "100%",
  background: "var(--color-bg-light)",
  border: "1px solid var(--color-text-muted)",
  color: "var(--color-text)",
  padding: "8px 12px",
  fontSize: "14px",
  outline: "none",
};

const labelStyle = {
  color: "var(--color-text-muted)",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  display: "block",
  marginBottom: "4px",
};

const LEVELS = [
  { key: "core", label: "Core" },
  { key: "signature", label: "Signature" },
  { key: "premium", label: "Premium" },
];

const AdminPricingRules = () => {
  const [pricingRules, setPricingRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedPrices, setEditedPrices] = useState({}); // { [id_pricing_rule]: value }
  const [savingCategory, setSavingCategory] = useState(null);
  const [savedCategory, setSavedCategory] = useState(null);

  const loadPricingRules = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const data = await getPricingRules(token);
      setPricingRules(data);
    } catch (error) {
      console.error("Error al cargar las reglas de precios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPricingRules();
  }, []);

  const groupedRules = pricingRules.reduce((acc, rule) => {
    const category = rule.category.name;

    if (!acc[category]) {
      acc[category] = {
        id_category: rule.id_category,
        category,
        core: null,
        signature: null,
        premium: null,
      };
    }

    acc[category][rule.artwork_level] = rule;

    return acc;
  }, {});

  const handleInputChange = (id_pricing_rule, value) => {
    setEditedPrices((prev) => ({ ...prev, [id_pricing_rule]: value }));
  };

  const getDisplayValue = (rule) => {
    if (!rule) return "";
    return editedPrices[rule.id_pricing_rule] !== undefined
      ? editedPrices[rule.id_pricing_rule]
      : rule.suggested_price ?? "";
  };

  const handleSaveCategory = async (categoryGroup) => {
    setSavingCategory(categoryGroup.id_category);
    setSavedCategory(null);
    const token = localStorage.getItem("accessToken");

    try {
      const updates = [];

      for (const { key } of LEVELS) {
        const rule = categoryGroup[key];
        if (!rule) continue;

        const value = getDisplayValue(rule);
        updates.push(
          updatePricingRule(
            rule.id_pricing_rule,
            { suggested_price: Number(value) },
            token
          ).then(() => ({ id_pricing_rule: rule.id_pricing_rule, suggested_price: Number(value) }))
        );
      }

      const results = await Promise.all(updates);

      setPricingRules((prev) =>
        prev.map((rule) => {
          const updated = results.find((r) => r.id_pricing_rule === rule.id_pricing_rule);
          return updated ? { ...rule, suggested_price: updated.suggested_price } : rule;
        })
      );

      setEditedPrices((prev) => {
        const next = { ...prev };
        results.forEach((r) => delete next[r.id_pricing_rule]);
        return next;
      });

      setSavedCategory(categoryGroup.id_category);
      setTimeout(() => setSavedCategory(null), 2000);
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar el precio");
    } finally {
      setSavingCategory(null);
    }
  };

  if (loading) return <p className="text-text-muted text-xs uppercase tracking-widest animate-pulse">[CARGANDO...]</p>;

  return (
    <div style={{ fontFamily: "Space Grotesk" }}>
      <div className="mb-8">
        <div className="inline-block px-2 py-1 bg-accent text-bg-dark text-xs font-semibold uppercase tracking-[0.4em] mb-3">
          ADMIN
        </div>
        <h1 className="text-3xl font-bold uppercase tracking-tighter text-text-primary">
          REGLAS_DE_PRECIOS
        </h1>
        <p className="text-text-muted text-xs uppercase tracking-widest mt-1">
          // <span className="text-accent-secondary">{Object.keys(groupedRules).length}</span> CATEGORÍAS CONFIGURADAS
        </p>
      </div>

      {Object.keys(groupedRules).length === 0 ? (
        <div className="border border-text-muted/30 p-8 text-center">
          <p className="text-text-muted text-xs uppercase tracking-widest">[SIN_REGLAS] // NO HAY REGLAS DE PRECIO CARGADAS</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-2xl">
          {Object.values(groupedRules).map((categoryGroup) => (
            <div key={categoryGroup.id_category} className="border" style={{ borderColor: "var(--color-text-muted)" }}>
              <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--color-text-muted)" }}>
                <span className="text-text-primary text-sm uppercase font-bold tracking-widest">{categoryGroup.category}</span>
                {savedCategory === categoryGroup.id_category && (
                  <span className="text-accent-secondary text-[10px] uppercase tracking-widest">✓ GUARDADO</span>
                )}
              </div>

              <div className="px-5 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  {LEVELS.map(({ key, label }) => {
                    const rule = categoryGroup[key];
                    return (
                      <div key={key}>
                        <label style={labelStyle}>{label}</label>
                        <input
                          type="number"
                          disabled={!rule}
                          value={getDisplayValue(rule)}
                          onChange={(e) => rule && handleInputChange(rule.id_pricing_rule, e.target.value)}
                          placeholder={rule ? "0.00" : "N/A"}
                          style={inputStyle}
                          onFocus={e => e.target.style.borderColor = "var(--color-accent-secondary)"}
                          onBlur={e => e.target.style.borderColor = "var(--color-text-muted)"}
                        />
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleSaveCategory(categoryGroup)}
                  disabled={savingCategory === categoryGroup.id_category}
                  className="px-6 py-2 text-xs font-bold uppercase tracking-widest transition-opacity disabled:opacity-40"
                  style={{ background: "var(--color-accent)", color: "var(--color-text)" }}
                >
                  {savingCategory === categoryGroup.id_category ? "GUARDANDO..." : "GUARDAR"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPricingRules;
