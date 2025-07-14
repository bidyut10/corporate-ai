import { useState, useEffect, useRef } from "react";
import {
  X,
  Save,
  ScrollText,
} from "lucide-react";
import { createJob, updateJob } from "../../apis/jobService";
import RichTextEditor from "./RichTextEditor";
import AIAssistant from "./AIAssistant";
import SkillsInput from "./SkillsInput";
import PropTypes from "prop-types";

const JobForm = ({ job = null, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    skills: [],
    salary: {
      min: "",
      max: "",
      currency: "USD",
    },
    experience: {
      min: 0,
      max: 10,
    },
    jobType: "full-time",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [aiLoading, setAiLoading] = useState(false); // Track AI Assistant loading
  const aiActionRef = useRef(false); // Track if AI Assistant is updating
  const [editorKey, setEditorKey] = useState("new");

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        description: job.description || "",
        location: job.location || "",
        skills: job.skills || [],
        salary: job.salary || { min: "", max: "", currency: "USD" },
        experience: job.experience || { min: 0, max: 10 },
        jobType: job.jobType || "full-time",
      });
      setEditorKey(job._id || job.jobId || Math.random().toString(36));
    } else {
      setFormData({
        title: "",
        description: "",
        location: "",
        skills: [],
        salary: { min: "", max: "", currency: "USD" },
        experience: { min: 0, max: 10 },
        jobType: "full-time",
      });
      setEditorKey("new");
    }
  }, [job]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSalaryChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      salary: {
        ...prev.salary,
        [field]: value,
      },
    }));
  };

  const handleExperienceChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
        [field]: parseInt(value) || 0,
      },
    }));
  };

  const handleSkillsChange = (skills) => {
    setFormData((prev) => ({
      ...prev,
      skills: skills,
    }));
  };

  // AI Assistant handlers
  const handleAIGenerate = async (description) => {
    aiActionRef.current = true;
    setAiLoading(true);
    handleInputChange("description", description);
    setAiLoading(false);
    aiActionRef.current = false;
  };

  const handleAIEnhance = async (description) => {
    aiActionRef.current = true;
    setAiLoading(true);
    handleInputChange("description", description);
    setAiLoading(false);
    aiActionRef.current = false;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.description.trim())
      newErrors.description = "Job description is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (
      formData.salary.min &&
      formData.salary.max &&
      parseInt(formData.salary.min) > parseInt(formData.salary.max)
    ) {
      newErrors.salary = "Minimum salary cannot be greater than maximum salary";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prevent submit if AI Assistant is updating
    if (aiActionRef.current || aiLoading) return;
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        salary: {
          ...formData.salary,
          min: formData.salary.min ? parseInt(formData.salary.min) : undefined,
          max: formData.salary.max ? parseInt(formData.salary.max) : undefined,
        },
      };

      const result = job
        ? await updateJob(job.jobId, submitData)
        : await createJob(submitData);

      if (result.success) {
        onSuccess();
        setFormData({
          title: "",
          description: "",
          location: "",
          skills: [],
          salary: { min: "", max: "", currency: "USD" },
          experience: { min: 0, max: 10 },
          jobType: "full-time",
        });
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 font-normal bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-xl text-black flex items-center gap-2 mb-1 ">
                {job ? "Edit Job" : "Create New Job"}
              </h3>
              <p className="text-md text-gray-900 font-light">
                Fill in the details below to {job ? "update" : "create"} your
                job posting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-black text-sm font-medium mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-all ${
                    errors.title ? "border-red-400" : "border-gray-200"
                  }`}
                  placeholder="e.g., Senior React Developer"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-400">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-black text-sm font-medium mb-2">
                  Job Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-xl transition-all ${
                    errors.location ? "border-red-400" : "border-gray-200"
                  }`}
                  placeholder="e.g., New York, NY"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-400">{errors.location}</p>
                )}
              </div>
            </div>

            {/* Job Description with AI Assistant */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                  <ScrollText className="w-4 h-4" /> Job Description *
                </label>
                {!job && (
                  <AIAssistant
                    onGenerate={handleAIGenerate}
                    onEnhance={handleAIEnhance}
                    currentDescription={formData.description}
                    jobDetails={formData}
                  />
                )}
              </div>
              <RichTextEditor
                key={editorKey}
                value={formData.description || ""}
                onChange={(value) => handleInputChange("description", value)}
                placeholder="Describe the role, responsibilities, and requirements... Use the AI Assistant to generate or enhance your description."
                error={!!errors.description}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Required Skills */}
            <div>
              <label className="flex items-center gap-2 text-black text-sm font-medium mb-2">
                Required Skills
              </label>
              <SkillsInput
                value={formData.skills}
                onChange={handleSkillsChange}
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="flex items-center gap-2 text-black text-sm font-medium mb-2">
                  Min Salary
                </label>
                <input
                  type="number"
                  value={formData.salary.min}
                  onChange={(e) => handleSalaryChange("min", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all"
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-black text-sm font-medium mb-2">
                  Max Salary
                </label>
                <input
                  type="number"
                  value={formData.salary.max}
                  onChange={(e) => handleSalaryChange("max", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all"
                  placeholder="80000"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-black text-sm font-medium mb-2">
                  Currency
                </label>
                <select
                  value={formData.salary.currency}
                  onChange={(e) =>
                    handleSalaryChange("currency", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>
            </div>
            {errors.salary && (
              <p className="text-sm text-red-400">{errors.salary}</p>
            )}

            {/* Experience Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-black text-sm font-medium mb-2">
                  Min Experience (years)
                </label>
                <input
                  type="number"
                  value={formData.experience.min}
                  onChange={(e) =>
                    handleExperienceChange("min", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all"
                  min="0"
                  max="20"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-black text-sm font-medium mb-2">
                  Max Experience (years)
                </label>
                <input
                  type="number"
                  value={formData.experience.max}
                  onChange={(e) =>
                    handleExperienceChange("max", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all"
                  min="0"
                  max="20"
                />
              </div>
            </div>

            {/* Job Type */}
            <div>
              <label className="flex items-center gap-2 text-black text-sm font-medium mb-2">
                Job Type
              </label>
              <select
                value={formData.jobType}
                onChange={(e) => handleInputChange("jobType", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all"
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
          </form>
        </div>

        {/* Footer with Submit Button */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 text-black hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center space-x-2 bg-black hover:bg-gray-950 text-white px-6 py-1 rounded-xl transition-colors shadow-sm hover:shadow-md disabled:opacity-60"
          >
            {loading ? (
              <span>Saving...</span>
            ) : (
              <>
                <span>{job ? "Update Job" : "Save Job"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

JobForm.propTypes = {
  job: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default JobForm;
