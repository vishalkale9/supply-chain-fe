import { useState, useEffect } from "react";
import {
  getMyShipments,
  updateShipmentStatus,
} from "../services/transport.service.js";

const TransporterDashboard = () => {
  const [activeTab, setActiveTab] = useState("shipments");
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  async function fetchShipments() {
    try {
      const data = await getMyShipments();
      setShipments(data || []);
    } catch (error) {
      console.error("Failed to fetch shipments:", error);
    }
  }

  useEffect(() => {
    const loadShipments = async () => {
      if (activeTab === "shipments") {
        setIsLoading(true);
        await fetchShipments();
        setIsLoading(false);
      }
    };
    loadShipments();
  }, [activeTab]);

  const handleStatusChange = async (shipmentId, newStatus) => {
    setUpdatingId(shipmentId);
    try {
      await updateShipmentStatus(shipmentId, newStatus);
      // Optimistically update the UI to avoid a full re-fetch if desired,
      // but re-fetching is safer to ensure data consistency
      await fetchShipments();
    } catch (error) {
      alert("Error updating shipment status: " + (error.message || error));
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "DISPATCHED":
        return "bg-blue-100 text-blue-800";
      case "IN_TRANSIT":
        return "bg-indigo-100 text-indigo-800";
      case "OUT_FOR_DELIVERY":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
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
            Assigned Shipments
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            View your logistics pipeline and update tracking statuses in
            real-time.
          </p>
        </div>

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
                Loading shipments...
              </div>
            ) : shipments.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg">No active shipments assigned to you.</p>
                <p className="text-sm mt-2">
                  Wait for a supplier or warehouse to transfer custody.
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
    </div>
  );
};

export default TransporterDashboard;
