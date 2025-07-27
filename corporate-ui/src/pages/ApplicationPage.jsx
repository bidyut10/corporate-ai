import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createApplication, getJobById } from '../apis/jobService';

const ApplicationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get('job_id');

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    salaryExpectation: '',
    experienceYears: '',
    noticePeriod: '',
    resume: null
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!jobId) {
      toast.error('Job ID is required');
      navigate('/');
      return;
    }

    fetchJobDetails();
  }, [jobId, navigate]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await getJobById(jobId);
      if (response.status) {
        setJob(response.data);
        if (response.data.status !== 'active') {
          toast.error('This job is not active right now');
        }
      } else {
        toast.error('Job not found');
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.applicantName.trim()) {
      newErrors.applicantName = 'Name is required';
    } else if (formData.applicantName.trim().length < 2) {
      newErrors.applicantName = 'Name must be at least 2 characters';
    }

    if (!formData.applicantEmail.trim()) {
      newErrors.applicantEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.applicantEmail)) {
      newErrors.applicantEmail = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.salaryExpectation) {
      newErrors.salaryExpectation = 'Salary expectation is required';
    } else if (parseFloat(formData.salaryExpectation) <= 0) {
      newErrors.salaryExpectation = 'Salary must be greater than 0';
    }

    if (!formData.experienceYears) {
      newErrors.experienceYears = 'Experience years is required';
    } else if (parseFloat(formData.experienceYears) < 0) {
      newErrors.experienceYears = 'Experience cannot be negative';
    }

    if (!formData.noticePeriod) {
      newErrors.noticePeriod = 'Notice period is required';
    } else if (parseInt(formData.noticePeriod) < 0) {
      newErrors.noticePeriod = 'Notice period cannot be negative';
    }

    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
    } else if (formData.resume.type !== 'application/pdf') {
      newErrors.resume = 'Only PDF files are allowed';
    } else if (formData.resume.size > 5 * 1024 * 1024) {
      newErrors.resume = 'File size must be less than 5MB';
    }

    // Optional field validations
    if (formData.linkedin && !/^https?:\/\/.*linkedin\.com\/.*/.test(formData.linkedin)) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL';
    }

    if (formData.github && !/^https?:\/\/.*github\.com\/.*/.test(formData.github)) {
      newErrors.github = 'Please enter a valid GitHub URL';
    }

    if (formData.portfolio && !/^https?:\/\/.*/.test(formData.portfolio)) {
      newErrors.portfolio = 'Please enter a valid portfolio URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      resume: file
    }));
    
    if (errors.resume) {
      setErrors(prev => ({
        ...prev,
        resume: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    if (job?.status !== 'active') {
      toast.error('This job is not active right now');
      return;
    }

    try {
      setSubmitting(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('jobId', job._id); // Use MongoDB _id instead of jobId field
      formDataToSend.append('applicantName', formData.applicantName.trim());
      formDataToSend.append('applicantEmail', formData.applicantEmail.trim());
      formDataToSend.append('phone', formData.phone.trim());
      formDataToSend.append('linkedin', formData.linkedin.trim());
      formDataToSend.append('github', formData.github.trim());
      formDataToSend.append('portfolio', formData.portfolio.trim());
      formDataToSend.append('salaryExpectation', formData.salaryExpectation);
      formDataToSend.append('experienceYears', formData.experienceYears);
      formDataToSend.append('noticePeriod', formData.noticePeriod);
      formDataToSend.append('resume', formData.resume);

      const response = await createApplication(formDataToSend);
      
      if (response.status) {
        toast.success('Application submitted successfully!');
        navigate('/');
      } else {
        toast.error(response.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Job Not Found</h2>
          <p className="text-neutral-600 mb-6">The job you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (job.status !== 'active') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-2">Job Not Active</h2>
            <p>This job is not active right now. Please check back later or look for other opportunities.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Other Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Job Details Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">{job.title}</h1>
          <p className="text-neutral-600 mb-4">{job.location}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills?.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-semibold text-neutral-700">Experience:</span>
              <span className="ml-2 text-neutral-600">
                {job.experience?.min}-{job.experience?.max} years
              </span>
            </div>
            <div>
              <span className="font-semibold text-neutral-700">Salary:</span>
              <span className="ml-2 text-neutral-600">
                ${job.salary?.min?.toLocaleString()} - ${job.salary?.max?.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="font-semibold text-neutral-700">Type:</span>
              <span className="ml-2 text-neutral-600 capitalize">{job.jobType}</span>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Apply for this Position</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.applicantName ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.applicantName && (
                  <p className="mt-1 text-sm text-red-600">{errors.applicantName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="applicantEmail"
                  value={formData.applicantEmail}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.applicantEmail ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.applicantEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.applicantEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.linkedin ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
                {errors.linkedin && (
                  <p className="mt-1 text-sm text-red-600">{errors.linkedin}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  GitHub Profile
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.github ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  placeholder="https://github.com/yourusername"
                />
                {errors.github && (
                  <p className="mt-1 text-sm text-red-600">{errors.github}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Portfolio Website
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.portfolio ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  placeholder="https://yourportfolio.com"
                />
                {errors.portfolio && (
                  <p className="mt-1 text-sm text-red-600">{errors.portfolio}</p>
                )}
              </div>
            </div>

            {/* Professional Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Expected Salary (USD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="salaryExpectation"
                  value={formData.salaryExpectation}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.salaryExpectation ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  placeholder="75000"
                  min="0"
                />
                {errors.salaryExpectation && (
                  <p className="mt-1 text-sm text-red-600">{errors.salaryExpectation}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.experienceYears ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  placeholder="3"
                  min="0"
                  step="0.5"
                />
                {errors.experienceYears && (
                  <p className="mt-1 text-sm text-red-600">{errors.experienceYears}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Notice Period (Days) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.noticePeriod ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  placeholder="30"
                  min="0"
                />
                {errors.noticePeriod && (
                  <p className="mt-1 text-sm text-red-600">{errors.noticePeriod}</p>
                )}
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Resume (PDF only) <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="resume"
                onChange={handleFileChange}
                accept=".pdf"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.resume ? 'border-red-500' : 'border-neutral-300'
                }`}
              />
              {errors.resume && (
                <p className="mt-1 text-sm text-red-600">{errors.resume}</p>
              )}
              <p className="mt-1 text-sm text-neutral-500">
                Maximum file size: 5MB. Only PDF files are accepted.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage; 