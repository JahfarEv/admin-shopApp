import { useEffect, useState } from "react";
import AdminLayout from "../../../components/layout/AdminLayout";

const API_BASE = "https://api.poketstor.com";

export default function AdminShopSubscriptions() {
  const [shops, setShops] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("adminToken"); // adjust if needed

  // 🔹 Fetch shops
  const fetchShops = async () => {
    const res = await fetch(`${API_BASE}/api/shops`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setShops(data);
  };

  // 🔹 Fetch plans
  const fetchPlans = async () => {
    const res = await fetch(`${API_BASE}/api/subscription-plans/getallplan`);
    const data = await res.json();
    setPlans(data.plans || []);
  };

  useEffect(() => {
    fetchShops();
    fetchPlans();
  }, []);

  // 🔹 Activate subscription
  const activateSubscription = async (shopId) => {
    const planId = selectedPlan[shopId];
    if (!planId) {
      alert("Please select a plan");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/adminDashboard/start-without-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ shopId, planId }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed");
      } else {
        alert("Subscription activated");
        fetchShops(); // refresh
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getPlanName = (planId) =>
    plans.find((p) => p._id === planId)?.name || "—";

  return (
    <AdminLayout>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Shop Subscriptions</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Shop</th>
              <th className="p-3">Place</th>
              <th className="p-3">Status</th>
              <th className="p-3">Plan</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {shops.map((shop) => {
              const isActive = shop.subscription?.isActive;

              return (
                <tr key={shop._id} className="border-t text-white">
                  <td className="p-3 font-medium">{shop.shopName}</td>
                  <td className="p-3">
                    {shop.place}, {shop.state}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    {isActive ? (
                      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* PLAN */}
                  <td className="p-3">
                    {isActive
                      ? getPlanName(shop.subscription?.plan)
                      : "—"}
                  </td>

                  {/* ACTION */}
                  <td className="p-3">
                    {isActive ? (
                      <span className="text-gray-400 text-sm">
                        Already Active
                      </span>
                    ) : (
                      <div className="flex gap-2 items-center text-black ">
                        <select
                          className="border rounded px-2 py-1 text-sm bg-white"
                          value={selectedPlan[shop._id] || ""}
                          onChange={(e) =>
                            setSelectedPlan((prev) => ({
                              ...prev,
                              [shop._id]: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select Plan</option>
                          {plans.map((plan) => (
                            <option key={plan._id} value={plan._id}>
                              {plan.name}
                            </option>
                          ))}
                        </select>

                        <button
                          disabled={loading}
                          onClick={() => activateSubscription(shop._id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                          Activate
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {shops.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No shops found
          </p>
        )}
      </div>
    </div>
    </AdminLayout>
  );
}
