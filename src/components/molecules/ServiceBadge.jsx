import ApperIcon from '@/components/ApperIcon';

const ServiceBadge = ({ service, size = 'sm', showName = true }) => {
  const sizes = {
    xs: 'w-4 h-4 text-xs',
    sm: 'w-5 h-5 text-xs',
    md: 'w-6 h-6 text-sm'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm'
  };

  if (!service) return null;

  return (
    <div className="flex items-center gap-2">
      <div 
        className={`${sizes[size]} rounded-full flex items-center justify-center text-white`}
        style={{ backgroundColor: service.color }}
      >
        <ApperIcon name={service.icon} className="w-3/4 h-3/4" />
      </div>
      {showName && (
        <span className={`font-medium text-gray-700 ${textSizes[size]}`}>
          {service.name}
        </span>
      )}
    </div>
  );
};

export default ServiceBadge;