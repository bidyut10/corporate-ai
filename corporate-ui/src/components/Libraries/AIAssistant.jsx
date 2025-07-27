import { useState } from 'react';
import { Sparkles, Loader2, X, Send, Wand2 } from 'lucide-react';
import { generateJobDescription, enhanceJobDescription } from '../../apis/geminiService';
import PropTypes from 'prop-types';

const extractBodyContent = (html) => {
  const bodyStart = html.indexOf('<body>');
  const bodyEnd = html.indexOf('</body>');
  if (bodyStart !== -1 && bodyEnd !== -1) {
    return html.substring(bodyStart + 6, bodyEnd).trim();
  }
  // Fallback: remove <!DOCTYPE ...> and <html>...</html>
  return html
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<html[^>]*>/gi, '')
    .replace(/<\/html>/gi, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
    .replace(/<body[^>]*>/gi, '')
    .replace(/<\/body>/gi, '')
    .trim();
};

const AIAssistant = ({ onGenerate, onEnhance, currentDescription = "", jobDetails = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('generate'); // 'generate' or 'enhance'
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError("");
    try {
      const response = await generateJobDescription(prompt, jobDetails);
      if (response.success) {
        const cleanDescription = extractBodyContent(response.data.description);
        onGenerate(cleanDescription);
        setPrompt('');
        setIsOpen(false);
      } else {
        setError(response.message || 'Failed to generate description');
        alert('Failed to generate description: ' + response.message);
      }
    } catch (error) {
      console.error('Error generating description:', error);
      setError(error?.response?.data?.message || error.message || 'Failed to generate description. Please try again.');
      alert('Failed to generate description. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnhance = async () => {
    if (!prompt.trim() || !currentDescription.trim()) return;
    
    setLoading(true);
    setError("");
    try {
      const response = await enhanceJobDescription(currentDescription, prompt);
      if (response.success) {
        const cleanDescription = extractBodyContent(response.data.description);
        onEnhance(cleanDescription);
        setPrompt('');
        setIsOpen(false);
      } else {
        setError(response.message || 'Failed to enhance description');
        alert('Failed to enhance description: ' + response.message);
      }
    } catch (error) {
      console.error('Error enhancing description:', error);
      setError(error?.response?.data?.message || error.message || 'Failed to enhance description. Please try again.');
      alert('Failed to enhance description. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Create a comprehensive job description for a senior developer role",
    "Write a job description for a marketing manager position",
    "Generate a job description for a data analyst role",
    "Create a job description for a UX/UI designer position",
    "Write a job description for a project manager role"
  ];

  const handleQuickPrompt = (quickPrompt) => {
    setPrompt(quickPrompt);
    setMode('generate');
  };

  return (
    <>
      {/* AI Assistant Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        title="AI Assistant"
      >
        <Sparkles className="w-4 h-4" />
        <span className="hidden sm:inline">AI Assistant</span>
      </button>

      {/* AI Assistant Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">AI Job Description Assistant</h3>
                  <p className="text-sm text-neutral-600">Powered by Gemini AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Mode Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setMode('generate')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    mode === 'generate'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  <Wand2 className="w-4 h-4 inline mr-2" />
                  Generate New
                </button>
                <button
                  onClick={() => setMode('enhance')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    mode === 'enhance'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Enhance Existing
                </button>
              </div>

              {/* Quick Prompts */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-neutral-700 mb-3">Quick Prompts:</h4>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((quickPrompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(quickPrompt)}
                      className="px-3 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full transition-colors"
                    >
                      {quickPrompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {mode === 'generate' ? 'Describe the job you want to create:' : 'How would you like to enhance the description?'}
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    mode === 'generate'
                      ? "e.g., Create a job description for a Senior React Developer with 5+ years experience, focusing on modern web technologies and team leadership..."
                      : "e.g., Make it more detailed, add specific technical requirements, include company culture information..."
                  }
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none"
                  rows={4}
                />
              </div>

              {/* Job Details Preview (for generate mode) */}
              {mode === 'generate' && Object.keys(jobDetails).length > 0 && (
                <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
                  <h4 className="text-sm font-medium text-neutral-700 mb-2">Current Job Details:</h4>
                  <div className="text-sm text-neutral-600 space-y-1">
                    {jobDetails.title && <p><strong>Title:</strong> {jobDetails.title}</p>}
                    {jobDetails.location && <p><strong>Location:</strong> {jobDetails.location}</p>}
                    {jobDetails.skills && jobDetails.skills.length > 0 && (
                      <p><strong>Skills:</strong> {jobDetails.skills.join(', ')}</p>
                    )}
                    {jobDetails.jobType && <p><strong>Type:</strong> {jobDetails.jobType}</p>}
                  </div>
                </div>
              )}

              {/* Current Description Preview (for enhance mode) */}
              {mode === 'enhance' && currentDescription && (
                <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
                  <h4 className="text-sm font-medium text-neutral-700 mb-2">Current Description:</h4>
                  <div className="text-sm text-neutral-600 max-h-32 overflow-y-auto">
                    {currentDescription.substring(0, 300)}
                    {currentDescription.length > 300 && '...'}
                  </div>
                </div>
              )}
              {error && (
                <div className="mb-4 text-red-500 text-sm font-medium">
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-neutral-200">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={mode === 'generate' ? handleGenerate : handleEnhance}
                disabled={loading || !prompt.trim()}
                className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:bg-neutral-300 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {mode === 'generate' ? 'Generate' : 'Enhance'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

AIAssistant.propTypes = {
  onGenerate: PropTypes.func.isRequired,
  onEnhance: PropTypes.func.isRequired,
  currentDescription: PropTypes.string,
  jobDetails: PropTypes.object,
};

export default AIAssistant; 