import { AlertCircle, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const SelectField = ({
  label,
  id,
  value,
  onChange,
  options,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon: Icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className="space-y-2" ref={ref}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-full flex items-center ${
            Icon ? "pl-10" : "pl-3"
          } pr-10 py-2.5 border rounded-xl text-sm bg-white text-left transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none ${
            error
              ? "border-red-300"
              : isOpen
              ? "border-blue-500 ring-2 ring-blue-500 ring-opacity-20"
              : "border-gray-300"
          }`}
        >
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <span className={selected ? "text-gray-900 text-sm" : "text-gray-400 text-sm"}>
            {selected ? selected.label : placeholder}
          </span>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown
              className={`h-5 w-5 transition-all duration-200 ${
                isOpen ? "rotate-180 text-blue-500" : "text-gray-400"
              }`}
            />
          </div>
        </button>

        {isOpen && (
          <ul className="absolute z-50 w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
            <li
              onClick={() => handleSelect("")}
              className="px-4 py-2.5 text-gray-400 hover:bg-blue-500 hover:text-white cursor-pointer text-sm transition-colors duration-150"
            >
              {placeholder}
            </li>
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 ${
                  value === option.value
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-blue-500 hover:text-white"
                }`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-1 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default SelectField;