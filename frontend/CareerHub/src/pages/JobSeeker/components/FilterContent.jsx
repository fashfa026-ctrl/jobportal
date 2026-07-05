import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { CATEGORIES, JOB_TYPES } from "../../utils/data";
import SalaryRangeSlider from "../../../components/Input/SalaryRangeSlider";

// 1. Internal helper component for collapsible accordion rows
const FilterSection = ({ title, children, isExpanded, onToggle }) => {
  return (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-800 hover:text-blue-600 transition-colors py-1"
      >
        <span>{title}</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {isExpanded && <div className="mt-3 animate-fadeIn">{children}</div>}
    </div>
  );
};

// 2. Main Filter Content Component
const FilterContent = ({
  toggleSection,
  clearAllFilters,
  expandedSections,
  filters,
  handleFilterChange,
}) => {
  return (
    <>
      {/* Clear All Button Wrapper */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={clearAllFilters}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Clear All
        </button>
      </div>

      {/* Job Type Section */}
      <FilterSection
        title="Job Type"
        isExpanded={expandedSections?.jobType}
        onToggle={() => toggleSection("jobType")}
      >
        <div className="space-y-3">
          {JOB_TYPES.map((type) => (
            <label key={type.value} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                checked={filters?.type === type.value}
                onChange={(e) =>
                  handleFilterChange("type", e.target.checked ? type.value : "")
                }
              />
              <span className="ml-3 text-gray-700 font-medium">{type.label || type.value}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Salary Range Section */}
      <FilterSection
        title="Salary Range"
        isExpanded={expandedSections?.salary}
        onToggle={() => toggleSection("salary")}
      >
        <SalaryRangeSlider filters={filters} handleFilterChange={handleFilterChange} />
      </FilterSection>

      {/* Category Section */}
      <FilterSection
        title="Category"
        isExpanded={expandedSections?.categories}
        onToggle={() => toggleSection("categories")}
      >
        <div className="space-y-3">
          {CATEGORIES.map((type) => (
            <label key={type.value} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                checked={filters?.category === type.value}
                onChange={(e) => {
                  handleFilterChange("category", e.target.checked ? type.value : "");
                }}
              />
              <span className="ml-3 text-gray-700 font-medium">{type.label || type.value}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </>
  );
};

export default FilterContent;