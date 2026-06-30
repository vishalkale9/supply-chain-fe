import { useState, useEffect } from "react";
import {
  createProduct,
  getMyInventory,
  transferProduct,
} from "../services/product.service";
import {
  getSupplierOrders,
  updateOrderStatus,
} from "../services/order.service";
import { getUsersByRole } from "../services/user.service";

const SupplierDashboard = () => {
  const [activeTab, setActiveTab] = useState("inventory");

  // State for Add Product Form
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    batchId: "",
    quantity: "",
  });
  const [isAdding, setIsAdding] = useState(false);

  // State for Inventory and Transfer Modal
  const [inventory, setInventory] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [transferData, setTransferData] = useState({
    newOwnerId: "",
    statusUpdate: "In Transit",
  });
  const [isTransferring, setIsTransferring] = useState(false);

  // State for Orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // State for Transporters Dropdown
  const [transporters, setTransporters] = useState([]);

  useEffect(() => {
    if (activeTab === "inventory") {
      fetchInventory();
    } else if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  async function fetchInventory() {
    setInventoryLoading(true);
    try {
      const data = await getMyInventory();
      setInventory(data || []);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setInventoryLoading(false);
    }
  }

  async function fetchOrders() {
    setOrdersLoading(true);
    try {
      const data = await getSupplierOrders();
      setOrders(data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await createProduct({
        ...newProduct,
        quantity: Number(newProduct.quantity),
      });
      setNewProduct({ name: "", description: "", batchId: "", quantity: "" });
      fetchInventory();
      alert("Product added successfully!");
    } catch (error) {
      alert("Error adding product: " + (error.message || error));
    } finally {
      setIsAdding(false);
    }
  };

  const openTransferModal = async (product) => {
    setSelectedProduct(product);
    setTransferData({ newOwnerId: "" }); // removed statusUpdate from state as it's hardcoded
    setTransferModalOpen(true);

    // Fetch transporters if we haven't already
    if (transporters.length === 0) {
      try {
        const fetchedTransporters = await getUsersByRole("Transporter");
        setTransporters(fetchedTransporters);
      } catch (error) {
        console.error("Failed to fetch transporters", error);
      }
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!transferData.newOwnerId) {
      alert("⚠️ Please select a Transporter!");
      return;
    }

    setIsTransferring(true);
    try {
      await transferProduct({
        productId: selectedProduct._id || selectedProduct.id,
        newOwnerId: transferData.newOwnerId,
        statusUpdate: "In Transit", // hardcoded as per business logic
      });
      setTransferModalOpen(false);
      fetchInventory(); // Refresh inventory after transfer
      alert("Product transferred successfully to Transporter!");
    } catch (error) {
      alert("Error transferring product: " + (error.message || error));
    } finally {
      setIsTransferring(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders(); // Refresh orders to show new status
    } catch (error) {
      alert("Error updating status: " + (error.message || error));
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-gray-50 overflow-hidden w-full">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex-shrink-0 flex flex-col">
        <div className="p-6 hidden md:block">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
            Supplier Panel
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
            My Inventory
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 md:flex-none flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "orders"
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Incoming Orders
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {activeTab === "inventory"
              ? "Inventory Management"
              : "Order Processing"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {activeTab === "inventory"
              ? "Add new product batches and manage your current stock."
              : "View and update the status of buyer orders."}
          </p>
        </div>

        {/* INVENTORY TAB CONTENT */}
        {activeTab === "inventory" && (
          <div className="space-y-6 flex flex-col xl:flex-row gap-6">
            {/* Add Product Form */}
            <div className="xl:w-1/3">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Add New Batch
                </h2>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Batch ID / SKU
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduct.batchId}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          batchId: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
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
                      value={newProduct.quantity}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          quantity: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      required
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                      rows="3"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isAdding}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                  >
                    {isAdding ? "Adding..." : "Add Batch"}
                  </button>
                </form>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="xl:w-2/3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Current Inventory
                  </h3>
                </div>

                {inventoryLoading ? (
                  <div className="p-8 text-center text-gray-500">
                    Loading inventory...
                  </div>
                ) : inventory.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No products found. Add a batch to get started.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Batch ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Qty
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
                          <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.batchId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {item.currentStatus || "Manufactured"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => openTransferModal(item)}
                                className="text-blue-600 hover:text-blue-900 font-medium bg-blue-50 px-3 py-1 rounded-md"
                              >
                                Transfer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB CONTENT */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Incoming Orders
              </h3>
            </div>

            {ordersLoading ? (
              <div className="p-8 text-center text-gray-500">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No orders found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Buyer ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Update Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {order._id || order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.productId?.name || "Unknown Product"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {order.buyerId || "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <select
                            value={order.status}
                            disabled={
                              updatingOrderId === (order._id || order.id)
                            }
                            onChange={(e) =>
                              handleUpdateOrderStatus(
                                order._id || order.id,
                                e.target.value,
                              )
                            }
                            className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-gray-50"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
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
                    Transfer Ownership
                  </h3>
                  <div className="bg-blue-50 p-3 rounded-md mb-4 border border-blue-100">
                    <p className="text-sm text-blue-800">
                      You are transferring custody of{" "}
                      <strong>{selectedProduct.name}</strong> (Batch:{" "}
                      <span className="font-mono">
                        {selectedProduct.batchId}
                      </span>
                      ) to a logistics partner or warehouse.
                    </p>
                  </div>

                  <div className="space-y-4 mt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Logistics Partner (Transporter)
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
                          -- Choose a Transporter --
                        </option>
                        {transporters.map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.name} ({t.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Status Update dropdown removed. Automatically set to "In Transit" */}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isTransferring}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {isTransferring ? "Transferring..." : "Confirm Transfer"}
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

export default SupplierDashboard;
