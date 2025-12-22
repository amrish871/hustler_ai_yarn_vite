import React, { useState } from 'react';
import { Search, Calendar, MapPin, Phone, Eye, Send, Download, Plus, AlertCircle, Clock, CheckCircle, XCircle, Star, User, TrendingUp, Zap, X } from 'lucide-react';
import { Input, Button } from '@myorg/ui';

const mockPartners = [
  { 
    id: 1, 
    name: 'John Smith', 
    rating: 4.8, 
    reviews: 142, 
    distance: 2.3, 
    availability: 'Available now', 
    phone: '+1-234-567-8901', 
    email: 'john@example.com', 
    completedJobs: 287,
    specialties: ['Plumbing', 'General Maintenance']
  },
  { 
    id: 2, 
    name: 'Sarah Wilson', 
    rating: 4.9, 
    reviews: 198, 
    distance: 1.8, 
    availability: 'Available now', 
    phone: '+1-234-567-8902', 
    email: 'sarah@example.com', 
    completedJobs: 352,
    specialties: ['HVAC', 'Electrical']
  },
  { 
    id: 3, 
    name: 'Mike Johnson', 
    rating: 4.6, 
    reviews: 89, 
    distance: 3.5, 
    availability: 'Available in 30 min', 
    phone: '+1-234-567-8903', 
    email: 'mike@example.com', 
    completedJobs: 156,
    specialties: ['Carpentry', 'Painting']
  },
  { 
    id: 4, 
    name: 'Emma Davis', 
    rating: 4.7, 
    reviews: 124, 
    distance: 4.2, 
    availability: 'Available in 1 hour', 
    phone: '+1-234-567-8904', 
    email: 'emma@example.com', 
    completedJobs: 218,
    specialties: ['Electrical', 'General Maintenance']
  },
  { 
    id: 5, 
    name: 'Tom Brown', 
    rating: 4.5, 
    reviews: 76, 
    distance: 2.9, 
    availability: 'Available now', 
    phone: '+1-234-567-8905', 
    email: 'tom@example.com', 
    completedJobs: 143,
    specialties: ['Plumbing', 'HVAC']
  },
  { 
    id: 6, 
    name: 'Lisa Anderson', 
    rating: 4.8, 
    reviews: 165, 
    distance: 5.1, 
    availability: 'Available in 2 hours', 
    phone: '+1-234-567-8906', 
    email: 'lisa@example.com', 
    completedJobs: 298,
    specialties: ['Painting', 'Carpentry']
  },
];

