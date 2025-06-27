import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import serviceService from '@/services/api/serviceService';
import ServiceBadge from '@/components/molecules/ServiceBadge';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const ServiceConnectionManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState({});

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const servicesData = await serviceService.getAll();
      setServices(servicesData);
    } catch (err) {
      setError(err.message || 'Failed to load services');
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (service) => {
    setSyncing(prev => ({ ...prev, [service.Id]: true }));
    try {
      const updatedService = await serviceService.sync(service.Id);
      setServices(prev => prev.map(s => 
        s.Id === service.Id ? updatedService : s
      ));
      toast.success(`${service.name} synced successfully`);
    } catch (err) {
      toast.error(`Failed to sync ${service.name}`);
    } finally {
      setSyncing(prev => ({ ...prev, [service.Id]: false }));
    }
  };

  const handleDisconnect = async (service) => {
    if (!confirm(`Are you sure you want to disconnect ${service.name}?`)) {
      return;
    }

    try {
      await serviceService.update(service.Id, { status: 'disconnected' });
      setServices(prev => prev.map(s => 
        s.Id === service.Id ? { ...s, status: 'disconnected' } : s
      ));
      toast.success(`${service.name} disconnected`);
    } catch (err) {
      toast.error(`Failed to disconnect ${service.name}`);
    }
  };

  const handleConnect = async (service) => {
    try {
      await serviceService.update(service.Id, { 
        status: 'connected',
        lastSync: new Date().toISOString()
      });
      setServices(prev => prev.map(s => 
        s.Id === service.Id ? { ...s, status: 'connected', lastSync: new Date().toISOString() } : s
      ));
      toast.success(`${service.name} connected successfully`);
    } catch (err) {
      toast.error(`Failed to connect ${service.name}`);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'connected': return 'success';
      case 'disconnected': return 'error';
      case 'syncing': return 'warning';
      default: return 'default';
    }
  };

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.type]) {
      acc[service.type] = [];
    }
    acc[service.type].push(service);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-surface rounded-lg p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface rounded-lg p-8 text-center">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load services</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadServices}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedServices).map(([type, typeServices]) => (
        <motion.div
          key={type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
            {type} Services
          </h3>
          
          <div className="space-y-4">
            {typeServices.map((service) => (
              <div
                key={service.Id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <ServiceBadge service={service} size="md" />
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getStatusVariant(service.status)}>
                        {service.status}
                      </Badge>
                      {service.status === 'connected' && service.lastSync && (
                        <span className="text-xs text-gray-500">
                          Last sync {formatDistanceToNow(new Date(service.lastSync), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {service.status === 'connected' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSync(service)}
                      disabled={syncing[service.Id]}
                      loading={syncing[service.Id]}
                    >
                      <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
                      Sync
                    </Button>
                  )}
                  
                  {service.status === 'connected' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(service)}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleConnect(service)}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
      
      {/* Add New Service */}
      <div className="bg-surface rounded-lg border border-gray-200 border-dashed p-8 text-center">
        <ApperIcon name="Plus" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Add New Service</h3>
        <p className="text-gray-600 mb-4">
          Connect additional services to expand your unified workspace.
        </p>
        <Button variant="outline">
          Browse Integrations
        </Button>
      </div>
    </div>
  );
};

export default ServiceConnectionManager;