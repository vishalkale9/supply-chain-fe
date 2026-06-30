import { useState, useEffect } from "react";
import {
  getMyShipments,
  updateShipmentStatus,
} from "../services/transport.service.js";
import {
  getMyInventory,
  transferProduct,
} from "../services/product.service.js";
import { getUsersByRole } from "../services/user.service.js";

const TransporterDashboard = () => {
  const [activeTab, setActiveTab] = useState("inventory");

  // Shipments state
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Inventory / Custody state
  const [inventory, setInventory] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);

  // Transfer Modal state
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [transferData, setTransferData] = useState({ newOwnerId: "" });
  const [isTransferring, setIsTransferring] = useState(false);
  const [warehouses, setWarehouses] = useState([]);

  async function fetchShipments() {
    try {
      const data = await getMyShipments();
      setShipments(data || []);
    } catch (error) {
      console.error("Failed to fetch shipments:", error);
    }
  }

  async function fetchInventory() {
    try {
      const data = await getMyInventory();
      setInventory(data || []);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      if (activeTab === "shipments") {
        setIsLoading(true);
        await fetchShipments();
        setIsLoading(false);
      } else if (activeTab === "inventory") {
        setInventoryLoading(true);
        await fetchInventory();
        setInventoryLoading(false);
      }
    };
    loadData();
  }, [activeTab]);

  const handleStatusChange = async (shipmentId, newStatus) => {
    setUpdatingId(shipmentId);
    try {
      await updateShipmentStatus(shipmentId, newStatus);
      await fetchShipments();
    } catch (error) {
      alert("Error updating shipment status: " + (error.message || error));
    } finally {
      setUpdatingId(null);
    }
  };

  const openTransferModal = async (product) => {
    setSelectedProduct(product);
    setTransferData({ newOwnerId: "" });
    setTransferModalOpen(true);

    // Fetch warehouse managers for dropdown
    if (warehouses.length === 0) {
      try {
        const fetchedWarehouses = await getUsersByRole("WarehouseManager");
        setWarehouses(fetchedWarehouses);
      } catch (error) {
        console.error("Failed to fetch warehouses", error);
      }
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!transferData.newOwnerId) {
      alert("⚠️ Please select a Warehouse!");
      return;
    }

    setIsTransferring(true);
    try {
      await transferProduct({
        productId: selectedProduct._id || selectedProduct.id,
        newOwnerId: transferData.newOwnerId,
        statusUpdate: "In Warehouse", // Set status automatically for handoff to warehouse
      });
      setTransferModalOpen(false);
      fetchInventory();
      alert("Product transferred successfully to Warehouse!");
    } catch (error) {
      alert("Error transferring product: " + (error.message || error));
    } finally {
      setIsTransferring(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "DISPATCHED":
      case "Manufactured":
        return "bg-blue-100 text-blue-800";
      case "IN_TRANSIT":
      case "In Transit":
        return "bg-indigo-100 text-indigo-800";
      case "OUT_FOR_DELIVERY":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
      case "In Warehouse":
        return "bg-green-100 text-green-800";
      case "RETURNED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-gray-50 overflow-hidden w-full">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex-shrink-0 flex flex-col">
        <div className="p-6 hidden md:block">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
            Logistics Panel
          </h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 md:py-0 space-y-2 flex md:flex-col overflow-x-auto md:overflow-x-visible">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`flex-1 md:flex-none flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "inventory"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            My Custody
          </button>

          <button
            onClick={() => setActiveTab("shipments")}
            className={`flex-1 md:flex-none flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "shipments"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Active Shipments
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {activeTab === "inventory"
              ? "Products in Custody"
              : "Assigned Shipments"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {activeTab === "inventory"
              ? "View the physical products currently in your possession."
              : "View your logistics pipeline and update tracking statuses in real-time."}
          </p>
        </div>

        {/* INVENTORY / CUSTODY TAB CONTENT */}
        {activeTab === "inventory" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Products Queue
              </h3>
            </div>

            {inventoryLoading ? (
              <div className="p-12 text-center text-gray-500">
                Loading products...
              </div>
            ) : inventory.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg">
                  No products currently in your custody.
                </p>
                <p className="text-sm mt-2">
                  Suppliers will transfer products to you when they are ready.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product / Batch
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inventory.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500 font-mono mt-1">
                            Batch: {item.batchId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity} units
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                              item.history?.[item.history.length - 1]?.status,
                            )}`}
                          >
                            {item.history?.[item.history.length - 1]?.status ||
                              "Unknown"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openTransferModal(item)}
                            className="text-blue-600 hover:text-blue-900 font-medium bg-blue-50 px-3 py-1 rounded-md"
                          >
                            Transfer to Warehouse
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SHIPMENTS TAB CONTENT */}
        {activeTab === "shipments" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Logistics Queue
              </h3>
            </div>

            {isLoading ? (
              <div className="p-12 text-center text-gray-500">
                Loading shipments...
              </div>
            ) : shipments.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg">No active shipments assigned to you.</p>
                <p className="text-sm mt-2">
                  Wait for an admin or warehouse to create a shipping manifest.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tracking / Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Route
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Est. Delivery
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {shipments.map((shipment, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-blue-600 font-mono">
                            {shipment.trackingNumber || "PENDING-TRK"}
                          </div>
                          <div className="text-xs text-gray-500 font-mono mt-1">
                            Ord:{" "}
                            {shipment.orderId?._id || shipment.orderId || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <span className="font-semibold text-xs text-gray-400">
                              FROM:
                            </span>{" "}
                            {shipment.originAddress}
                          </div>
                          <div className="text-sm text-gray-900 mt-1">
                            <span className="font-semibold text-xs text-gray-400">
                              TO:
                            </span>{" "}
                            {shipment.destinationAddress}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {shipment.estimatedDeliveryDate
                            ? new Date(
                                shipment.estimatedDeliveryDate,
                              ).toLocaleDateString()
                            : "Not set"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(shipment.status)}`}
                          >
                            {shipment.status || "PENDING"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <select
                            value={shipment.status}
                            disabled={
                              updatingId === (shipment._id || shipment.id)
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                shipment._id || shipment.id,
                                e.target.value,
                              )
                            }
                            className="block w-full pl-3 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white border shadow-sm"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="DISPATCHED">Dispatched</option>
                            <option value="IN_TRANSIT">In Transit</option>
                            <option value="OUT_FOR_DELIVERY">
                              Out for Delivery
                            </option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="RETURNED">Returned</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* TRANSFER MODAL */}
      {transferModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity"
              onClick={() => setTransferModalOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-900 opacity-50 backdrop-blur-sm"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>

            {/* Modal Panel */}
            <div className="relative z-10 inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200">
              <form onSubmit={handleTransfer}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-xl leading-6 font-bold text-gray-900 mb-4">
                    Transfer to Warehouse
                  </h3>
                  <div className="bg-blue-50 p-3 rounded-md mb-4 border border-blue-100">
                    <p className="text-sm text-blue-800">
                      You are transferring custody of{" "}
                      <strong>{selectedProduct.name}</strong> (Batch:{" "}
                      <span className="font-mono">
                        {selectedProduct.batchId}
                      </span>
                      ) to a destination warehouse.
                    </p>
                  </div>

                  <div className="space-y-4 mt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Destination Warehouse
                      </label>
                      <select
                        value={transferData.newOwnerId}
                        onChange={(e) =>
                          setTransferData({
                            ...transferData,
                            newOwnerId: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white"
                      >
                        <option value="" disabled>
                          -- Choose a Warehouse --
                        </option>
                        {warehouses.map((w) => (
                          <option key={w._id} value={w._id}>
                            {w.name} ({w.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isTransferring}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {isTransferring ? "Transferring..." : "Confirm Handoff"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransporterDashboard;
