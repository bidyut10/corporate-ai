import { Briefcase, Users, TrendingUp, Clock } from "lucide-react";
import StatsCard from "./StatsCard";
import PropTypes from "prop-types";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useState } from "react";

const COLORS = ["#a78bfa", "#f472b6", "#fbbf24"];

const OverviewSection = ({ stats, recentJobs, jobs = [], loadingJobs = false, errorJobs = "" }) => {
  const [jobFilter, setJobFilter] = useState("");

  const chartData = [
    { name: "Active", value: stats?.active || 0 },
    { name: "Inactive", value: stats?.inactive || 0 },
    { name: "Closed", value: stats?.closed || 0 },
  ];

  const filteredJobs = recentJobs?.filter(job =>
    job.title.toLowerCase().includes(jobFilter.toLowerCase())
  ) || [];

  // Prepare bar chart data for job creation over time (by date)
  const barData = (() => {
    if (!jobs || jobs.length === 0) return [];
    const dateMap = {};
    jobs.forEach(job => {
      const date = new Date(job.createdAt).toLocaleDateString();
      dateMap[date] = (dateMap[date] || 0) + 1;
    });
    return Object.entries(dateMap).map(([date, count]) => ({ date, count }));
  })();

  // Top locations and job types
  const topLocations = (() => {
    if (!jobs || jobs.length === 0) return [];
    const locMap = {};
    jobs.forEach(job => {
      if (job.location) locMap[job.location] = (locMap[job.location] || 0) + 1;
    });
    return Object.entries(locMap)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  })();

  const topTypes = (() => {
    if (!jobs || jobs.length === 0) return [];
    const typeMap = {};
    jobs.forEach(job => {
      if (job.jobType) typeMap[job.jobType] = (typeMap[job.jobType] || 0) + 1;
    });
    return Object.entries(typeMap)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  })();

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

      {/* Job Status Pie Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Job Status Distribution</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Job Creation Over Time Bar Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Job Creation Over Time</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#a78bfa" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Locations & Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Top Locations</h3>
          {topLocations.length > 0 ? (
            <ul className="space-y-2">
              {topLocations.map(loc => (
                <li key={loc.location} className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{loc.location}</span>
                  <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-semibold">{loc.count} jobs</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400">No location data</div>
          )}
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Top Job Types</h3>
          {topTypes.length > 0 ? (
            <ul className="space-y-2">
              {topTypes.map(type => (
                <li key={type.type} className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 capitalize">{type.type}</span>
                  <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-semibold">{type.count} jobs</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400">No job type data</div>
          )}
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-black">Recent Jobs</h3>
          <input
            type="text"
            placeholder="Filter by job title..."
            value={jobFilter}
            onChange={e => setJobFilter(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
          />
        </div>
        <div className="p-6">
          {loadingJobs ? (
            <div className="text-center py-8 text-purple-400 font-semibold">Loading jobs...</div>
          ) : errorJobs ? (
            <div className="text-center py-8 text-red-400 font-semibold">{errorJobs}</div>
          ) : filteredJobs && filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.slice(0, 5).map((job) => (
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