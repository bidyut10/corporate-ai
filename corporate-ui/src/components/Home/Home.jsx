import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ImageGrid from "../Libraries/ImageGrid";
import ImageColumn from "../Libraries/ImageColumn";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div id="home" className="py-12 mt-10 md:mt-20">
      <main className="max-w-7xl mx-auto px-4">
        <h1 className="text-[32px] md:text-5xl text-[#181818] mt-10 leading-relaxed text-center font-normal">
          Simplify Hiring Decisions <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent leading-relaxed">
            With Intelligent Resume Matching
          </span>
        </h1>
        <p className="text-xl text-[#201f20] leading-loose md:leading-normal mt-4 mb-8 text-center md:px-40">
          Create job postings in minutes and let AI do the heavy lifting. From
          early-stage startups to enterprise HR teams, our platform analyzes
          resumes, scores candidates by relevance, and delivers smart,
          data-backed insights—so you can focus on hiring the right talent,
          faster.
        </p>

        <div className="flex flex-col items-center gap-8 justify-center w-full">
          <div className="space-y-6 w-full md:w-fit">
            <div className="flex flex-col justify-center items-center sm:flex-row gap-6 w-full">
              <div className="inline-block rounded-[12px] bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-[1.5px] w-full md:w-fit">
                <button
                  className="bg-black text-white px-6 py-3 rounded-[11px] flex items-center gap-2 justify-center hover:bg-[#181818] transition-all w-full md:w-fit"
                  onClick={() => navigate("/login")}
                >
                  <p className="leading-2 text-lg">Try it out for free</p>
                  <ArrowUpRight size={24} strokeWidth={1.4} />
                </button>
              </div>

              <ImageGrid />
            </div>
          </div>
        </div>
        <ImageColumn />
      </main>
    </div>
  );
};

export default Home;
