import { useState } from "react";
import {
  FileText,
  CheckCircle,
  Target,
  Brain,
  Download,
  MessageSquare,
  PieChart,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  Clock,
  Award,
} from "lucide-react";

const KeyFeatures = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-purple-600" strokeWidth={1} />,
      title: "AI Resume Matching",
      description:
        "Advanced machine learning algorithms analyze resumes and match candidates with precision scoring based on job requirements.",
      color: "purple",
      metric: "95% accuracy",
      visual: (
        <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-700">Match Score</span>
            <span className="text-2xl font-normal text-purple-600">92%</span>
          </div>
          <div className="h-3 bg-purple-100 rounded-full">
            <div className="h-3 bg-purple-500 rounded-full w-[92%] shadow-sm"></div>
          </div>
          <div className="flex items-center mt-3 text-xs text-purple-600">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>+12% from last month</span>
          </div>
        </div>
      ),
    },
    {
      icon: <FileText className="w-8 h-8 text-pink-600" strokeWidth={1} />,
      title: "Smart Job Post Builder",
      description:
        "Create compelling job postings with AI-powered suggestions, industry benchmarks, and optimization recommendations.",
      color: "pink",
      metric: "2x faster",
      visual: (
        <div className="mt-6 space-y-3">
          <div className="p-3 bg-pink-50 rounded-lg border border-pink-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-normal text-pink-700">
                AI Suggestions
              </span>
            </div>
            <div className="text-xs text-pink-600 bg-pink-100 px-3 py-2 rounded-md">
              "Consider adding React experience for better matches"
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-pink-600">
            <Clock className="w-3 h-3" strokeWidth={1} />
            <span>Average creation time: 3 minutes</span>
          </div>
        </div>
      ),
    },
    {
      icon: <Target className="w-8 h-8 text-red-600" strokeWidth={1} />,
      title: "Intelligent Candidate Scoring",
      description:
        "Get detailed relevance scores with breakdown analysis for skills, experience, and cultural fit assessment.",
      color: "red",
      metric: "Multi-factor",
      visual: (
        <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100">
          <div className="space-y-3">
            {[
              { label: "Technical Skills", score: 90, color: "bg-red-500" },
              { label: "Experience", score: 87, color: "bg-red-400" },
              { label: "Culture Fit", score: 84, color: "bg-red-300" },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-normal text-red-700">
                    {item.label}
                  </span>
                  <span className="text-xs font-normal text-red-600">
                    {item.score}%
                  </span>
                </div>
                <div className="h-2 bg-red-200 rounded-full">
                  <div
                    className={`h-2 ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <Download className="w-8 h-8 text-purple-600" strokeWidth={1} />,
      title: "Advanced PDF Parser",
      description:
        "Extract and structure data from any resume format with industry-leading accuracy and speed.",
      color: "purple",
      metric: "99.9% uptime",
      visual: (
        <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm border border-purple-100">
              <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                <FileText
                  className="w-4 h-4 text-purple-600"
                  strokeWidth={1}
                />
              </div>
              <div className="flex-1">
                <div className="text-xs font-normal text-gray-700">
                  resume.pdf
                </div>
                <div className="text-xs text-gray-500">
                  2.3 MB • Processing...
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex items-center gap-2 text-xs text-purple-600">
              <Zap className="w-3 h-3" strokeWidth={1} />
              <span>Parsed in 0.3 seconds</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: (
        <MessageSquare className="w-8 h-8 text-pink-600" strokeWidth={1} />
      ),
      title: "Team Collaboration Hub",
      description:
        "Share insights, add notes, and collaborate seamlessly with your hiring team for better decision making.",
      color: "pink",
      metric: "Real-time",
      visual: (
        <div className="mt-6 p-4 bg-pink-50 rounded-xl border border-pink-100">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm border border-pink-100">
              <div className="w-7 h-7 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-normal text-pink-600">S</span>
              </div>
              <div className="flex-1">
                <div className="text-xs font-normal text-gray-700">
                  Sarah Chen
                </div>
                <div className="text-xs text-gray-500">
                  Added a note • 2 min ago
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-pink-600">
              <Users className="w-3 h-3" strokeWidth={1} />
              <span>4 team members active</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <PieChart className="w-8 h-8 text-red-600" strokeWidth={1} />,
      title: "Analytics Dashboard",
      description:
        "Comprehensive candidate overview with sortable metrics, filters, and actionable hiring insights.",
      color: "red",
      metric: "360° view",
      visual: (
        <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center p-2 bg-white rounded-lg shadow-sm border border-red-100">
              <div className="text-lg font-normal text-red-600">47</div>
              <div className="text-xs text-gray-600">Applied</div>
            </div>
            <div className="text-center p-2 bg-white rounded-lg shadow-sm border border-red-100">
              <div className="text-lg font-normal text-red-600">12</div>
              <div className="text-xs text-gray-600">Qualified</div>
            </div>
            <div className="text-center p-2 bg-white rounded-lg shadow-sm border border-red-100">
              <div className="text-lg font-normal text-red-600">3</div>
              <div className="text-xs text-gray-600">Shortlisted</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-red-600">
            <Award className="w-3 h-3" strokeWidth={1} />
            <span>Top 25% conversion rate</span>
          </div>
        </div>
      ),
    },
  ];

  const getCardClasses = (feature, index, isHovered) => {
    const baseClasses =
      "group relative overflow-hidden transition-all duration-300 cursor-pointer p-8 rounded-2xl border-2 bg-white";

    if (isHovered) {
      switch (feature.color) {
        case "purple":
          return `${baseClasses} border-purple-200 shadow-xl shadow-purple-100/50 scale-105`;
        case "pink":
          return `${baseClasses} border-pink-200 shadow-xl shadow-pink-100/50 scale-105`;
        case "red":
          return `${baseClasses} border-red-200 shadow-xl shadow-red-100/50 scale-105`;
        default:
          return `${baseClasses} border-gray-200 shadow-xl scale-105`;
      }
    }

    return `${baseClasses} border-gray-200 hover:border-gray-300`;
  };

  const getIconClasses = (feature) => {
    switch (feature.color) {
      case "purple":
        return "p-4 rounded-xl bg-purple-50 group-hover:bg-purple-100 transition-all duration-300";
      case "pink":
        return "p-4 rounded-xl bg-pink-50 group-hover:bg-pink-100 transition-all duration-300";
      case "red":
        return "p-4 rounded-xl bg-red-50 group-hover:bg-red-100 transition-all duration-300";
      default:
        return "p-4 rounded-xl bg-gray-50 group-hover:bg-gray-100 transition-all duration-300";
    }
  };

  const getMetricClasses = (feature) => {
    switch (feature.color) {
      case "purple":
        return "text-sm font-normal px-3 py-1 rounded-full bg-purple-100 text-purple-700";
      case "pink":
        return "text-sm font-normal px-3 py-1 rounded-full bg-pink-100 text-pink-700";
      case "red":
        return "text-sm font-normal px-3 py-1 rounded-full bg-red-100 text-red-700";
      default:
        return "text-sm font-normal px-3 py-1 rounded-full bg-gray-100 text-gray-700";
    }
  };

  return (
    <div id="features" className="min-h-screen bg-white">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-normal text-purple-700">
                Powerful Features
              </span>
            </div>
            <h2 className="text-[32px] md:text-5xl text-[#181818] font-normal mb-6">
              Key{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent leading-relaxed">
                Features
              </span>
            </h2>
            <p className="text-xl text-[#201f20] md:px-40 leading-relaxed">
              Powerful tools designed to revolutionize your hiring process with
              cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={getCardClasses(
                  feature,
                  index,
                  hoveredFeature === index
                )}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={getIconClasses(feature)}>{feature.icon}</div>
                  <div className={getMetricClasses(feature)}>
                    {feature.metric}
                  </div>
                </div>

                <h3 className="text-xl font-normal text-black mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>

                <div
                  className={`transform transition-all duration-500 ${
                    hoveredFeature === index
                      ? "opacity-100 translate-y-0"
                      : "opacity-75 translate-y-2"
                  }`}
                >
                  {feature.visual}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default KeyFeatures;
