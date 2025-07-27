import {
  Brain,
  Users,
  Zap,
  FileText,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  Briefcase,
} from "lucide-react";

const ImageColumn = () => {
  return (
    <div className="flex flex-col justify-center sm:flex-row  items-end gap-4 pt-12 md:pt-0 pb-16 h-full md:h-[400px]">
      {/* Card 1 - AI Processing Power */}
      <div className="w-full md:w-1/5 h-[200px] md:h-full rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5"></div>
        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Brain className="text-blue-600 w-8 h-8" strokeWidth={1} />
            <div className="text-right">
              <div className="text-2xl font-normal text-neutral-800">98.7%</div>
              <div className="text-xs text-neutral-500">AI Accuracy</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-neutral-600">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              <span className="text-sm">Smart Matching</span>
            </div>
            <div className="text-xs text-neutral-600">Machine Learning</div>
          </div>
        </div>
      </div>

      {/* Card 2 - Resume Processing */}
      <div className="w-full md:w-1/5 h-[200px] md:h-4/5 rounded-xl bg-white border border-neutral-100 relative overflow-hidden shadow-md">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
        <div className="p-5 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <FileText className="text-neutral-600 w-7 h-7" strokeWidth={1} />
            <div className="text-right">
              <div className="text-xl font-normal text-neutral-800">12.5K</div>
              <div className="text-xs text-neutral-500">Resumes Processed</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Today</span>
              <span>+187</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-1">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-1 rounded-full w-4/5"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3 - Speed Performance */}
      <div className="w-full md:w-1/5 h-[200px] md:h-3/5 rounded-xl bg-white border border-neutral-100 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="relative z-10 p-4 h-full flex flex-col justify-center items-center text-center">
          <Zap className="text-orange-500 w-6 h-6 mb-2" strokeWidth={1} />
          <div className="text-lg font-normal text-neutral-800">3.2s</div>
          <div className="text-xs text-neutral-500">Avg. Analysis</div>
          <div className="mt-2 flex items-center">
            <Clock className="text-orange-500 w-3 h-3 mr-1" />
            <span className="text-xs text-neutral-700">Lightning Fast</span>
          </div>
        </div>
      </div>

      {/* Card 4 - Candidate Matching */}
      <div className="w-full md:w-1/5 h-[200px] md:h-4/5 rounded-xl bg-white border border-neutral-100 shadow-lg relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-purple-50 to-transparent"></div>
        <div className="p-5 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Target className="text-purple-600 w-5 h-5" strokeWidth={1} />
            </div>
            <div className="text-right">
              <div className="text-xl font-normal text-neutral-800">85%</div>
              <div className="text-xs text-neutral-500">Match Rate</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Perfect Match</span>
              <span className="text-purple-600 font-medium">42%</span>
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Good Match</span>
              <span className="text-green-600 font-medium">43%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 5 - Hiring Success */}
      <div className="w-full md:w-1/5 h-[200px] md:h-full rounded-xl bg-gradient-to-b from-white to-neutral-50 border-2 border-neutral-100 relative overflow-hidden shadow-md">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.05),transparent_50%)]"></div>
        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Users className="text-neutral-700 w-6 h-6" strokeWidth={1} />
            </div>
            <div className="text-right">
              <div className="text-2xl font-normal text-neutral-800">1.2K</div>
              <div className="text-xs text-neutral-500">Successful Hires</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-neutral-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span className="text-sm">Growing Fast</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                <span className="text-neutral-600">456</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="w-3 h-3 mr-1 text-blue-500" />
                <span className="text-neutral-600">89 Jobs</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-neutral-400 border-t border-neutral-200 pt-2">
            Last hire: 12 min ago
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageColumn;