const mockBookings = [
  {
    id: 'BK-2024-001',
    customer: 'Robert Anderson',
    phone: '+1-234-567-8901',
    service: 'Plumbing - Leak Repair',
    date: '2025-10-18',
    time: '2:00 PM',
    location: '123 Oak Street, Springfield, IL',
    status: 'pending',
    assignedPartner: null,
    amount: '$150',
  },
  {
    id: 'BK-2024-002',
    customer: 'Sarah Miller',
    phone: '+1-234-567-8902',
    service: 'Electrical - Switch Installation',
    date: '2025-10-18',
    time: '3:30 PM',
    location: '456 Maple Ave, Springfield, IL',
    status: 'assigned',
    assignedPartner: 'John Smith',
    amount: '$120',
  },
  {
    id: 'BK-2024-003',
    customer: 'Michael Brown',
    phone: '+1-234-567-8903',
    service: 'HVAC - System Check',
    date: '2025-10-19',
    time: '10:00 AM',
    location: '789 Pine Road, Springfield, IL',
    status: 'completed',
    assignedPartner: 'Sarah Wilson',
    amount: '$200',
  },
  {
    id: 'BK-2024-004',
    customer: 'Jessica Davis',
    phone: '+1-234-567-8904',
    service: 'Plumbing - Toilet Repair',
    date: '2025-10-19',
    time: '1:00 PM',
    location: '321 Elm Street, Springfield, IL',
    status: 'awaiting_acceptance',
    assignedPartner: 'Tom Brown',
    amount: '$85',
  },
  {
    id: 'BK-2024-005',
    customer: 'David Wilson',
    phone: '+1-234-567-8905',
    service: 'Carpentry - Door Repair',
    date: '2025-10-20',
    time: '9:00 AM',
    location: '654 Oak Lane, Springfield, IL',
    status: 'assigned',
    assignedPartner: 'Mike Johnson',
    amount: '$180',
  },
  {
    id: 'BK-2024-006',
    customer: 'Emily Garcia',
    phone: '+1-234-567-8906',
    service: 'Plumbing - Drain Cleaning',
    date: '2025-10-20',
    time: '2:00 PM',
    location: '987 Birch Blvd, Springfield, IL',
    status: 'cancelled',
    assignedPartner: null,
    amount: '$95',
  },
  {
    id: 'BK-2024-007',
    customer: 'James Martinez',
    phone: '+1-234-567-8907',
    service: 'Electrical - Rewiring',
    date: '2025-10-21',
    time: '8:00 AM',
    location: '222 Cedar Street, Springfield, IL',
    status: 'awaiting_acceptance',
    assignedPartner: 'Emma Davis',
    amount: '$350',
  },
  {
    id: 'BK-2024-008',
    customer: 'Linda Thompson',
    phone: '+1-234-567-8908',
    service: 'General Maintenance',
    date: '2025-10-21',
    time: '4:00 PM',
    location: '555 Spruce Ave, Springfield, IL',
    status: 'pending',
    assignedPartner: null,
    amount: '$110',
  },
  {
    id: 'BK-2024-009',
    customer: 'Chris Evans',
    phone: '+1-234-567-8909',
    service: 'Painting - Interior',
    date: '2025-10-22',
    time: '10:00 AM',
    location: '888 Willow Dr, Springfield, IL',
    status: 'completed',
    assignedPartner: 'John Smith',
    amount: '$275',
  },
  {
    id: 'BK-2024-010',
    customer: 'Anna White',
    phone: '+1-234-567-8910',
    service: 'Plumbing - Faucet Replacement',
    date: '2025-10-22',
    time: '3:00 PM',
    location: '111 Cherry Lane, Springfield, IL',
    status: 'assigned',
    assignedPartner: 'Sarah Wilson',
    amount: '$95',
  },
];

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [bookingToAssign, setBookingToAssign] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [assignSuccess, setAssignSuccess] = useState(false);

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
        return <AlertCircle size={16} className="text-yellow-600" />;
      case 'awaiting_acceptance':
        return <Clock size={16} className="text-orange-600" />;
      case 'assigned':
        return <Clock size={16} className="text-blue-600" />;
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      awaiting_acceptance: 'bg-orange-100 text-orange-800 border-orange-200',
      assigned: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return styles[status] || '';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      awaiting_acceptance: 'Awaiting Acceptance',
      assigned: 'Assigned',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  };

  const stats = {
    total: mockBookings.length,
    pending: mockBookings.filter(b => b.status === 'pending').length,
    awaiting_acceptance: mockBookings.filter(b => b.status === 'awaiting_acceptance').length,
    assigned: mockBookings.filter(b => b.status === 'assigned').length,
    completed: mockBookings.filter(b => b.status === 'completed').length,
  };

  const filterButtons = [
    { id: 'all', label: 'All', count: stats.total, color: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300' },
    { id: 'pending', label: 'Pending', count: stats.pending, color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-300' },
    { id: 'awaiting_acceptance', label: 'Awaiting', count: stats.awaiting_acceptance, color: 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-300' },
    { id: 'assigned', label: 'Assigned', count: stats.assigned, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-300' },
    { id: 'completed', label: 'Completed', count: stats.completed, color: 'bg-green-50 text-green-700 hover:bg-green-100 border-green-300' },
  ];

  const handleOpenAssignModal = (booking) => {
    setBookingToAssign(booking);
    setShowAssignModal(true);
    setSelectedPartner(null);
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setBookingToAssign(null);
    setSelectedPartner(null);
    setAssignSuccess(false);
  };

  const handleAssignPartner = () => {
    if (selectedPartner) {
      setAssignSuccess(true);
      setTimeout(() => {
        handleCloseAssignModal();
      }, 2000);
    }
  };

  const getAvailabilityColor = (availability) => {
    if (availability.includes('now')) return 'text-green-600 bg-green-50';
    if (availability.includes('30 min') || availability.includes('1 hour')) return 'text-blue-600 bg-blue-50';
    return 'text-orange-600 bg-orange-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bookings Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage and track all service bookings</p>
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold shadow-sm">
              <Plus size={20} /> New Booking
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 font-medium">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800 font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800 font-medium">Awaiting</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">{stats.awaiting_acceptance}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">Assigned</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{stats.assigned}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 w-full lg:max-w-md relative">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by ID, customer, service, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {filterButtons.map(filter => (
                <Button
                  key={filter.id}
                  onClick={() => setStatusFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg font-semibold border-2 transition-all ${
                    statusFilter === filter.id
                      ? filter.color.replace('hover:', '').replace('bg-', 'bg-') + ' ring-2 ring-offset-1 ring-blue-400'
                      : filter.color
                  }`}
                  type="button"
                >
                  {filter.label}
                  <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-50 rounded-full text-xs font-bold">
                    {filter.count}
                  </span>
                </Button>
              ))}
              <Button className="p-2.5 hover:bg-gray-100 rounded-lg border-2 border-gray-300 transition-colors" type="button">
                <Download size={18} className="text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-medium">No bookings found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Partner
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.map((booking, idx) => (
                    <tr 
                      key={booking.id} 
                      className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-sm text-blue-600">{booking.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{booking.customer}</p>
                          <a 
                            href={`tel:${booking.phone}`} 
                            className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 mt-1 transition-colors"
                          >
                            <Phone size={12} /> {booking.phone}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900 font-medium">{booking.service}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin size={12} /> {booking.location}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">
                          <p className="font-semibold flex items-center gap-2">
                            <Calendar size={14} className="text-gray-500" /> {booking.date}
                          </p>
                          <p className="text-sm text-gray-600 ml-5">{booking.time}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {booking.assignedPartner ? (
                          <p className="text-gray-900 font-medium">{booking.assignedPartner}</p>
                        ) : (
                          <span className="text-gray-400 italic text-sm">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusBadge(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {getStatusLabel(booking.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 text-lg">{booking.amount}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
                            title="View details"
                          >
                            <Eye size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
                          </button>
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleOpenAssignModal(booking)}
                              className="p-2 hover:bg-green-100 rounded-lg transition-colors group"
                              title="Assign to partner"
                            >
                              <Send size={18} className="text-green-600 group-hover:scale-110 transition-transform" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Showing results text */}
        {filteredBookings.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredBookings.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{mockBookings.length}</span> bookings
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8 shadow-2xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                <p className="text-gray-600 text-sm mt-1">{selectedBooking.id}</p>
              </div>
              <button 
                onClick={() => setSelectedBooking(null)} 
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex justify-center">
                <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold border-2 ${getStatusBadge(selectedBooking.status)}`}>
                  {getStatusIcon(selectedBooking.status)}
                  {getStatusLabel(selectedBooking.status)}
                </span>
              </div>

              {/* Booking Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Service</p>
                  <p className="font-bold text-gray-900 mt-1">{selectedBooking.service}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Amount</p>
                  <p className="font-bold text-gray-900 mt-1 text-xl">{selectedBooking.amount}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-900 font-semibold">{selectedBooking.customer}</p>
                  <a href={`tel:${selectedBooking.phone}`} className="text-blue-600 hover:underline flex items-center gap-2 font-medium">
                    <Phone size={16} /> {selectedBooking.phone}
                  </a>
                </div>
              </div>

              {/* Service Details */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Location</p>
                    <p className="text-gray-900">{selectedBooking.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={20} className="text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Scheduled Date & Time</p>
                    <p className="text-gray-900 font-semibold">{selectedBooking.date} at {selectedBooking.time}</p>
                  </div>
                </div>
              </div>

              {/* Partner Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">Assigned Partner</h3>
                {selectedBooking.assignedPartner ? (
                  <p className="text-gray-900 font-semibold">{selectedBooking.assignedPartner}</p>
                ) : (
                  <p className="text-gray-500 italic">No partner assigned yet</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                {selectedBooking.status === 'pending' && (
                  <button 
                    onClick={() => {
                      handleOpenAssignModal(selectedBooking);
                      setSelectedBooking(null);
                    }}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-bold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send size={18} /> Assign Partner
                  </button>
                )}
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Partner Modal */}
      {showAssignModal && bookingToAssign && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-start z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Assign Partner</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Booking: <span className="font-mono font-semibold text-blue-600">{bookingToAssign.id}</span> - {bookingToAssign.service}
                </p>
              </div>
              <button 
                onClick={handleCloseAssignModal}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Success Message */}
            {assignSuccess && (
              <div className="mx-6 mt-4 bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle size={24} className="text-green-600" />
                <div>
                  <p className="font-bold text-green-900">Partner Assigned Successfully!</p>
                  <p className="text-sm text-green-700">The partner will receive a notification shortly.</p>
                </div>
              </div>
            )}

            {/* Booking Details Summary */}
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Customer</p>
                  <p className="font-semibold text-gray-900">{bookingToAssign.customer}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date & Time</p>
                  <p className="font-semibold text-gray-900">{bookingToAssign.date}</p>
                  <p className="text-xs text-gray-600">{bookingToAssign.time}</p>
                </div>
                <div>
                  <p className="text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900 text-xs">{bookingToAssign.location}</p>
                </div>
                <div>
                  <p className="text-gray-600">Amount</p>
                  <p className="font-semibold text-gray-900 text-xl">{bookingToAssign.amount}</p>
                </div>
              </div>
            </div>

            {/* Partners List */}
            <div className="px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Available Partners</h3>
              <div className="space-y-3">
                {mockPartners.map((partner) => {
                  const isAvailableNow = partner.availability.includes('now');
                  const isSelected = selectedPartner?.id === partner.id;
                  
                  return (
                    <div
                      key={partner.id}
                      onClick={() => !assignSuccess && setSelectedPartner(partner)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        assignSuccess 
                          ? 'opacity-50 cursor-not-allowed' 
                          : isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {partner.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">{partner.name}</h4>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="flex items-center gap-1 text-yellow-600">
                                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                  <strong>{partner.rating}</strong> ({partner.reviews} reviews)
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                            <div className="bg-gray-50 p-2 rounded">
                              <p className="text-xs text-gray-600">Distance</p>
                              <p className="font-semibold text-gray-900 flex items-center gap-1">
                                <MapPin size={12} /> {partner.distance} km
                              </p>
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                              <p className="text-xs text-gray-600">Completed Jobs</p>
                              <p className="font-semibold text-gray-900 flex items-center gap-1">
                                <TrendingUp size={12} /> {partner.completedJobs}
                              </p>
                            </div>
                            <div className={`p-2 rounded ${getAvailabilityColor(partner.availability)}`}>
                              <p className="text-xs opacity-75">Availability</p>
                              <p className="font-semibold flex items-center gap-1">
                                <Clock size={12} /> {partner.availability}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                              <p className="text-xs text-gray-600">Contact</p>
                              <div className="flex gap-2 mt-1">
                                <a 
                                  href={`tel:${partner.phone}`} 
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <Phone size={14} />
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="mt-2">
                            <p className="text-xs text-gray-600">Specialties:</p>
                            <div className="flex gap-2 mt-1">
                              {partner.specialties.map((specialty, idx) => (
                                <span 
                                  key={idx}
                                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="ml-4">
                            <CheckCircle size={28} className="text-blue-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={handleAssignPartner}
                disabled={!selectedPartner || assignSuccess}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                {assignSuccess ? (
                  <>
                    <CheckCircle size={20} /> Assigned Successfully!
                  </>
                ) : (
                  <>
                    <Send size={20} /> Assign {selectedPartner ? `to ${selectedPartner.name}` : 'Partner'}
                  </>
                )}
              </button>
              <button
                onClick={handleCloseAssignModal}
                disabled={assignSuccess}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
              >
                {assignSuccess ? 'Closing...' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;