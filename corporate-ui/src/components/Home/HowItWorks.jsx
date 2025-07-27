import { useState, useEffect } from "react";
import {
  FileText,
  BarChart3,
  Users,
  Brain,
  Sparkles,
  ChevronRight,
  Clock,
  Zap,
  TrendingUp,
  Award,
} from "lucide-react";

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Auto-advance through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const howItWorksSteps = [
    {
      icon: <FileText className="w-6 h-6 text-white" strokeWidth={1.5}/>,
      title: "Create Job Posting",
      description: "AI-powered job builder with smart suggestions",
      color: "from-purple-500 to-purple-700",
      bgColor: "bg-purple-50",
      accentColor: "text-purple-600",
      stats: "2 mins",
      statIcon: <Clock className="w-4 h-4" strokeWidth={1.5} />,
      visual: (
        <div className="bg-white p-4 rounded-xl shadow-md border border-purple-100 h-52">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-3 h-3 text-purple-600" />
              </div>
              <div className="text-sm font-normal text-neutral-900">
                Frontend Developer
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-3/4 transition-all duration-1000"></div>
              </div>
              <div className="text-xs text-neutral-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI Writing: 75% complete
              </div>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-1 bg-purple-200 rounded-full flex-1">
                  <div
                    className={`h-1 bg-purple-500 rounded-full transition-all duration-500 ${
                      i <= 3 ? "w-full" : "w-1/2"
                    }`}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <Users className="w-6 h-6 text-white" strokeWidth={1.5}/>,
      title: "Collect Applications",
      description: "Auto-parsed resumes with organized candidate data",
      color: "from-pink-500 to-pink-700",
      bgColor: "bg-pink-50",
      accentColor: "text-pink-600",
      stats: "Auto-sync",
      statIcon: <Zap className="w-4 h-4" strokeWidth={1.5} />,
      visual: (
        <div className="bg-white p-4 rounded-xl shadow-md border border-pink-100 h-52">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-normal text-neutral-900">
                Applications
              </div>
              <div className="text-xs text-pink-600 bg-pink-100 px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12 today
              </div>
            </div>
            <div className="space-y-2">
              {[
                {
                  name: "Sarah Chen",
                  score: 94,
                  color: "bg-green-100 text-green-600",
                },
                {
                  name: "Mike Johnson",
                  score: 88,
                  color: "bg-blue-100 text-blue-600",
                },
                {
                  name: "Lisa Park",
                  score: 82,
                  color: "bg-orange-100 text-orange-600",
                },
              ].map((candidate, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${candidate.color}`}
                    >
                      <Users className="w-3 h-3" />
                    </div>
                    <div className="text-xs text-neutral-700">
                      {candidate.name}
                    </div>
                  </div>
                  <div className="text-xs font-normal text-pink-600">
                    {candidate.score}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <Brain className="w-6 h-6 text-white" strokeWidth={1.5}/>,
      title: "AI Analysis",
      description: "Advanced resume analysis with compatibility scoring",
      color: "from-red-500 to-red-700",
      bgColor: "bg-red-50",
      accentColor: "text-red-600",
      stats: "< 5 sec",
      statIcon: <Zap className="w-4 h-4" strokeWidth={1.5} />,
      visual: (
        <div className="bg-white p-4 rounded-xl shadow-md border border-red-100 h-52">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                <Brain className="w-3 h-3 text-red-600" />
              </div>
              <div className="text-sm font-normal text-neutral-900">
                AI Processing
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: "Skills Match", value: 94, color: "bg-red-500" },
                { label: "Experience", value: 88, color: "bg-orange-500" },
                { label: "Culture Fit", value: 92, color: "bg-yellow-500" },
              ].map((metric, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-600">
                      {metric.label}
                    </span>
                    <span className="text-xs font-normal text-red-600">
                      {metric.value}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className={`h-1.5 ${metric.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${metric.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-white" strokeWidth={1.5}/>,
      title: "Smart Hiring",
      description: "Data-driven decisions with candidate insights",
      color: "from-indigo-500 to-indigo-700",
      bgColor: "bg-indigo-50",
      accentColor: "text-indigo-600",
      stats: "80% faster",
      statIcon: <TrendingUp className="w-4 h-4" strokeWidth={1.5} />,
      visual: (
        <div className="bg-white p-4 rounded-xl shadow-md border border-indigo-100 h-52">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-normal text-neutral-900">
                Top Candidates
              </div>
              <div className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3" />
                Ranked
              </div>
            </div>
            <div className="space-y-2">
              {[
                {
                  name: "Sarah Chen",
                  score: 94,
                  rank: 1,
                  color: "bg-green-500",
                },
                {
                  name: "Mike Johnson",
                  score: 88,
                  rank: 2,
                  color: "bg-blue-500",
                },
                {
                  name: "Lisa Park",
                  score: 82,
                  rank: 3,
                  color: "bg-orange-500",
                },
              ].map((candidate, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${candidate.color}`}
                    >
                      {candidate.rank}
                    </div>
                    <div className="text-xs text-neutral-700">
                      {candidate.name}
                    </div>
                  </div>
                  <div className="text-xs font-normal text-indigo-600">
                    {candidate.score}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div id="how_it_works" className="min-h-screen">
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-normal text-purple-700">
                AI-Powered Hiring
              </span>
            </div>
            <h2 className="text-[32px] md:text-5xl text-[#181818] font-normal mb-6">
              How It{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent leading-relaxed">
                Works
              </span>
            </h2>
            <p className="text-xl text-[#201f20] md:px-40 leading-relaxed">
              Transform your hiring process with AI automation in four simple
              steps
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className={`relative group transition-all duration-500 ${
                  activeStep === index ? "transform scale-100" : ""
                }`}
              >
                <div
                  className={`h-full p-6 rounded-2xl border-2 transition-all duration-500 ${
                    activeStep === index
                      ? `${step.bgColor} border-${
                          step.accentColor.split("-")[1]
                        }-200 shadow-xl`
                      : "bg-white border-neutral-100 shadow-md hover:shadow-xl"
                  }`}
                >
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs font-normal text-neutral-400 tracking-wider">
                      STEP {index + 1}
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-normal flex items-center gap-1 ${
                        activeStep === index
                          ? step.accentColor
                          : "text-neutral-500"
                      } ${activeStep === index ? step.bgColor : "bg-neutral-50"}`}
                    >
                      {step.statIcon}
                      {step.stats}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mb-4">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md`}
                    >
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-normal text-[#181818] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#201f20] leading-relaxed mb-4 text-sm">
                    {step.description}
                  </p>

                  {/* Visual */}
                  <div className="mt-4">{step.visual}</div>
                </div>

                {/* Arrow */}
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 -right-3 z-10">
                    <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="shadow-md rounded-xl p-8 text-black bg-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-normal">2 min</div>
                <div className="text-sm">Job Creation</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-normal">100%</div>
                <div className="text-sm">Auto-Parsing</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-normal">5 sec</div>
                <div className="text-sm">AI Analysis</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-normal">80%</div>
                <div className="text-sm">Faster Hiring</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
