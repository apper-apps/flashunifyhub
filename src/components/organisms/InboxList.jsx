import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import unifiedItemService from '@/services/api/unifiedItemService';
import serviceService from '@/services/api/serviceService';
import ItemCard from '@/components/molecules/ItemCard';
import SearchBar from '@/components/molecules/SearchBar';
import ServiceBadge from '@/components/molecules/ServiceBadge';
import ApperIcon from '@/components/ApperIcon';

const InboxList = ({ onLinkToProject }) => {
  const [items, setItems] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [itemsData, servicesData] = await Promise.all([
        unifiedItemService.getAll(),
        serviceService.getAll()
      ]);
      setItems(itemsData);
      setServices(servicesData);
    } catch (err) {
      setError(err.message || 'Failed to load inbox data');
      toast.error('Failed to load inbox data');
    } finally {
      setLoading(false);
    }
  };

  const getServiceById = (serviceId) => {
    return services.find(s => s.Id.toString() === serviceId.toString());
  };

  const filteredItems = items.filter(item => {
    const matchesService = selectedService === 'all' || item.serviceId === selectedService;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesService && matchesType && matchesSearch;
  });

  const serviceFilter = [
    { value: 'all', label: 'All Services' },
    ...services.map(service => ({
      value: service.Id.toString(),
      label: service.name
    }))
  ];

  const typeFilter = [
    { value: 'all', label: 'All Types' },
    { value: 'email', label: 'Emails' },
    { value: 'message', label: 'Messages' },
    { value: 'calendar', label: 'Calendar' }
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface rounded-lg p-4 shadow-sm"
          >
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface rounded-lg p-8 text-center">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load inbox</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-surface rounded-lg p-8 text-center">
        <ApperIcon name="Inbox" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No items in inbox</h3>
        <p className="text-gray-600">
          Your unified inbox will show messages, emails, and notifications from all connected services.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-surface rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search items..."
              onSearch={setSearchQuery}
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {serviceFilter.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {typeFilter.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="bg-surface rounded-lg p-8 text-center">
          <ApperIcon name="Search" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ItemCard
                item={item}
                service={getServiceById(item.serviceId)}
                onLinkToProject={onLinkToProject}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InboxList;