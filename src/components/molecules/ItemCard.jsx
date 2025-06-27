import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import ServiceBadge from './ServiceBadge';
import Badge from '@/components/atoms/Badge';

const ItemCard = ({ 
  item, 
  service, 
  onSelect, 
  onLinkToProject,
  selected = false,
  className = '' 
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'email': return 'Mail';
      case 'message': return 'MessageSquare';
      case 'calendar': return 'Calendar';
      default: return 'FileText';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={`
        bg-surface rounded-lg border border-gray-200 p-4 cursor-pointer transition-all
        hover:shadow-md hover:border-gray-300
        ${selected ? 'ring-2 ring-primary border-primary' : ''}
        ${className}
      `}
      onClick={() => onSelect?.(item)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <ApperIcon name={getTypeIcon(item.type)} className="w-4 h-4 text-gray-600" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              {item.metadata?.priority && (
                <Badge 
                  variant={getPriorityColor(item.metadata.priority)}
                  size="sm"
                >
                  {item.metadata.priority}
                </Badge>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLinkToProject?.(item);
                }}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                title="Link to project"
              >
                <ApperIcon name="Link" className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {item.content}
          </p>
          
          <div className="flex items-center justify-between">
            <ServiceBadge service={service} size="xs" showName={false} />
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
            </span>
          </div>
          
          {item.metadata?.hasAttachments && (
            <div className="flex items-center gap-1 mt-2">
              <ApperIcon name="Paperclip" className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">Has attachments</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;