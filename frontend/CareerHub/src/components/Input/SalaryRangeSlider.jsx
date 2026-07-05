import { useState } from "react";

const SalaryRangeSlider = ({ filters, handleFilterChange }) => {
  const [minSalary, setMinSalary] = useState(filters?.minSalary || 0);
  const [maxSalary, setMaxSalary] = useState(filters?.maxSalary || 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Min Salary Input Column */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Salary
          </label>
          <input
            type="number"
            placeholder="0"
            min="0"
            step="1000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={minSalary || ""}
            onChange={({ target }) => setMinSalary(target.value)}
            onBlur={() => {
              handleFilterChange(
                "minSalary",
                minSalary ? parseInt(minSalary) : ""
              );
            }}
          />
        </div>

        <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Max Salary
  </label>
  <input
    type="number"
    placeholder="No limit"
    min="0"
    step="1000"
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    value={maxSalary || ""}
    onChange={({ target }) => setMaxSalary(target.value)}
    onBlur={() => {
      handleFilterChange(
        "maxSalary",
        maxSalary ? parseInt(maxSalary) : ""
      )
    }}
  />
</div>
{/* Display current range */}
      {(minSalary || maxSalary) ? (
        <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
          Range: {minSalary ? `Rs. ${Number(minSalary).toLocaleString()}` : "Rs. 0"} —{" "}
          {maxSalary ? `Rs. ${Number(maxSalary).toLocaleString()}` : "No limit"}
        </div>
      ) : null}
    </div>
 
</div>
       
  )
}

export default SalaryRangeSlider