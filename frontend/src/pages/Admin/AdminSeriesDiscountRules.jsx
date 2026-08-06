import { useEffect, useState } from "react";
import {
  getSeriesDiscountRules,
  createSeriesDiscountRule,
  updateSeriesDiscountRule,
  deleteSeriesDiscountRule,
} from "../../services/seriesDiscountRules/seriesDiscountRulesService";

const inputStyle = {
  width: "100%",
  background: "var(--color-bg-light)",
  border: "1px solid var(--color-text-muted)",
  color: "var(--color-text)",
  padding: "8px 12px",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.15s ease",
};

const labelStyle = {
  color: "var(--color-text-muted)",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  display: "block",
  marginBottom: "4px",
};

const focusHandlers = {
  onFocus: (e) => (e.target.style.borderColor = "var(--color-accent-secondary)"),
  onBlur: (e) => (e.target.style.borderColor = "var(--color-text-muted)"),
};

const AdminSeriesDiscountRules = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedValues, setEditedValues] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [newMinPieces, setNewMinPieces] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken");

  const loadRules = async () => {
    try {
      const data = await getSeriesDiscountRules(token);
      setRules(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las reglas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  const getDisplayValue = (rule, field) => {
    const key = `${rule.id_discount_rule}_${field}`;
    return editedValues[key] !== undefined ? editedValues[key] : rule[field];
  };

  const handleInputChange = (rule, field, value) => {
    setEditedValues((prev) => ({ ...prev, [`${rule.id_discount_rule}_${field}`]: value }));
  };

  const handleSave = async (rule) => {
    setSavingId(rule.id_discount_rule);
    setError(null);
    try {
      const min_pieces = Number(getDisplayValue(rule, "min_pieces"));
      const discount_percentage = Number(getDisplayValue(rule, "discount_percentage"));

      const updated = await updateSeriesDiscountRule(
        rule.id_discount_rule,
        { min_pieces, discount_percentage },
        token
      );

      setRules((prev) =>
        prev.map((r) => (r.id_discount_rule === rule.id_discount_rule ? updated : r))
      );

      setEditedValues((prev) => {
        const next = { ...prev };
        delete next[`${rule.id_discount_rule}_min_pieces`];
        delete next[`${rule.id_discount_rule}_discount_percentage`];
        return next;
      });

      setSavedId(rule.id_discount_rule);
      setTimeout(() => setSavedId(null), 2000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleActive = async (rule) => {
    try {
      const updated = await updateSeriesDiscountRule(
        rule.id_discount_rule,
        { is_active: !rule.is_active },
        token
      );
      setRules((prev) =>
        prev.map((r) => (r.id_discount_rule === rule.id_discount_rule ? updated : r))
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleDelete = async (rule) => {
    if (!confirm(`¿Eliminar la regla de ${rule.min_pieces} piezas?`)) return;
    setDeletingId(rule.id_discount_rule);
    try {
      await deleteSeriesDiscountRule(rule.id_discount_rule, token);
      setRules((prev) => prev.filter((r) => r.id_discount_rule !== rule.id_discount_rule));
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreate = async () => {
    if (!newMinPieces || !newDiscount) return;
    setCreating(true);
    setError(null);
    try {
      const created = await createSeriesDiscountRule(
        {
          min_pieces: Number(newMinPieces),
          discount_percentage: Number(newDiscount),
        },
        token
      );
      setRules((prev) => [...prev, created].sort((a, b) => a.min_pieces - b.min_pieces));
      setNewMinPieces("");
      setNewDiscount("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <p className="text-text-muted text-xs uppercase tracking-widest animate-pulse">
        [CARGANDO...]
      </p>
    );
  }

  return (
    <div style={{ fontFamily: "Space Grotesk" }}>
      <div className="mb-8">
        <div className="inline-block px-2 py-1 bg-accent text-bg-dark text-xs font-semibold uppercase tracking-[0.4em] mb-3">
          ADMIN
        </div>
        <h1 className="text-3xl font-bold uppercase tracking-tighter text-text-primary">
          DESCUENTOS_POR_SERIE
        </h1>
        <p className="text-text-muted text-xs uppercase tracking-widest mt-1">
          // <span className="text-accent-secondary">{rules.length}</span> REGLAS CONFIGURADAS
        </p>
      </div>

      {error && (
        <div
          className="mb-4 px-4 py-2 text-xs uppercase tracking-widest max-w-2xl"
          style={{ border: "1px solid var(--color-accent)", color: "var(--color-accent)" }}
        >
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 max-w-2xl">
        {rules.length === 0 ? (
          <div
            className="p-8 text-center"
            style={{ border: "1px solid var(--color-text-muted)" }}
          >
            <p className="text-text-muted text-xs uppercase tracking-widest">
              [SIN_REGLAS] // TODAVÍA NO HAY DESCUENTOS POR SERIE CARGADOS
            </p>
          </div>
        ) : (
          rules.map((rule) => (
            <div
              key={rule.id_discount_rule}
              style={{
                border: "1px solid var(--color-text-muted)",
                borderLeft: rule.is_active
                  ? "3px solid var(--color-accent-secondary)"
                  : "3px solid var(--color-text-muted)",
              }}
            >
              <div
                className="flex items-center justify-between px-5 py-3 border-b"
                style={{ borderColor: "var(--color-text-muted)" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: rule.is_active
                        ? "var(--color-accent-secondary)"
                        : "var(--color-text-muted)",
                    }}
                  />
                  <span className="text-text-primary text-sm uppercase font-bold tracking-widest">
                    DESDE {rule.min_pieces} PIEZAS
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {savedId === rule.id_discount_rule && (
                    <span className="text-accent-secondary text-[10px] uppercase tracking-widest">
                      ✓ GUARDADO
                    </span>
                  )}
                  <button
                    onClick={() => handleToggleActive(rule)}
                    className="text-[10px] uppercase tracking-widest transition-colors"
                    style={{ color: "var(--color-text-muted)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent-secondary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                  >
                    {rule.is_active ? "DESACTIVAR" : "ACTIVAR"}
                  </button>
                  <button
                    onClick={() => handleDelete(rule)}
                    disabled={deletingId === rule.id_discount_rule}
                    className="text-[10px] uppercase tracking-widest transition-colors disabled:opacity-40"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {deletingId === rule.id_discount_rule ? "..." : "✕ ELIMINAR"}
                  </button>
                </div>
              </div>

              <div className="px-5 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label style={labelStyle}>Piezas mínimas</label>
                    <input
                      type="number"
                      min="2"
                      value={getDisplayValue(rule, "min_pieces")}
                      onChange={(e) => handleInputChange(rule, "min_pieces", e.target.value)}
                      style={inputStyle}
                      {...focusHandlers}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Descuento (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={getDisplayValue(rule, "discount_percentage")}
                      onChange={(e) => handleInputChange(rule, "discount_percentage", e.target.value)}
                      style={inputStyle}
                      {...focusHandlers}
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleSave(rule)}
                  disabled={savingId === rule.id_discount_rule}
                  className="px-6 py-2 text-xs font-bold uppercase tracking-widest transition-opacity disabled:opacity-40"
                  style={{ background: "var(--color-accent)", color: "var(--color-text)" }}
                >
                  {savingId === rule.id_discount_rule ? "GUARDANDO..." : "GUARDAR"}
                </button>
              </div>
            </div>
          ))
        )}

        {/* Agregar nueva regla */}
        <div
          className="p-5"
          style={{ border: "1px dashed var(--color-accent-secondary)" }}
        >
          <p
            className="text-[11px] uppercase tracking-widest mb-3"
            style={{ color: "var(--color-accent-secondary)" }}
          >
            // NUEVA REGLA
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <div>
              <label style={labelStyle}>Piezas mínimas</label>
              <input
                type="number"
                min="2"
                value={newMinPieces}
                onChange={(e) => setNewMinPieces(e.target.value)}
                placeholder="2"
                style={inputStyle}
                {...focusHandlers}
              />
            </div>
            <div>
              <label style={labelStyle}>Descuento (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={newDiscount}
                onChange={(e) => setNewDiscount(e.target.value)}
                placeholder="10.00"
                style={inputStyle}
                {...focusHandlers}
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={creating || !newMinPieces || !newDiscount}
              className="px-6 py-2 text-xs font-bold uppercase tracking-widest transition-opacity disabled:opacity-40"
              style={{ background: "var(--color-accent)", color: "var(--color-text)" }}
            >
              {creating ? "..." : "AGREGAR"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSeriesDiscountRules;