import React, { useState } from 'react';
import PropTypes from 'prop-types';

const InputField = ({ 
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  id,
  name,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const baseClasses = 'w-full px-3 py-2 border rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';
  const stateClasses = disabled 
    ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
    : isFocused 
      ? 'border-blue-500 focus:ring-blue-500' :'border-[#565d6d] bg-[#f9fafb] hover:border-gray-400';
  
  const inputClasses = `${baseClasses} ${stateClasses} ${className}`;
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={inputClasses}
      id={id}
      name={name}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
};

InputField.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
};

export default InputField;