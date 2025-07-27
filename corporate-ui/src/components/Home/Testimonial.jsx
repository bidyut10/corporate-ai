import { Quote, Heart, Sparkles } from "lucide-react";

const testimonials = [
  {
    name: "Sounak Agarwal",
    role: "Senior Developer at HCL",
    text: "The platform has transformed the way we hire. Our team can now post jobs quickly, and the AI does an exceptional job analyzing resumes and ranking candidates. It’s like having an expert recruiter assist every step of the way.",
    highlight: "expert recruiter assist",
    background: "#38bdf8",
    isQuote: true,
  },
  {
    name: "Rupam Sen",
    role: "Software Developer",
    text: "This AI-driven hiring tool makes it incredibly easy to maintain high standards during recruitment. It aligns perfectly with our company’s goals and helps us focus on top candidates without wasting time.",
    background: "#ffffff",
    logoText: "CODEGUARD",
    isLogo: true,
  },
  {
    name: "Jörg Schmidt",
    role: "Founder of CodeCraft Solutions",
    text: "We've seen major improvements in how fast and accurately we shortlist candidates. The system is intuitive, the insights are reliable, and it’s made our recruitment process far more efficient.",
    highlight: "The system is intuitive, the insights are reliable",
    background: "#fde047",
    isQuote: true,
  },
  {
    name: "MergeFlow",
    logoText: "MERGE FLOW",
    background: "#ffffff",
    isLogo: true,
  },
  {
    name: "Zain Khan",
    role: "Lead Engineer",
    background: "#4ade80",
    hasProfile: true,
  },
  {
    name: "CodePro",
    logoText: "C⌘DE PRO",
    background: "#ffffff",
    isLogo: true,
  },
  {
    name: "Ali Sharma",
    role: "Developer Advocate",
    background: "#fb923c",
    hasProfile: true,
  },
  {
    name: "Paula Echeverria",
    role: "Manager at DevHub Community",
    text: "This platform gives us the structure and intelligence we needed for modern hiring. From secure applicant handling to clear candidate overviews, it’s helped us scale our recruitment with ease.",
    highlight: "platform simplifies the process",
    background: "#c084fc",
    isQuote: true,
  },
  {
    name: "Bonnie Weber",
    role: "Senior QA Engineer",
    background: "#7dd3fc",
    hasProfile: true,
  },
  {
    name: "CodeBuddy",
    logoText: "〈/〉",
    background: "#ffffff",
    isLogo: true,
  },
];

const TestimonialCard = ({ item }) => {
  const baseClass = `rounded-xl p-6 h-full w-full overflow-hidden relative flex flex-col justify-between`;

  if (item.isQuote) {
    return (
      <div
        className={`${baseClass} text-black`}
        style={{ backgroundColor: item.background }}
      >
        <Quote className="absolute top-4 left-4 w-6 h-6 opacity-10" />
        <div className="z-10 mt-10">
          <p className="mb-4 text-sm">"{item.text}"</p>
          <p className="text-sm font-semibold">{item.name}</p>
          <p className="text-xs text-neutral-700">{item.role}</p>
        </div>
        <Sparkles className="w-4 h-4 mt-4 self-end" />
      </div>
    );
  }

  if (item.isLogo) {
    return (
      <div
        className={`${baseClass} bg-white shadow-xl flex items-center justify-center text-black font-bold text-xl pt-12`}
        style={{ backgroundColor: item.background }}
      >
        <p>{item.logoText}</p>
      </div>
    );
  }

  if (item.hasProfile) {
    return (
      <div
        className={`${baseClass} text-white`}
        style={{ backgroundColor: item.background }}
      >
        <div>
          <p className="font-semibold text-lg">{item.name}</p>
          <p className="text-sm">{item.role}</p>
        </div>
        <Heart className="w-4 h-4 mt-4 self-end" />
      </div>
    );
  }

  return null;
};

const TestimonialGrid = () => {
  return (
    <div id="testimonials" className="py-32 px-4 w-full max-w-7xl">
      <div className="space-y-3 mb-16">
        <p className="text-[32px] md:text-5xl text-center font-normal text-neutral-900 ">
          Powered by passion,
        </p>
        <h1 className="text-[32px] md:text-5xl text-[#181818] mt-10 leading-relaxed text-center font-normal">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent leading-relaxed">
            built for people{" "}
          </span>like you
        </h1>
        <p className="text-neutral-600 text-start md:text-center text-xl">
          Join the community of leading creators and get more out of your
          business.
        </p>
      </div>

      {/* First Row: 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
        {testimonials.slice(0, 3).map((item, index) => (
          <TestimonialCard key={index} item={item} />
        ))}
      </div>

      {/* Second Row: 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
        {testimonials.slice(3, 7).map((item, index) => (
          <TestimonialCard key={index + 3} item={item} />
        ))}
      </div>

      {/* Third Row: 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {testimonials.slice(7, 10).map((item, index) => (
          <TestimonialCard key={index + 7} item={item} />
        ))}
      </div>
    </div>
  );
};

export default TestimonialGrid;
