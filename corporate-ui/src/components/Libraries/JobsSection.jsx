import { Search } from "lucide-react";
import JobsTable from "./JobsTable";
import PropTypes from "prop-types";

const JobsSection = ({ 
  jobs, 
  onEdit, 
  onDelete, 
  onView, 
  onApplications,
  onStatusChange, 
  onCreateJob,
  onSearch,
  onFilter 
}) => {
  return (
    <div className="space-y-6 font-normal">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-end gap-4">
        <div className="inline-block rounded-[10px]  p-[1.5px]">
          <button
            className="text-sm w-full text-white bg-black px-4 pt-2 pb-2.5 rounded-[9px] hover:bg-[#181818] transition-all font-normal truncate text-pretty"
            onClick={onCreateJob}
          >
            Create Job
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-md shadow-slate-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-900 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs by title, description, or skills..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-500 rounded-xl focus:border-gray-600"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              onChange={(e) => onFilter("status", e.target.value)}
              className="px-4 py-3 border border-gray-500 rounded-xl focus:ring-1 focus:ring-gray-700 focus:border-transparent transition-all"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="closed">Closed</option>
            </select>
            <select
              onChange={(e) => onFilter("jobType", e.target.value)}
              className="px-4 py-3 border border-gray-500 rounded-xl focus:ring-1 focus:ring-gray-700 focus:border-transparent transition-all"
            >
              <option value="">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <JobsTable
        jobs={jobs}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
        onApplications={onApplications}
        onStatusChange={onStatusChange}
      />
    </div>
  );
};

JobsSection.propTypes = {
  jobs: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onApplications: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onCreateJob: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
};

export default JobsSection; 