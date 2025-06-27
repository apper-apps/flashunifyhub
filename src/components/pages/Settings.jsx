import { motion } from 'framer-motion';
import ServiceConnectionManager from '@/components/organisms/ServiceConnectionManager';
import ApperIcon from '@/components/ApperIcon';

const Settings = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Settings" className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-gray-600">
            Manage your service connections, preferences, and account settings.
          </p>
        </div>

        {/* Service Connections */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Connections</h2>
          <ServiceConnectionManager />
        </div>

        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Real-time Notifications</h4>
                <p className="text-sm text-gray-600">Get instant notifications for new items</p>
              </div>
              <button className="w-11 h-6 bg-primary rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Auto-sync</h4>
                <p className="text-sm text-gray-600">Automatically sync services every 15 minutes</p>
              </div>
              <button className="w-11 h-6 bg-primary rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Smart Grouping</h4>
                <p className="text-sm text-gray-600">Automatically group related items</p>
              </div>
              <button className="w-11 h-6 bg-gray-200 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Data & Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface rounded-lg border border-gray-200 p-6 mt-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data & Privacy</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <ApperIcon name="Database" className="w-5 h-5 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Export Data</h4>
                  <p className="text-sm text-gray-600">Download all your data</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Export
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <ApperIcon name="Trash2" className="w-5 h-5 text-error" />
                <div>
                  <h4 className="font-medium text-gray-900">Delete Account</h4>
                  <p className="text-sm text-gray-600">Permanently delete your account and data</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm bg-error text-white hover:bg-error/90 rounded-lg transition-colors">
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Settings;