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
  const [expandedServices, setExpandedServices] = useState({});
  const [configuringServices, setConfiguringServices] = useState({});
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

  const toggleServiceExpansion = (serviceId) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const handleConfigUpdate = async (serviceId, config) => {
    setConfiguringServices(prev => ({ ...prev, [serviceId]: true }));
    try {
      const updatedService = await serviceService.updateConfig(serviceId, config);
      setServices(prev => prev.map(s => 
        s.Id === serviceId ? updatedService : s
      ));
      toast.success('Configuration updated successfully');
    } catch (err) {
      toast.error('Failed to update configuration');
    } finally {
      setConfiguringServices(prev => ({ ...prev, [serviceId]: false }));
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle2';
      case 'disconnected': return 'XCircle';
      case 'syncing': return 'Clock';
      default: return 'HelpCircle';
    }
  };

  const renderServiceConfiguration = (service) => {
    const config = service.config || {};
    
    if (service.type === 'email') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Sync Frequency</label>
            <select 
              value={config.syncFrequency || '15'} 
              onChange={(e) => handleConfigUpdate(service.Id, { syncFrequency: e.target.value })}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="5">Every 5 minutes</option>
              <option value="15">Every 15 minutes</option>
              <option value="30">Every 30 minutes</option>
              <option value="60">Every hour</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Include Attachments</label>
            <input 
              type="checkbox" 
              checked={config.includeAttachments || false}
              onChange={(e) => handleConfigUpdate(service.Id, { includeAttachments: e.target.checked })}
              className="rounded border-gray-300"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Folder Filter</label>
            <input 
              type="text" 
              value={config.folderFilter || ''} 
              onChange={(e) => handleConfigUpdate(service.Id, { folderFilter: e.target.value })}
              placeholder="e.g., INBOX, Sent"
              className="px-3 py-1 border border-gray-300 rounded text-sm w-32"
            />
          </div>
        </div>
      );
    }
    
    if (service.type === 'messaging') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Channel Filter</label>
            <input 
              type="text" 
              value={config.channelFilter || ''} 
              onChange={(e) => handleConfigUpdate(service.Id, { channelFilter: e.target.value })}
              placeholder="e.g., #general, #team"
              className="px-3 py-1 border border-gray-300 rounded text-sm w-32"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Direct Messages</label>
            <input 
              type="checkbox" 
              checked={config.includeDMs || true}
              onChange={(e) => handleConfigUpdate(service.Id, { includeDMs: e.target.checked })}
              className="rounded border-gray-300"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Notification Keywords</label>
            <input 
              type="text" 
              value={config.keywords || ''} 
              onChange={(e) => handleConfigUpdate(service.Id, { keywords: e.target.value })}
              placeholder="urgent, meeting"
              className="px-3 py-1 border border-gray-300 rounded text-sm w-32"
            />
          </div>
        </div>
      );
    }
    
    if (service.type === 'calendar') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Sync Range</label>
            <select 
              value={config.syncRange || '30'} 
              onChange={(e) => handleConfigUpdate(service.Id, { syncRange: e.target.value })}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="7">Next 7 days</option>
              <option value="30">Next 30 days</option>
              <option value="90">Next 90 days</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Include All Day Events</label>
            <input 
              type="checkbox" 
              checked={config.includeAllDay || true}
              onChange={(e) => handleConfigUpdate(service.Id, { includeAllDay: e.target.checked })}
              className="rounded border-gray-300"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Calendar Filter</label>
            <input 
              type="text" 
              value={config.calendarFilter || ''} 
              onChange={(e) => handleConfigUpdate(service.Id, { calendarFilter: e.target.value })}
              placeholder="Work, Personal"
              className="px-3 py-1 border border-gray-300 rounded text-sm w-32"
            />
          </div>
        </div>
      );
    }
    
    return (
      <div className="text-sm text-gray-500">
        No specific configuration options available for this service type.
      </div>
    );
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
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <ServiceBadge service={service} size="md" />
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center gap-1">
                          <ApperIcon 
                            name={getStatusIcon(service.status)} 
                            className={`w-4 h-4 ${
                              service.status === 'connected' ? 'text-success' :
                              service.status === 'disconnected' ? 'text-error' :
                              service.status === 'syncing' ? 'text-warning' :
                              'text-gray-400'
                            }`}
                          />
                          <Badge variant={getStatusVariant(service.status)}>
                            {service.status}
                          </Badge>
                        </div>
                        {service.status === 'connected' && service.lastSync && (
                          <span className="text-xs text-gray-500">
                            Last sync {formatDistanceToNow(new Date(service.lastSync), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {service.status === 'connected' ? 'Service is running normally' :
                         service.status === 'syncing' ? 'Synchronizing data...' :
                         'Service disconnected'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {service.status === 'connected' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleServiceExpansion(service.Id)}
                        >
                          <ApperIcon 
                            name={expandedServices[service.Id] ? "ChevronUp" : "Settings"} 
                            className="w-4 h-4 mr-2" 
                          />
                          {expandedServices[service.Id] ? 'Hide' : 'Configure'}
                        </Button>
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
                      </>
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

                {/* Configuration Panel */}
                {expandedServices[service.Id] && service.status === 'connected' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200 bg-gray-50"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <ApperIcon name="Settings" className="w-4 h-4 text-gray-600" />
                        <h4 className="font-medium text-gray-900">Service Configuration</h4>
                        {configuringServices[service.Id] && (
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </div>
                      {renderServiceConfiguration(service)}
                    </div>
                  </motion.div>
                )}
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