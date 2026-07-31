import { useEffect, useState } from "react";
import {
  getPricingRules,
} from "../../services/pricingRules/pricingRulesService";

const AdminPricingRules = () => {
  const [pricingRules, setPricingRules] = useState([]);

  useEffect(() => {
    const loadPricingRules = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const data = await getPricingRules(token);

        setPricingRules(data);
      } catch (error) {
        console.error("Error al cargar las reglas de precios:", error);
      }
    };

    loadPricingRules();
  }, []);

  console.log(pricingRules);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Reglas de precios
      </h1>

      <pre className="bg-gray-100 text-black p-4 rounded overflow-auto">
        {JSON.stringify(pricingRules, null, 2)}
      </pre>
    </div>
  );
};

export default AdminPricingRules;