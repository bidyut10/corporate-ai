import { useState, useEffect } from "react";
import {
  X,
  Save,
  Plus,
  MapPin,
  BadgeDollarSign,
  ListChecks,
  ScrollText,
  Type,
  Briefcase,
  Clock,
} from "lucide-react";
import { createJob, updateJob } from "../../apis/jobService";
import PropTypes from "prop-types";

const JobForm = ({ job = null, onSuccess }) => {
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

  const handleSkillsChange = (value) => {
    const skillsArray = value
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill);
    setFormData((prev) => ({
      ...prev,
      skills: skillsArray,
    }));
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
    <div className="bg-white/90 rounded-2xl shadow-lg border border-gray-100 p-8 max-w-3xl mx-auto mb-8">
      <h3 className="text-2xl font-bold text-black flex items-center gap-2 mb-6">
        <Briefcase className="w-6 h-6" />
        {job ? "Edit Job" : "Create New Job"}
      </h3>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 text-sm md:text-base"
      >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
                <Type className="w-4 h-4" /> Job Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all ${
                  errors.title ? "border-red-400" : "border-gray-200"
                }`}
                placeholder="e.g., Senior React Developer"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
                <MapPin className="w-4 h-4" /> Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all ${
                  errors.location ? "border-red-400" : "border-gray-200"
                }`}
                placeholder="e.g., New York, NY"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-400">{errors.location}</p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
              <ScrollText className="w-4 h-4" /> Job Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none ${
                errors.description ? "border-red-400" : "border-gray-200"
              }`}
              placeholder="Describe the role, responsibilities, and requirements..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
              <ListChecks className="w-4 h-4" /> Required Skills
            </label>
            <input
              type="text"
              value={formData.skills.join(", ")}
              onChange={(e) => handleSkillsChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              placeholder="e.g., React, Node.js, MongoDB (comma separated)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
                <BadgeDollarSign className="w-4 h-4" /> Min Salary
              </label>
              <input
                type="number"
                value={formData.salary.min}
                onChange={(e) => handleSalaryChange("min", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                placeholder="50000"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
                <BadgeDollarSign className="w-4 h-4" /> Max Salary
              </label>
              <input
                type="number"
                value={formData.salary.max}
                onChange={(e) => handleSalaryChange("max", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                placeholder="80000"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
                <BadgeDollarSign className="w-4 h-4" /> Currency
              </label>
              <select
                value={formData.salary.currency}
                onChange={(e) => handleSalaryChange("currency", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
                <Clock className="w-4 h-4" /> Min Experience (years)
              </label>
              <input
                type="number"
                value={formData.experience.min}
                onChange={(e) => handleExperienceChange("min", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                min="0"
                max="20"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
                <Clock className="w-4 h-4" /> Max Experience (years)
              </label>
              <input
                type="number"
                value={formData.experience.max}
                onChange={(e) => handleExperienceChange("max", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                min="0"
                max="20"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
              <Briefcase className="w-4 h-4" /> Job Type
            </label>
            <select
              value={formData.jobType}
              onChange={(e) => handleInputChange("jobType", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center space-x-2 bg-purple-400 hover:bg-purple-500 text-white px-6 py-3 rounded-xl transition-colors shadow-sm hover:shadow-md font-medium disabled:opacity-60"
          >
            {loading ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{job ? "Update Job" : "Create Job"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

JobForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  job: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};

export default JobForm;
