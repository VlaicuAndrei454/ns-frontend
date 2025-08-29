import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({
  label,
  name, // Added name to props
  value,
  onChange,
  placeholder,
  type = "text", // Default type to text
  required,    // Added required
  step,        // Added step
  // You can add these if you need more styling flexibility later
  // containerClassName = '',
  // inputElementClassName = ''
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const inputId = name || label?.replace(/\s+/g, '-').toLowerCase() || `input-${Math.random().toString(36).substring(7)}`;

  return (
    <div className="mb-4"> {/* Added a default bottom margin, adjust as needed */}
      {label && (
        <label htmlFor={inputId} className="block text-[13px] text-slate-800 mb-1"> {/* Added htmlFor and mb-1 */}
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="input-box"> {/* This class likely provides specific styling for the input container */}
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          id={inputId}
          name={name} // Crucial: Added name attribute
          placeholder={placeholder}
          className="w-full bg-transparent outline-none" // Existing classes
          value={value}
          onChange={onChange} // Simplified: directly pass the onChange handler
          required={required} // Added required attribute
          step={step}         // Added step attribute
        />

        {type === "password" && (
          <>
            {showPassword ? (
              <FaRegEye
                size={22}
                className="text-primary cursor-pointer"
                onClick={toggleShowPassword} // Simplified
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className="text-slate-400 cursor-pointer"
                onClick={toggleShowPassword} // Simplified
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Input;