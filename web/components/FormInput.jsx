import React from "react";

const FormInput = ({ 
  type = "text",
  name,
  label,
  placeholder,
  register,
  error,
  disabled = false
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label 
          htmlFor={name}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2 rounded-lg border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'} focus:border-transparent focus:outline-none focus:ring-2`}
        {...register}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default FormInput;