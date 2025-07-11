import { Briefcase, Users, TrendingUp, Clock } from "lucide-react";
import StatsCard from "./StatsCard";
import PropTypes from "prop-types";

const OverviewSection = ({ stats, recentJobs }) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Jobs"
          value={stats?.total || 0}
          icon={Briefcase}
          color="purple"
        />
        <StatsCard
          title="Active Jobs"
          value={stats?.active || 0}
          icon={TrendingUp}
          color="red"
        />
        <StatsCard
          title="Inactive Jobs"
          value={stats?.inactive || 0}
          icon={Clock}
          color="pink"
        />
        <StatsCard
          title="Closed Jobs"
          value={stats?.closed || 0}
          icon={Users}
          color="black"
        />
      </div>

      {/* Recent Jobs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-black">Recent Jobs</h3>
        </div>
        <div className="p-6">
          {recentJobs && recentJobs.length > 0 ? (
            <div className="space-y-4">
              {recentJobs.slice(0, 5).map((job) => (
                <div key={job._id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-black mb-1">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.location} • {job.jobType}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                      job.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                      job.status === 'inactive' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {job.status}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs yet</h3>
              <p className="text-gray-500">Create your first job posting to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

OverviewSection.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number,
    active: PropTypes.number,
    inactive: PropTypes.number,
    closed: PropTypes.number,
  }),
  recentJobs: PropTypes.array,
};

export default OverviewSection; 