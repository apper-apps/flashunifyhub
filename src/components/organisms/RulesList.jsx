import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ruleService from '@/services/api/ruleService';
import RuleCard from '@/components/molecules/RuleCard';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const RulesList = ({ onCreateRule, onEditRule }) => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const rulesData = await ruleService.getAll();
      setRules(rulesData);
    } catch (err) {
      setError(err.message || 'Failed to load rules');
      toast.error('Failed to load rules');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRule = async (rule) => {
    try {
      const updatedRule = await ruleService.toggle(rule.Id);
      setRules(prev => prev.map(r => 
        r.Id === rule.Id ? updatedRule : r
      ));
      toast.success(`Rule ${updatedRule.enabled ? 'enabled' : 'disabled'}`);
    } catch (err) {
      toast.error('Failed to toggle rule');
    }
  };

  const handleDeleteRule = async (rule) => {
    if (!confirm(`Are you sure you want to delete "${rule.name}"?`)) {
      return;
    }

    try {
      await ruleService.delete(rule.Id);
      setRules(prev => prev.filter(r => r.Id !== rule.Id));
      toast.success('Rule deleted successfully');
    } catch (err) {
      toast.error('Failed to delete rule');
    }
  };

  const handleTestRule = async (rule) => {
    try {
      const result = await ruleService.test(rule.Id);
      if (result.success) {
        toast.success(`Rule test successful: ${result.matches} matches found`);
      } else {
        toast.error('Rule test failed');
      }
    } catch (err) {
      toast.error('Failed to test rule');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface rounded-lg p-4 shadow-sm"
          >
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load rules</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadRules}>
          Try again
        </Button>
      </div>
    );
  }

  if (rules.length === 0) {
    return (
      <div className="bg-surface rounded-lg p-8 text-center">
        <ApperIcon name="Settings2" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No automation rules</h3>
        <p className="text-gray-600 mb-6">
          Create rules to automatically take actions based on incoming items and events.
        </p>
        <Button onClick={onCreateRule}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>
    );
  }

  const activeRules = rules.filter(rule => rule.enabled).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {rules.length} Rules
          </h2>
          <p className="text-sm text-gray-600">
            {activeRules} active, {rules.length - activeRules} disabled
          </p>
        </div>
        <Button onClick={onCreateRule}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Rule
        </Button>
      </div>

      <div className="space-y-4">
        {rules.map((rule, index) => (
          <motion.div
            key={rule.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <RuleCard
              rule={rule}
              onToggle={handleToggleRule}
              onEdit={onEditRule}
              onDelete={handleDeleteRule}
              onTest={handleTestRule}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RulesList;