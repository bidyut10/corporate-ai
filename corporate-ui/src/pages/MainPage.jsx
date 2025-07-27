import { useState, useEffect } from "react";
import { Bell, User, UserRound, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getJobStats, getAllJobs, getMyJobs, deleteJob, toggleJobStatus, getApplicationsByJob, getAllApplications } from "../apis/jobService";
import Sidebar from "../components/Libraries/Sidebar";
import OverviewSection from "../components/Libraries/OverviewSection";
import JobsSection from "../components/Libraries/JobsSection";
import ApplicationsSection from "../components/Libraries/ApplicationsSection";
import SettingsSection from "../components/Libraries/SettingsSection";
import ProfilePopup from "../components/Libraries/ProfilePopup";
import JobForm from "../components/Libraries/JobForm";
import toast, { Toaster } from "react-hot-toast";

const MainPage = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJobForApplications, setSelectedJobForApplications] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    closed: 0,
  });
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [loadingAllApplications, setLoadingAllApplications] = useState(false);
  const [errorJobs, setErrorJobs] = useState("");
  const [errorApplications, setErrorApplications] = useState("");
  const [errorAllApplications, setErrorAllApplications] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);
  const [viewingJob, setViewingJob] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchJobStats();
    fetchJobs();
    fetchAllApplications();
  }, []);

  const fetchJobStats = async () => {
    try {
      const response = await getJobStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching job stats:", error);
    }
  };

  const fetchJobs = async () => {
    setLoadingJobs(true);
    setErrorJobs("");
    try {
      const response = await getMyJobs({ limit: 50 });
      if (response.success) {
        setJobs(response.data.jobs || []);
      } else {
        setErrorJobs(response.message || "Failed to fetch jobs");
      }
    } catch (error) {
      setErrorJobs("Error fetching jobs");
      console.error("Error fetching jobs:", error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchAllApplications = async () => {
    setLoadingAllApplications(true);
    setErrorAllApplications("");
    try {
      const response = await getAllApplications({ limit: 50 });
      if (response.status) {
        setAllApplications(response.data || []);
      } else {
        setErrorAllApplications(response.message || "Failed to fetch all applications");
      }
    } catch (error) {
      setErrorAllApplications("Error fetching all applications");
      console.error("Error fetching all applications:", error);
    } finally {
      setLoadingAllApplications(false);
    }
  };

  const fetchApplications = async (jobId) => {
    setLoadingApplications(true);
    setErrorApplications("");
    try {
      const response = await getApplicationsByJob(jobId);
      if (response.status) {
        setApplications(response.data || []);
        setSelectedJobForApplications(jobs.find(job => job._id === jobId));
      } else {
        setErrorApplications(response.message || "Failed to fetch applications");
      }
    } catch (error) {
      setErrorApplications("Error fetching applications");
      console.error("Error fetching applications:", error);
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleJobEdit = (job) => {
    setEditingJob(job);
    setShowJobModal(true);
  };

  const handleJobDelete = async (job) => {
    if (window.confirm(`Are you sure you want to delete the job "${job.title}"?`)) {
      try {
        const response = await deleteJob(job.jobId);
        if (response.success) {
          toast.success("Job deleted successfully");
          fetchJobs();
          fetchJobStats();
        } else {
          toast.error(response.message || "Failed to delete job");
        }
      } catch (error) {
        toast.error("Error deleting job");
        console.error("Error deleting job:", error);
      }
    }
  };

  const handleJobView = (job) => {
    setViewingJob(job);
    setShowJobDetailsModal(true);
  };

  const handleJobApplications = (job) => {
    setSelectedJobForApplications(job);
    fetchApplications(job._id);
    setActiveSection("applications");
  };

  const handleJobStatusChange = async (jobId, status) => {
    try {
      const response = await toggleJobStatus(jobId, status);
      if (response.success) {
        toast.success("Job status updated");
        fetchJobs();
        fetchJobStats();
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating job status");
      console.error("Error updating job status:", error);
    }
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setShowJobModal(true);
  };

  // handleJobFormSuccess is now handled inline in JobForm's onSuccess

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleUserUpdate = (updatedUser) => {
    // Handle user update
    console.log("User updated:", updatedUser);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <OverviewSection
            stats={stats}
            recentJobs={jobs.slice(0, 5)}
            jobs={jobs}
            loadingJobs={loadingJobs}
            errorJobs={errorJobs}
            allApplications={allApplications}
            loadingAllApplications={loadingAllApplications}
            errorAllApplications={errorAllApplications}
          />
        );
      case "jobs":
        return (
          <div className="mx-auto">
            <JobsSection
              jobs={jobs}
              loading={loadingJobs}
              error={errorJobs}
              onEdit={handleJobEdit}
              onDelete={handleJobDelete}
              onView={handleJobView}
              onApplications={handleJobApplications}
              onStatusChange={handleJobStatusChange}
              onCreateJob={() => {
                setEditingJob({});
                setShowJobModal(true);
              }}
              onSearch={handleSearch}
              onFilter={handleFilter}
            />
            {/* Job Form Modal */}
            {showJobModal && (
              <JobForm
                job={editingJob && editingJob._id ? editingJob : null}
                onSuccess={() => {
                  setEditingJob(null);
                  setShowJobModal(false);
                  fetchJobs();
                  fetchJobStats();
                  toast.success(editingJob && editingJob._id ? "Job updated successfully" : "Job created successfully");
                }}
                onClose={() => {
                  setShowJobModal(false);
                  setEditingJob(null);
                }}
              />
            )}
          </div>
        );
      case "applications":
        return (
          <div className="mx-auto">
            {selectedJobForApplications && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">
                      {selectedJobForApplications.title}
                    </h2>
                    <p className="text-neutral-600">
                      {selectedJobForApplications.location}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveSection("jobs")}
                    className="text-sm text-white bg-black px-4 pt-2 pb-2.5 rounded-[9px] hover:bg-[#181818] transition-all font-normal truncate text-pretty"
                  >
                    ← Back to Jobs
                  </button>
                </div>
              </div>
            )}
            <ApplicationsSection
              applications={applications}
              jobId={selectedJobForApplications?._id}
              loading={loadingApplications}
              error={errorApplications}
            />
          </div>
        );
      case "settings":
        return (
          <SettingsSection
            user={user}
            onUserUpdate={handleUserUpdate}
          />
        );
      default:
        return <OverviewSection stats={stats} recentJobs={jobs.slice(0, 5)} />;
    }
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className="h-screen bg-white flex">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Header */}
          <header className="bg-white shadow-xl shadow-slate-50">
            <div className="flex justify-end items-center h-16 px-6">
              <div className="flex justify-center items-center space-x-6">
                <Bell className="w-5 h-5 text-black cursor-pointer" />
            
                <div
                  className="w-8 h-8 bg-gradient-to-br from-neutral-900 to-slate-950 rounded-full flex items-center justify-center text-white font-medium text-md text-center cursor-pointer"
                  onClick={() => setShowProfilePopup(true)}
                >
                  {user?.name.charAt(0).toUpperCase() || "U"}
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {renderActiveSection()}
          </main>
        </div>

        {/* Profile Popup */}
        <ProfilePopup
          isOpen={showProfilePopup}
          onClose={() => setShowProfilePopup(false)}
          name={user.name}
          email={user.email}
          role={user.role}
        />

        {/* Job Details Modal */}
        {showJobDetailsModal && viewingJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
              <button
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 text-neutral-500"
                onClick={() => setShowJobDetailsModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-2">{viewingJob.title}</h2>
                <div className="mb-4 text-neutral-600">{viewingJob.location}</div>
                <div className="mb-4">
                  <span className="capitalize px-2 py-1 bg-purple-400/10 text-purple-400 rounded-lg text-xs font-medium mr-2">
                    {viewingJob.jobType}
                  </span>
                  <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-lg text-xs font-medium mr-2">
                    {viewingJob.status}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                    {viewingJob.salary && viewingJob.salary.min ? `${viewingJob.salary.currency || 'USD'} ${viewingJob.salary.min.toLocaleString()}${viewingJob.salary.max ? ' - ' + viewingJob.salary.max.toLocaleString() : ''}` : 'Not specified'}
                  </span>
                </div>
                <div className="mb-4">
                  <strong>Skills:</strong> {viewingJob.skills && viewingJob.skills.length > 0 ? viewingJob.skills.join(", ") : 'N/A'}
                </div>
                <div className="mb-4">
                  <strong>Experience:</strong> {viewingJob.experience ? `${viewingJob.experience.min || 0} - ${viewingJob.experience.max || 0} years` : 'N/A'}
                </div>
                <div className="mb-4">
                  <strong>Applications:</strong> {viewingJob.applicationsCount || 0}
                </div>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: viewingJob.description }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MainPage;