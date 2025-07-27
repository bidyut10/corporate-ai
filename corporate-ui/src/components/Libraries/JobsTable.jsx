import { Edit, Trash2, Eye, MoreHorizontal, Users } from "lucide-react";
import PropTypes from "prop-types";

const JobsTable = ({ jobs, onEdit, onDelete, onView, onStatusChange, onApplications }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "closed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-neutral-100 text-neutral-800 border-neutral-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (salary) => {
    if (!salary || !salary.min) return "Not specified";
    if (salary.max) {
      return `${salary.currency || 'USD'} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
    }
    return `${salary.currency || 'USD'} ${salary.min.toLocaleString()}`;
  };

  return (
    <div className="bg-white/80 font-normal backdrop-blur-sm rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-100">
          <thead className="bg-neutral-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Job Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Salary
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Applications
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-100">
            {jobs.map((job) => (
              <tr key={job._id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-neutral-800">{job.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                  {job.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                  <span className="capitalize px-2 py-1 bg-purple-400/10 text-purple-400 rounded-lg text-xs font-medium">
                    {job.jobType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                  {formatSalary(job.salary)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                  {formatDate(job.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 text-center">
                  {job.applicationsCount || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(job)}
                      className="p-2 text-neutral-800 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onApplications(job)}
                      className={`p-2 text-neutral-800 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all ${!(job.applicationsCount > 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title="View Applications"
                      disabled={!(job.applicationsCount > 0)}
                    >
                      <Users className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(job)}
                      className="p-2 text-neutral-800 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(job)}
                      className="p-2 text-neutral-800 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <select
                      value={job.status}
                      onChange={(e) => onStatusChange(job.jobId, e.target.value)}
                      className="text-xs border border-neutral-200 rounded-lg px-2 py-1 bg-white hover:border-purple-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {jobs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MoreHorizontal className="w-8 h-8 text-neutral-800" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No jobs found</h3>
          <p className="text-neutral-500">Get started by creating your first job posting.</p>
        </div>
      )}
    </div>
  );
};

JobsTable.propTypes = {
  jobs: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onApplications: PropTypes.func.isRequired,
};

export default JobsTable; 