import { useState, useEffect } from "react";
import {
  getAllWarehouses,
  getWarehouseDetails,
  updateWarehouseInventory,
} from "../services/warehouse.service.js";

const WarehouseDashboard = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [warehouseDetails, setWarehouseDetails] = useState(null);

  // Loading States
  const [isListLoading, setIsListLoading] = useState(true);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    operation: "add",
  });

  // 1. Fetch the list of warehouses on mount
  useEffect(() => {
    const fetchWarehouses = async () => {
      setIsListLoading(true);
      try {
        const data = await getAllWarehouses();
        const list = Array.isArray(data) ? data : data.warehouses || [];
        setWarehouses(list);
        if (list.length > 0) {
          setSelectedWarehouseId(list[0]._id || list[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch warehouses:", error);
      } finally {
        setIsListLoading(false);
      }
    };
    fetchWarehouses();
  }, []);

  // 2. Fetch specific warehouse details whenever selectedWarehouseId changes
  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedWarehouseId) return;
      setIsDetailsLoading(true);
      try {
        const data = await getWarehouseDetails(selectedWarehouseId);
        setWarehouseDetails(data);
      } catch (error) {
        console.error("Failed to fetch warehouse details:", error);
      } finally {
        setIsDetailsLoading(false);
      }
    };
    fetchDetails();
  }, [selectedWarehouseId]);

  // 3. Handle Inventory Update
  const handleInventoryUpdate = async (e) => {
    e.preventDefault();
    if (!selectedWarehouseId) return;

    setIsUpdating(true);
    try {
      await updateWarehouseInventory(selectedWarehouseId, {
        productId: formData.productId,
        quantity: Number(formData.quantity),
        operation: formData.operation,
      });

      alert("Inventory updated successfully!");
      setFormData({ productId: "", quantity: "", operation: "add" });

      // Refresh the warehouse details to see new inventory
      const data = await getWarehouseDetails(selectedWarehouseId);
      setWarehouseDetails(data);
    } catch (error) {
      alert("Error updating inventory: " + (error.message || error));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-gray-50 overflow-hidden w-full">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex-shrink-0 flex flex-col">
        <div className="p-6 hidden md:block">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
            Facility Manager
          </h2>
        </div>

        <nav className="flex-1 px-4 py-4 md:py-0 space-y-2 flex md:flex-col overflow-x-auto md:overflow-x-visible">
          <button className="flex-1 md:flex-none flex items-center px-4 py-3 rounded-lg text-sm font-medium bg-blue-50 text-blue-700">
            <svg
              className="mr-3 h-5 w-5 flex-shrink-0 hidden md:block"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Inventory Hub
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Warehouse Operations
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Monitor facility stock levels and log incoming/outgoing shipments.
            </p>
          </div>

          {/* Warehouse Selector */}
          <div className="min-w-[250px]">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Active Facility
            </label>
            {isListLoading ? (
              <div className="animate-pulse h-10 bg-gray-200 rounded-md"></div>
            ) : (
              <select
                value={selectedWarehouseId}
                onChange={(e) => setSelectedWarehouseId(e.target.value)}
                className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm bg-white"
              >
                {warehouses.length === 0 ? (
                  <option value="">No facilities found</option>
                ) : (
                  warehouses.map((w) => (
                    <option key={w._id || w.id} value={w._id || w.id}>
                      {w.name} ({w.location})
                    </option>
                  ))
                )}
              </select>
            )}
          </div>
        </div>

        {/* Dashboard Content */}
        {!selectedWarehouseId && !isListLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <p className="text-lg font-medium text-gray-900">
              No Facility Selected
            </p>
            <p className="mt-1">
              Please select a warehouse from the dropdown above to view its
              inventory.
            </p>
          </div>
        ) : isDetailsLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
            <svg
              className="animate-spin h-8 w-8 mx-auto text-blue-600 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading facility data...
          </div>
        ) : (
          warehouseDetails && (
            <div className="space-y-6 flex flex-col xl:flex-row gap-6">
              {/* Log Shipment Form */}
              <div className="xl:w-1/3">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Log Shipment
                  </h2>
                  <form onSubmit={handleInventoryUpdate} className="space-y-5">
                    {/* Operation Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Operation
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="operation"
                            value="add"
                            checked={formData.operation === "add"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                operation: e.target.value,
                              })
                            }
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Receive (Add)
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="operation"
                            value="remove"
                            checked={formData.operation === "remove"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                operation: e.target.value,
                              })
                            }
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Dispatch (Remove)
                          </span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product ID
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.productId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            productId: e.target.value,
                          })
                        }
                        placeholder="Enter exact Product ID"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData({ ...formData, quantity: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? "Updating Ledger..." : "Update Inventory"}
                    </button>
                  </form>
                </div>

                {/* Facility Meta */}
                <div className="mt-6 bg-gray-900 rounded-xl shadow-sm p-6 text-white">
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
                    Facility Stats
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Name:</span>
                      <span className="font-semibold">
                        {warehouseDetails.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Location:</span>
                      <span className="font-semibold">
                        {warehouseDetails.location}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Capacity limit:</span>
                      <span className="font-semibold">
                        {warehouseDetails.capacity?.toLocaleString() || "N/A"}{" "}
                        units
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="xl:w-2/3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
                  <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      Current Stock
                    </h3>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      Live Updates
                    </span>
                  </div>

                  {!warehouseDetails.inventory ||
                  warehouseDetails.inventory.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                      <p className="text-lg">Facility is currently empty.</p>
                      <p className="text-sm mt-2">
                        Log an incoming shipment to add stock.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product ID
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Stock Qty
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {warehouseDetails.inventory.map((item, idx) => {
                            const prod = item.productId || {};
                            const qty = item.quantity || 0;
                            return (
                              <tr
                                key={idx}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {prod.name || "Unknown Product"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                  {prod._id || prod.id || item.productId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-right">
                                  {qty.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {qty > 0 ? (
                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                      In Stock
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                      Out of Stock
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default WarehouseDashboard;
