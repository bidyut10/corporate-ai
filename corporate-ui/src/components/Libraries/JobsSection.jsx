import { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black">Jobs</h2>
          <p className="text-gray-600">Manage your job postings</p>
        </div>
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
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs by title, description, or skills..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              onChange={(e) => onFilter("status", e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="closed">Closed</option>
            </select>
            <select
              onChange={(e) => onFilter("jobType", e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
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