import { forwardRef } from 'react';

const TextArea = forwardRef(({ 
  label,
  error,
  rows = 3,
  className = '',
  ...props 
}, ref) => {
  const textareaStyles = `
    w-full px-3 py-2 border rounded-lg text-sm resize-none
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
      <textarea
        ref={ref}
        rows={rows}
        className={textareaStyles}
        {...props}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;