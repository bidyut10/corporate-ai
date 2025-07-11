import { useState, useEffect } from "react";
import { Bell, User, UserRound } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getJobStats, getMyJobs, deleteJob, toggleJobStatus } from "../apis/jobService";
import Sidebar from "../components/Libraries/Sidebar";
import OverviewSection from "../components/Libraries/OverviewSection";
import JobsSection from "../components/Libraries/JobsSection";
import ApplicationsSection from "../components/Libraries/ApplicationsSection";
import SettingsSection from "../components/Libraries/SettingsSection";
import ProfilePopup from "../components/Libraries/ProfilePopup";
import JobForm from "../components/Libraries/JobForm";

const MainPage = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    closed: 0,
  });
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});

  // Fetch initial data
  useEffect(() => {
    fetchJobStats();
    fetchJobs();
    fetchApplications();
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
    try {
      const response = await getMyJobs();
      if (response.success) {
        setJobs(response.data.jobs || []);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchApplications = async () => {
    // Mock applications data for now
    setApplications([
      {
        _id: "1",
        candidateName: "John Doe",
        jobTitle: "Frontend Developer",
        appliedAt: new Date(),
      },
      {
        _id: "2",
        candidateName: "Jane Smith",
        jobTitle: "Backend Developer",
        appliedAt: new Date(),
      },
    ]);
  };

  const handleJobEdit = (job) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleJobDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        const response = await deleteJob(jobId);
        if (response.success) {
          fetchJobs();
          fetchJobStats();
        }
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  const handleJobView = (job) => {
    // Handle job view
    console.log("View job:", job);
  };

  const handleJobStatusChange = async (jobId) => {
    try {
      const response = await toggleJobStatus(jobId);
      if (response.success) {
        fetchJobs();
        fetchJobStats();
      }
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setShowJobForm(true);
  };

  const handleJobFormSuccess = () => {
    setShowJobForm(false);
    setEditingJob(null);
    fetchJobs();
    fetchJobStats();
  };

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
          />
        );
      case "jobs":
        return (
          <JobsSection
            jobs={jobs}
            onEdit={handleJobEdit}
            onDelete={handleJobDelete}
            onView={handleJobView}
            onStatusChange={handleJobStatusChange}
            onCreateJob={handleCreateJob}
            onSearch={handleSearch}
            onFilter={handleFilter}
          />
        );
      case "applications":
        return (
          <ApplicationsSection
            applications={applications}
          />
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
    <div className="h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-white">
          <div className="flex justify-end items-center h-16 px-6">
            <div className="flex justify-center items-center space-x-6">
              <Bell className="w-5 h-5 text-black cursor-pointer" />
              <div
                className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex items-center justify-center text-white cursor-pointer"
                onClick={() => setShowProfilePopup(true)}
              >
                <UserRound size={18} />
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

      {/* Job Form Modal */}
      <JobForm
        isOpen={showJobForm}
        onClose={() => {
          setShowJobForm(false);
          setEditingJob(null);
        }}
        job={editingJob}
        onSuccess={handleJobFormSuccess}
      />
    </div>
  );
};

export default MainPage;