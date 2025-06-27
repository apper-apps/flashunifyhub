import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const RuleCard = ({ 
  rule, 
  onToggle, 
  onEdit, 
  onDelete, 
  onTest,
  className = '' 
}) => {
  const formatCondition = (condition) => {
    return `${condition.field} ${condition.operator} "${condition.value}"`;
  };

  const formatAction = (action) => {
    switch (action.type) {
      case 'create_task':
        return 'Create task';
      case 'send_notification':
        return 'Send notification';
      case 'block_calendar':
        return 'Block calendar time';
      default:
        return action.type;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-surface rounded-lg border border-gray-200 p-4 transition-all
        ${rule.enabled ? 'hover:shadow-md hover:border-gray-300' : 'opacity-75'}
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggle?.(rule)}
            className={`
              w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
              ${rule.enabled 
                ? 'bg-primary border-primary text-white' 
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
          >
            {rule.enabled && <ApperIcon name="Check" className="w-3 h-3" />}
          </button>
          <h3 className="font-semibold text-gray-900">{rule.name}</h3>
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onTest?.(rule)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            title="Test rule"
          >
            <ApperIcon name="Play" className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onEdit?.(rule)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            title="Edit rule"
          >
            <ApperIcon name="Edit2" className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => onDelete?.(rule)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            title="Delete rule"
          >
            <ApperIcon name="Trash2" className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2 mb-3">
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">When</span>
          <div className="mt-1 space-y-1">
            {rule.conditions.map((condition, index) => (
              <div key={index} className="text-sm text-gray-600 bg-gray-50 rounded px-2 py-1">
                {formatCondition(condition)}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Then</span>
          <div className="mt-1 space-y-1">
            {rule.actions.map((action, index) => (
              <div key={index} className="text-sm text-gray-600 bg-accent/10 rounded px-2 py-1">
                {formatAction(action)}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <Badge 
          variant={rule.enabled ? 'success' : 'default'} 
          size="sm"
        >
          {rule.enabled ? 'Active' : 'Disabled'}
        </Badge>
      </div>
    </motion.div>
  );
};

export default RuleCard;