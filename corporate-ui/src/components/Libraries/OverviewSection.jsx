import {
  Briefcase,
  Users,
  TrendingUp,
  Clock,
  FileText,
  Award,
  Eye,
  MapPin,
  Calendar,
  Star,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Filter,
  Search,
  DollarSign,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import { useState } from "react";

const COLORS = ["#8B5CF6", "#EC4899", "#6366F1", "#F59E0B", "#10B981"];

// Mini Stats Card Component
const MiniStatsCard = ({ title, value, icon: Icon, color, subtitle, trend }) => {
  const gradientMap = {
    purple: "from-purple-500 to-pink-500",
    red: "from-pink-500 to-red-500",
    blue: "from-blue-500 to-purple-500",
    orange: "from-orange-500 to-pink-500",
    green: "from-green-500 to-emerald-500",
    indigo: "from-indigo-500 to-purple-500",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 sm:p-3 lg:p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-600 mb-1 truncate">{title}</p>
          <p className="text-lg sm:text-xl font-bold text-gray-900 truncate">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1 truncate">{subtitle}</p>}
        </div>
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${gradientMap[color]} flex items-center justify-center flex-shrink-0 ml-2`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-2 flex items-center">
          <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
          <span className="text-xs text-green-600 font-medium">{trend}</span>
        </div>
      )}
    </div>
  );
};

// Mini Chart Component
const MiniChart = ({ data, type = "pie", title, color = "purple" }) => {
  const gradientMap = {
    purple: "from-purple-500 to-pink-500",
    blue: "from-blue-500 to-purple-500",
    green: "from-green-500 to-emerald-500",
  };

  if (type === "pie") {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 sm:p-3 lg:p-4">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{title}</h4>
          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-gradient-to-br ${gradientMap[color]} flex items-center justify-center flex-shrink-0 ml-2`}>
            <PieChartIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
          </div>
        </div>
        <div className="h-20 sm:h-24">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={30}
                innerRadius={15}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (type === "area") {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 sm:p-3 lg:p-4">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{title}</h4>
          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-gradient-to-br ${gradientMap[color]} flex items-center justify-center flex-shrink-0 ml-2`}>
            <BarChart3 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
          </div>
        </div>
        <div className="h-20 sm:h-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" fontSize={8} />
              <YAxis stroke="#666" fontSize={8} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#8B5CF6"
                strokeWidth={2}
                fill="url(#colorGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return null;
};

// Compact Table Component
const CompactTable = ({ title, data, columns, icon: Icon, color = "purple", maxRows = 4 }) => {
  const gradientMap = {
    purple: "from-purple-500 to-pink-500",
    blue: "from-blue-500 to-purple-500",
    green: "from-green-500 to-emerald-500",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 sm:p-3 lg:p-4">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{title}</h4>
        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-gradient-to-br ${gradientMap[color]} flex items-center justify-center flex-shrink-0 ml-2`}>
          <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
        </div>
      </div>
      {data && data.length > 0 ? (
        <div className="space-y-1 sm:space-y-2">
          {data.slice(0, maxRows).map((item, index) => (
            <div key={index} className="flex items-center justify-between py-1.5 sm:py-2 px-2 sm:px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0 flex-1">
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-gradient-to-br ${gradientMap[color]} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                  {index + 1}
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">{item.name}</span>
              </div>
              <span className="text-xs text-gray-600 font-medium flex-shrink-0 ml-2">{item.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-3 sm:py-4">
          <p className="text-xs text-gray-500">No data available</p>
        </div>
      )}
    </div>
  );
};

// Compact Applications List
const CompactApplicationsList = ({ applications, title, maxItems = 3 }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 sm:p-3 lg:p-4">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{title}</h4>
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 ml-2">
          <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
        </div>
      </div>
      {applications && applications.length > 0 ? (
        <div className="space-y-1 sm:space-y-2">
          {applications.slice(0, maxItems).map((app, index) => (
            <div key={app._id || index} className="flex items-center justify-between py-1.5 sm:py-2 px-2 sm:px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0 flex-1">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {app.applicantName?.charAt(0).toUpperCase() || "N"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-900 truncate">{app.applicantName}</p>
                  <p className="text-xs text-gray-500 truncate">{app.jobId?.title}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                {app.aiScore && (
                  <span className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium ${
                    app.aiScore >= 80 ? 'bg-green-100 text-green-700' :
                    app.aiScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {app.aiScore}%
                  </span>
                )}
                <span className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium ${
                  app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  app.status === 'shortlisted' ? 'bg-green-100 text-green-700' :
                  app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-3 sm:py-4">
          <p className="text-xs text-gray-500">No applications yet</p>
        </div>
      )}
    </div>
  );
};

// Compact Jobs List
const CompactJobsList = ({ jobs, title, maxItems = 3 }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 sm:p-3 lg:p-4">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{title}</h4>
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 ml-2">
          <Briefcase className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
        </div>
      </div>
      {jobs && jobs.length > 0 ? (
        <div className="space-y-1 sm:space-y-2">
          {jobs.slice(0, maxItems).map((job, index) => (
            <div key={job._id || index} className="flex items-center justify-between py-1.5 sm:py-2 px-2 sm:px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0 flex-1">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-md flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-900 truncate">{job.title}</p>
                  <p className="text-xs text-gray-500 truncate">{job.location} • {job.jobType}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                <span className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium ${
                  job.status === 'active' ? 'bg-green-100 text-green-700' :
                  job.status === 'inactive' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {job.status}
                </span>
                {/* {job.applicationsCount && (
                  <span className="text-xs text-gray-500">
                    {job.applicationsCount}
                  </span>
                )} */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-3 sm:py-4">
          <p className="text-xs text-gray-500">No jobs yet</p>
        </div>
      )}
    </div>
  );
};

const OverviewSection = ({
  stats,
  recentJobs,
  jobs = [],
  loadingJobs = false,
  errorJobs = "",
  allApplications = [],
  loadingAllApplications = false,
  errorAllApplications = "",
}) => {
  const [jobFilter, setJobFilter] = useState("");
  const [applicationFilter, setApplicationFilter] = useState("");

  const chartData = [
    { name: "Active", value: stats?.active || 0, color: "#10B981" },
    { name: "Inactive", value: stats?.inactive || 0, color: "#F59E0B" },
    { name: "Closed", value: stats?.closed || 0, color: "#EF4444" },
  ];

  const filteredJobs =
    recentJobs?.filter((job) =>
      job.title.toLowerCase().includes(jobFilter.toLowerCase())
    ) || [];

  const filteredApplications =
    allApplications?.filter(
      (app) =>
        app.applicantName
          ?.toLowerCase()
          .includes(applicationFilter.toLowerCase()) ||
        app.jobId?.title
          ?.toLowerCase()
          .includes(applicationFilter.toLowerCase())
    ) || [];

  // Prepare area chart data for job creation over time
  const areaData = (() => {
    if (!jobs || jobs.length === 0) return [];
    const dateMap = {};
    jobs.forEach((job) => {
      const date = new Date(job.createdAt);
      const monthYear = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      dateMap[monthYear] = (dateMap[monthYear] || 0) + 1;
    });
    return Object.entries(dateMap)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  })();

  // Top locations and job types
  const topLocations = (() => {
    if (!jobs || jobs.length === 0) return [];
    const locMap = {};
    jobs.forEach((job) => {
      if (job.location) locMap[job.location] = (locMap[job.location] || 0) + 1;
    });
    return Object.entries(locMap)
      .map(([location, count]) => ({ name: location, value: `${count} jobs` }))
      .sort((a, b) => parseInt(b.value) - parseInt(a.value))
      .slice(0, 5);
  })();

  const topTypes = (() => {
    if (!jobs || jobs.length === 0) return [];
    const typeMap = {};
    jobs.forEach((job) => {
      if (job.jobType) typeMap[job.jobType] = (typeMap[job.jobType] || 0) + 1;
    });
    return Object.entries(typeMap)
      .map(([type, count]) => ({ name: type, value: `${count} jobs` }))
      .sort((a, b) => parseInt(b.value) - parseInt(a.value))
      .slice(0, 5);
  })();

  // Application statistics
  const applicationStats = (() => {
    if (!allApplications || allApplications.length === 0) {
      return { total: 0, highScore: 0, averageScore: 0, pending: 0 };
    }

    const total = allApplications.length;
    const scores = allApplications
      .map((app) => app.aiScore || 0)
      .filter((score) => score > 0);
    const highScore = scores.length > 0 ? Math.max(...scores) : 0;
    const averageScore =
      scores.length > 0
        ? Math.round(
            scores.reduce((sum, score) => sum + score, 0) / scores.length
          )
        : 0;
    const pending = allApplications.filter(
      (app) => app.status === "pending"
    ).length;

    return { total, highScore, averageScore, pending };
  })();

  // Status distribution for applications
  const applicationStatusData = (() => {
    if (!allApplications || allApplications.length === 0) return [];
    const statusMap = {};
    allApplications.forEach((app) => {
      statusMap[app.status] = (statusMap[app.status] || 0) + 1;
    });
    return Object.entries(statusMap).map(([status, count]) => ({
      name: status,
      value: count,
      color: status === 'pending' ? '#F59E0B' : 
             status === 'shortlisted' ? '#10B981' : 
             status === 'rejected' ? '#EF4444' : '#6B7280'
    }));
  })();

  return (
    <div className="h-screen overflow-hidden  font-normal">
      <div className="h-full grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-2 sm:gap-3 lg:gap-4">
        {/* Top Row - Main Stats */}
        <div className="col-span-1 sm:col-span-6 lg:col-span-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
          <MiniStatsCard
            title="Total Jobs"
            value={stats?.total || 0}
            icon={Briefcase}
            color="purple"
            subtitle="Created"
          />
          <MiniStatsCard
            title="Active Jobs"
            value={stats?.active || 0}
            icon={Activity}
            color="green"
            subtitle="Hiring"
          />
          <MiniStatsCard
            title="Applications"
            value={applicationStats.total}
            icon={FileText}
            color="blue"
            subtitle="Received"
          />
          <MiniStatsCard
            title="Pending"
            value={applicationStats.pending}
            icon={Clock}
            color="orange"
            subtitle="Reviews"
          />
          <MiniStatsCard
            title="Avg Score"
            value={`${applicationStats.averageScore}%`}
            icon={Award}
            color="indigo"
            subtitle="AI Rating"
          />
          <MiniStatsCard
            title="Success Rate"
            value={`${
              applicationStats.total > 0
                ? Math.round(
                    ((applicationStats.total - applicationStats.pending) /
                      applicationStats.total) *
                      100
                  )
                : 0
            }%`}
            icon={Target}
            color="red"
            subtitle="Processed"
          />
        </div>

        {/* Charts and Analytics Section */}
        <div className="col-span-1 sm:col-span-6 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
          {/* Charts Row */}
          <MiniChart
            data={chartData}
            type="pie"
            title="Job Status"
            color="purple"
          />
          <MiniChart
            data={areaData}
            type="area"
            title="Job Creation Trend"
            color="blue"
          />

          {/* Top Locations and Types */}
          <CompactTable
            title="Top Locations"
            data={topLocations}
            icon={MapPin}
            color="green"
            maxRows={4}
          />
          <CompactTable
            title="Top Job Types"
            data={topTypes}
            icon={Briefcase}
            color="blue"
            maxRows={4}
          />

          {/* Application Status Chart */}
          <div className="col-span-1 sm:col-span-2">
            <MiniChart
              data={applicationStatusData}
              type="pie"
              title="Application Status"
              color="orange"
            />
          </div>
        </div>

        {/* Recent Data Section */}
        <div className="col-span-1 sm:col-span-6 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3 lg:gap-4">
          <CompactApplicationsList
            applications={filteredApplications}
            title="Recent Applications"
            maxItems={6}
          />
          <CompactJobsList
            jobs={filteredJobs}
            title="Recent Jobs"
            maxItems={6}
          />
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
