import { Users, Eye, Download, Mail, Phone, Calendar, DollarSign, Clock, Award, Star, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { getApplicationById } from "../../apis/jobService";
import { toast } from "react-hot-toast";

const ApplicationsSection = ({ applications, jobId }) => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleViewApplication = async (applicationId) => {
    try {
      setLoading(true);
      const response = await getApplicationById(applicationId);
      if (response.status) {
        setSelectedApplication(response.data);
      } else {
        toast.error(response.message || 'Failed to load application details');
      }
    } catch (error) {
      console.error('Error fetching application:', error);
      toast.error('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResume = (resumeUrl) => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'hired':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'HIGHLY RECOMMENDED':
        return 'bg-green-100 text-green-800';
      case 'RECOMMENDED':
        return 'bg-blue-100 text-blue-800';
      case 'CONDITIONALLY RECOMMENDED':
        return 'bg-yellow-100 text-yellow-800';
      case 'NOT RECOMMENDED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 font-normal">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
          <p className="text-gray-600">View job applications and candidates</p>
        </div>
        <div className="text-sm text-gray-500">
          {applications?.length || 0} application{applications?.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      {/* Applications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
        </div>
        <div className="p-6">
          {applications && applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{application.applicantName}</h4>
                      <p className="text-sm text-gray-500">{application.applicantEmail}</p>
                      <p className="text-xs text-gray-400">Applied {formatDate(application.appliedAt)}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        {application.aiScore && (
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-1">AI Score:</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getScoreColor(application.aiScore)}`}>
                              {application.aiScore}%
                            </span>
                          </div>
                        )}
                        {application.aiRecommendation && (
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-1">Recommendation:</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getRecommendationColor(application.aiRecommendation)}`}>
                              {application.aiRecommendation}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                    <button 
                      className="text-gray-400 hover:text-blue-600 p-1" 
                      title="View Application"
                      onClick={() => handleViewApplication(application._id)}
                      disabled={loading}
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="text-gray-400 hover:text-purple-600 p-1" 
                      title="Download Resume"
                      onClick={() => handleDownloadResume(application.resumeUrl)}
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
              <p className="mt-1 text-sm text-gray-500">
                Applications will appear here when candidates apply to your jobs.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedApplication.applicantName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedApplication.applicantEmail}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedApplication.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Applied {formatDate(selectedApplication.appliedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Professional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">₹{selectedApplication.salaryExpectation?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedApplication.experienceYears} years</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedApplication.noticePeriod} days notice</span>
                    </div>
                  </div>
                </div>

                {/* AI Analysis */}
                {selectedApplication.aiScore && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">AI Analysis</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">AI Score:</span>
                          <span className={`text-sm px-2 py-1 rounded-full ${getScoreColor(selectedApplication.aiScore)}`}>
                            {selectedApplication.aiScore}%
                          </span>
                        </div>
                        {selectedApplication.aiRecommendation && (
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">Recommendation:</span>
                            <span className={`text-sm px-2 py-1 rounded-full ${getRecommendationColor(selectedApplication.aiRecommendation)}`}>
                              {selectedApplication.aiRecommendation}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* AI Category Scores */}
                      {selectedApplication.aiCategoryScores && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Category Scores</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Object.entries(selectedApplication.aiCategoryScores).map(([category, score]) => (
                              <div key={category} className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-xs text-gray-600 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</div>
                                <div className="text-sm font-semibold text-gray-900">{score}%</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI Details */}
                      {selectedApplication.aiDetails && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">AI Analysis Details</h5>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedApplication.aiDetails}</p>
                        </div>
                      )}

                      {/* AI Highlights */}
                      {selectedApplication.aiHighlights && selectedApplication.aiHighlights.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Key Highlights</h5>
                          <ul className="space-y-1">
                            {selectedApplication.aiHighlights.map((highlight, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-600">{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* AI Concerns */}
                      {selectedApplication.aiConcerns && selectedApplication.aiConcerns.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Areas of Concern</h5>
                          <ul className="space-y-1">
                            {selectedApplication.aiConcerns.map((concern, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-600">{concern}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* AI Key Points */}
                      {selectedApplication.aiKeyPoints && selectedApplication.aiKeyPoints.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Key Points</h5>
                          <ul className="space-y-1">
                            {selectedApplication.aiKeyPoints.map((point, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <Star className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-600">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* AI Technical Skills */}
                      {selectedApplication.aiTechnicalSkills && selectedApplication.aiTechnicalSkills.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Technical Skills</h5>
                          <div className="flex flex-wrap gap-2">
                            {selectedApplication.aiTechnicalSkills.map((skill, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI Next Steps */}
                      {selectedApplication.aiNextSteps && selectedApplication.aiNextSteps.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Recommended Next Steps</h5>
                          <ul className="space-y-1">
                            {selectedApplication.aiNextSteps.map((step, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm text-gray-600">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Resume Download */}
                {selectedApplication.resumeUrl && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Resume</h4>
                    <button
                      onClick={() => handleDownloadResume(selectedApplication.resumeUrl)}
                      className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download size={16} />
                      <span>Download Resume</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ApplicationsSection.propTypes = {
  applications: PropTypes.array,
  jobId: PropTypes.string,
};

export default ApplicationsSection; 