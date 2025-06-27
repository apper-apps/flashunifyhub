import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const ProjectCard = ({ 
  project, 
  itemCount = 0,
  onClick,
  onEdit,
  onDelete,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`
        bg-surface rounded-lg border border-gray-200 p-4 cursor-pointer transition-all
        hover:shadow-md hover:border-gray-300
        ${className}
      `}
      onClick={() => onClick?.(project)}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <h3 className="font-semibold text-gray-900 truncate">{project.name}</h3>
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(project);
            }}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            title="Edit project"
          >
            <ApperIcon name="Edit2" className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(project);
            }}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            title="Delete project"
          >
            <ApperIcon name="Trash2" className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
        {project.description}
      </p>
      
      <div className="flex items-center justify-between">
        <Badge variant="default" size="sm">
          {itemCount} linked items
        </Badge>
        <span className="text-xs text-gray-500">
          Created {formatDistanceToNow(new Date(project.created), { addSuffix: true })}
        </span>
      </div>
    </motion.div>
  );
};

export default ProjectCard;