import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  Settings, 
  TrendingUp, 
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  MapPin,
  Phone,
  CreditCard,
  Calendar,
  Truck
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddStore, setShowAddStore] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [stores, setStores] = useState([
    { id: 1, name: "Fresh Mart", category: "Supermarket", rating: 4.5, distance: "0.3 km", status: "Active", orders: 145, address: "123 Main Street, New York, NY 10001", phone: "+1-555-0101" },
    { id: 2, name: "Green Valley Organics", category: "Organic Store", rating: 4.8, distance: "0.7 km", status: "Active", orders: 98, address: "456 Oak Avenue, New York, NY 10002", phone: "+1-555-0102" },
    { id: 3, name: "QuickStop Grocery", category: "Convenience Store", rating: 4.3, distance: "0.2 km", status: "Active", orders: 203, address: "789 Park Boulevard, New York, NY 10003", phone: "+1-555-0103" },
  ]);

  const [products, setProducts] = useState([
    { id: 1, name: "Whole Milk", price: 3.99, category: "Dairy", store: "Fresh Mart", stock: 150, status: "In Stock" },
    { id: 2, name: "White Bread", price: 2.49, category: "Bakery", store: "Fresh Mart", stock: 200, status: "In Stock" },
    { id: 3, name: "Organic Spinach", price: 3.99, category: "Vegetables", store: "Green Valley", stock: 45, status: "Low Stock" },
    { id: 4, name: "Potato Chips", price: 2.99, category: "Snacks", store: "QuickStop", stock: 0, status: "Out of Stock" },
  ]);

  const [orders, setOrders] = useState([
    { id: 1001, customer: "John Doe", phone: "+1-555-1001", location: "123 Main Street, Apt 4B, New York, NY 10001", paymentMethod: "Credit Card", store: "Fresh Mart", storeAddress: "123 Main Street, New York, NY 10001", storePhone: "+1-555-0101", items: 5, total: 45.99, status: "Delivered", date: "2024-12-24", deliveryPartner: "Alex Rivera", deliveryPhone: "+1-555-2001", deliveryVehicle: "Bike" },
    { id: 1002, customer: "Jane Smith", phone: "+1-555-1002", location: "456 Business Ave, Suite 200, New York, NY 10002", paymentMethod: "UPI", store: "Green Valley", storeAddress: "456 Oak Avenue, New York, NY 10002", storePhone: "+1-555-0102", items: 8, total: 67.50, status: "In Transit", date: "2024-12-24", deliveryPartner: "Marcus Chen", deliveryPhone: "+1-555-2002", deliveryVehicle: "Scooter" },
    { id: 1003, customer: "Mike Johnson", phone: "+1-555-1003", location: "789 Oak Road, Brooklyn, NY 10003", paymentMethod: "Cash on Delivery", store: "QuickStop", storeAddress: "789 Park Boulevard, New York, NY 10003", storePhone: "+1-555-0103", items: 3, total: 22.45, status: "Processing", date: "2024-12-24", deliveryPartner: "Priya Sharma", deliveryPhone: "+1-555-2003", deliveryVehicle: "Car" },
    { id: 1004, customer: "Sarah Williams", phone: "+1-555-1004", location: "321 Elm Street, New York, NY 10004", paymentMethod: "Credit Card", store: "Fresh Mart", storeAddress: "123 Main Street, New York, NY 10001", storePhone: "+1-555-0101", items: 6, total: 54.20, status: "Delivered", date: "2024-12-23", deliveryPartner: "David Kumar", deliveryPhone: "+1-555-2004", deliveryVehicle: "Bike" },
  ]);

  const stats = {
    totalRevenue: "$12,543",
    totalOrders: 456,
    activeStores: 3,
    totalProducts: 248
  };

  const renderOrderDetailsModal = () => {
    if (!selectedOrder || !showOrderDetails) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
            <button 
              onClick={() => {
                setShowOrderDetails(false);
                setSelectedOrder(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Order Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <h3 className="text-2xl font-bold text-gray-800">#{selectedOrder.id}</h3>
                </div>
                <span className={`px-4 py-2 rounded-full font-semibold text-sm ${
                  selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                  selectedOrder.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex gap-6 text-sm text-gray-600">
                <div>
                  <p className="text-xs text-gray-500">Order Date</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="font-semibold text-green-600 text-lg">${selectedOrder.total}</p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Customer Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Customer Name</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.customer}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                    <Phone className="w-4 h-4" /> Phone Number
                  </p>
                  <p className="font-semibold text-gray-800">{selectedOrder.phone}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Delivery Location
                  </p>
                  <p className="font-semibold text-gray-800">{selectedOrder.location}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                    <CreditCard className="w-4 h-4" /> Payment Method
                  </p>
                  <p className="font-semibold text-gray-800">{selectedOrder.paymentMethod}</p>
                </div>
              </div>
            </div>

            {/* Store Information */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Store className="w-5 h-5 text-blue-600" />
                Store Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Store Name</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.store}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                    <Phone className="w-4 h-4" /> Store Phone
                  </p>
                  <p className="font-semibold text-gray-800">{selectedOrder.storePhone}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Store Address
                  </p>
                  <p className="font-semibold text-gray-800">{selectedOrder.storeAddress}</p>
                </div>
              </div>
            </div>

            {/* Delivery Partner Information */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-purple-600" />
                Delivery Partner
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Partner Name</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.deliveryPartner}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                    <Phone className="w-4 h-4" /> Partner Phone
                  </p>
                  <p className="font-semibold text-gray-800">{selectedOrder.deliveryPhone}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                    <Truck className="w-4 h-4" /> Vehicle Type
                  </p>
                  <p className="font-semibold text-gray-800">{selectedOrder.deliveryVehicle}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                Order Summary
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-gray-600">Number of Items</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedOrder.items}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-gray-600">Order Total</p>
                  <p className="text-2xl font-bold text-green-600">${selectedOrder.total}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowOrderDetails(false);
                  setSelectedOrder(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                Download Invoice
              </button>
              <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Revenue</p>
              <h3 className="text-3xl font-bold mt-2">{stats.totalRevenue}</h3>
              <p className="text-blue-100 text-xs mt-2">+12% from last month</p>
            </div>
            <DollarSign className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Orders</p>
              <h3 className="text-3xl font-bold mt-2">{stats.totalOrders}</h3>
              <p className="text-green-100 text-xs mt-2">+8% from last month</p>
            </div>
            <ShoppingCart className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Active Stores</p>
              <h3 className="text-3xl font-bold mt-2">{stats.activeStores}</h3>
              <p className="text-purple-100 text-xs mt-2">All operational</p>
            </div>
            <Store className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Products</p>
              <h3 className="text-3xl font-bold mt-2">{stats.totalProducts}</h3>
              <p className="text-orange-100 text-xs mt-2">Across all stores</p>
            </div>
            <Package className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Order ID</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Phone</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Location</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Payment</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Store</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Store Phone</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Total</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-xs font-semibold">#{order.id}</td>
                  <td className="py-3 px-4 text-xs">{order.customer}</td>
                  <td className="py-3 px-4 text-xs text-blue-600 font-medium">{order.phone}</td>
                  <td className="py-3 px-4 text-xs text-gray-600 max-w-xs truncate" title={order.location}>{order.location}</td>
                  <td className="py-3 px-4 text-xs">{order.paymentMethod}</td>
                  <td className="py-3 px-4 text-xs">{order.store}</td>
                  <td className="py-3 px-4 text-xs text-blue-600 font-medium">{order.storePhone}</td>
                  <td className="py-3 px-4 text-xs font-semibold">${order.total}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderStores = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Stores</h2>
        <button 
          onClick={() => setShowAddStore(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Store
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search stores..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Store Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Address</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Phone</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Rating</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Orders</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(store => (
                <tr key={store.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-semibold">{store.name}</td>
                  <td className="py-3 px-4 text-sm">{store.category}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate" title={store.address}>{store.address}</td>
                  <td className="py-3 px-4 text-sm text-blue-600 font-medium">{store.phone}</td>
                  <td className="py-3 px-4 text-sm">⭐ {store.rating}</td>
                  <td className="py-3 px-4 text-sm">{store.orders}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      {store.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Store Modal */}
      {showAddStore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Store</h3>
              <button onClick={() => setShowAddStore(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Store Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" placeholder="Category" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" placeholder="Distance" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
                Add Store
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderProducts = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Products</h2>
        <button 
          onClick={() => setShowAddProduct(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Product Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Store</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Price</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Stock</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-semibold">{product.name}</td>
                  <td className="py-3 px-4 text-sm">{product.category}</td>
                  <td className="py-3 px-4 text-sm">{product.store}</td>
                  <td className="py-3 px-4 text-sm font-semibold">${product.price}</td>
                  <td className="py-3 px-4 text-sm">{product.stock}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                      product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Product</h3>
              <button onClick={() => setShowAddProduct(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Product Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" placeholder="Category" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select Store</option>
                {stores.map(store => (
                  <option key={store.id}>{store.name}</option>
                ))}
              </select>
              <input type="number" placeholder="Price" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="number" placeholder="Stock Quantity" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h2>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-3 font-semibold text-gray-600">Order ID</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-600">Customer</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-600">Phone</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-600">Location</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-600">Payment</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-600">Store</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-600">Store Address</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-600">Store Phone</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-600">Delivery Partner</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-600">Partner Phone</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-600">Vehicle</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-600">Items</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-600">Total</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-600">Date</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-600">Status</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3 font-semibold">#{order.id}</td>
                  <td className="py-3 px-3">{order.customer}</td>
                  <td className="py-3 px-3 text-blue-600 font-medium">{order.phone}</td>
                  <td className="py-3 px-3 text-gray-600 max-w-xs truncate" title={order.location}>{order.location}</td>
                  <td className="py-3 px-3">{order.paymentMethod}</td>
                  <td className="py-3 px-3">{order.store}</td>
                  <td className="py-3 px-3 text-gray-600 max-w-xs truncate" title={order.storeAddress}>{order.storeAddress}</td>
                  <td className="py-3 px-3 text-blue-600 font-medium">{order.storePhone}</td>
                  <td className="py-3 px-3">{order.deliveryPartner}</td>
                  <td className="py-3 px-3 text-blue-600 font-medium">{order.deliveryPhone}</td>
                  <td className="py-3 px-3">{order.deliveryVehicle}</td>
                  <td className="py-3 px-3">{order.items}</td>
                  <td className="py-3 px-3 font-semibold">${order.total}</td>
                  <td className="py-3 px-3">{order.date}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button 
                      onClick={() => { setSelectedOrder(order); setShowOrderDetails(true); }}
                      className="text-blue-600 hover:text-blue-700 text-xs font-semibold"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-purple-900 to-indigo-900 text-white p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-purple-200 text-sm">Voice AI Grocery</p>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('stores')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'stores' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Store className="w-5 h-5" />
            <span>Stores</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'products' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Products</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'orders' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Orders</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'users' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Users</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'settings' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'stores' && renderStores()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
            <p className="text-gray-600">User management features coming soon...</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {renderOrderDetailsModal()}
    </div>
  );
}