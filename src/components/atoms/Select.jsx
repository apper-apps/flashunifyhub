import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Select = forwardRef(({ 
  label,
  error,
  options = [],
  placeholder = 'Select an option',
  className = '',
  ...props 
}, ref) => {
  const selectStyles = `
    w-full px-3 py-2 pr-10 border rounded-lg text-sm bg-white appearance-none
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    disabled:bg-gray-50 disabled:cursor-not-allowed
    ${error ? 'border-error focus:border-error focus:ring-error/50' : 'border-gray-300'}
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={selectStyles}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;