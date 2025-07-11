import { Users, Eye, Download } from "lucide-react";
import PropTypes from "prop-types";

const ApplicationsSection = ({ applications }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
          <p className="text-gray-600">View job applications and candidates</p>
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
                <div key={application._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{application.candidateName || 'Anonymous'}</h4>
                      <p className="text-sm text-gray-500">{application.jobTitle}</p>
                      <p className="text-xs text-gray-400">Applied {new Date(application.appliedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600" title="View Application">
                      <Eye size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-purple-600" title="Download Resume">
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
    </div>
  );
};

ApplicationsSection.propTypes = {
  applications: PropTypes.array,
};

export default ApplicationsSection; 