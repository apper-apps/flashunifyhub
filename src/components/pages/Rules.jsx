import { useState } from 'react';
import { motion } from 'framer-motion';
import RulesList from '@/components/organisms/RulesList';
import ApperIcon from '@/components/ApperIcon';

const Rules = () => {
  const handleCreateRule = () => {
    // This would open a modal to create a new automation rule
    console.log('Create new rule');
  };

  const handleEditRule = (rule) => {
    // This would open a modal to edit the rule
    console.log('Edit rule:', rule);
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
              <ApperIcon name="Settings2" className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Automation Rules</h1>
          </div>
          <p className="text-gray-600">
            Create intelligent rules to automatically take actions based on incoming items and events.
          </p>
        </div>

        {/* Main Content */}
        <RulesList 
          onCreateRule={handleCreateRule}
          onEditRule={handleEditRule}
        />
      </div>
    </motion.div>
  );
};

export default Rules;