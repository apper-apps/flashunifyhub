import { useState } from 'react';
import { motion } from 'framer-motion';
import InboxList from '@/components/organisms/InboxList';
import ApperIcon from '@/components/ApperIcon';

const Inbox = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleLinkToProject = (item) => {
    // This would open a modal to select/create project
    console.log('Link item to project:', item);
  };

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
              <ApperIcon name="Inbox" className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Unified Inbox</h1>
          </div>
          <p className="text-gray-600">
            All your messages, emails, and notifications from connected services in one place.
          </p>
        </div>

        {/* Main Content */}
        <InboxList onLinkToProject={handleLinkToProject} />
      </div>
    </motion.div>
  );
};

export default Inbox;