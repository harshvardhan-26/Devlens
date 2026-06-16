import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import { analyzeGithub, analyzeUpload } from "../lib/api.js";
import { useAuth } from "../state/AuthContext.jsx";
import {
  FileUp,
  Github,
  Loader2,
  Radar,
  SendHorizontal,
  Brain,
  BarChart3,
  Trophy,
  Rocket,
  Mail,
  Linkedin
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [githubUrl, setGithubUrl] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGithub(event) {
    event.preventDefault();
    
    setLoading(true);
    setError("");
    try {
      const data = await analyzeGithub(githubUrl);

      if (!data?.project?._id) {
        throw new Error(
          data?.error ||
          "GitHub repository could not be analyzed."
        );
      }

      navigate(`/analysis/${data.project._id}`, {
        state: { project: data.project, refresh: true }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload() {
    if (!files.length) return;
    setLoading(true);
    setError("");
    if (files.length > 30) {
  setError(
    "Maximum 30 files allowed."
      );
      return;
    }
    const maxSize = 2 * 1024 * 1024; // 2MB

    const oversized = files.some(
      file => file.size > maxSize
    );

    if (oversized) {
      setError(
        "Each file must be under 2MB"
      );
      return;
    }

    try {
      const data = await analyzeUpload(files, user);
      
      navigate(`/analysis/${data.project._id}`, {
  state: { project: data.project, refresh: true }
});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell className="space-y-10"> 
      <section className="grid gap-8 lg:grid-cols-[1fr_0.82fr]">
        <div className="py-8">
          {/* <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-blue">
            <Radar size={17} />
            Project-level AI mentor
          </div> */}
          <h1 className="font-['Space_Grotesk'] text-6xl font-bold">
            Analyze GitHub Projects
            <span className="block bg-gradient-to-r from-mint via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Through An AI Lens
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            
            Submit a repository or source files. Devlens evaluates the full product: Project quality, architecture, UI/UX signal, usability, and a roadmap to raise your score.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-xl">
  <div className="glass rounded-xl p-4 text-center">
    <div className="text-2xl font-bold text-mint">
      100+
    </div>
    <div className="text-xs text-slate-400">
      Projects Analyzed
    </div>
  </div>

  <div className="glass rounded-xl p-4 text-center">
    <div className="text-2xl font-bold text-mint">
      30s
    </div>
    <div className="text-xs text-slate-400">
      Avg Analysis Time
    </div>
  </div>

  <div className="glass rounded-xl p-4 text-center">
    <div className="text-2xl font-bold text-mint">
      AI
    </div>
    <div className="text-xs text-slate-400">
      Mentor Feedback
    </div>
  </div>
</div>

          {/* <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["Mentor", "Specific critique, not generic linting."],
              ["Reviewer", "Architecture and quality risk checks."],
              ["Recruiter", "Portfolio readiness and hiring signal."]
            ].map(([title, body]) => (
              <motion.div whileHover={{ y: -3 }} key={title} className="glass rounded-lg p-4">
                <div className="text-lg font-bold tracking-tight">
  {title}
</div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
              </motion.div>
            ))}
          </div> */}
        </div>

        <div className="glass rounded-lg p-5 shadow-glow">
          <form onSubmit={handleGithub}>
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">GitHub repository</label>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3">
              <Github size={18} className="text-slate-500" />
              <input
                required
                value={githubUrl}
                onChange={(event) => setGithubUrl(event.target.value)}
                placeholder="https://github.com/owner/repo"
                className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-slate-600"
              />
            </div>
            <button
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-mint px-4 py-3 text-sm font-bold text-ink transition hover:bg-mint/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <SendHorizontal size={17} />
                  Analyze Repository
                </>
              )}
            </button>
            {loading && (
              <p className="mt-3 text-center text-sm text-slate-400">
                Extracting files and generating AI feedback
              </p>
            )}
          </form>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-slate-600">
            <span className="h-px flex-1 bg-white/10" />
            or upload files
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <label className="grid cursor-pointer place-items-center rounded-lg border border-dashed border-white/15 bg-white/[0.03] px-4 py-8 text-center transition hover:border-mint/60">
            <FileUp className="mb-3 text-mint" size={24} />
            <span className="font-medium">Choose source files</span>
            <span className="mt-1 text-sm text-slate-500">JS, TS, Python, HTML, CSS, JSON, README</span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(event) => setFiles(event.target.files ? [...event.target.files] : [])}
            />
          </label>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="truncate text-sm text-slate-500">{files.length ? `${files.length} files selected` : "No files selected"}</span>
            <button
              onClick={handleUpload}
              disabled={!files.length || loading}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Uploading & Analyzing...
                </>
              ) : (
                "Analyze Upload"
              )}
            </button>
            
          </div>
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "AI Code Review",
            desc: "Identify strengths, weaknesses, and coding best practices."
          },
          {
            title: "Architecture Analysis",
            desc: "Understand project structure and scalability concerns."
          },
          {
            title: "Portfolio Scoring",
            desc: "Measure how recruiter-ready your projects are."
          },
          {
            title: "AI Mentor Guidance",
            desc: "Receive personalized recommendations to improve."
          }
        ].map((item) => (
          <div
            key={item.title}
            className="glass rounded-xl p-6"
          >
            <h3 className="font-semibold text-lg">
              {item.title}
            </h3>

            <p className="mt-3 text-slate-400 text-sm leading-6">
              {item.desc}
            </p>
          </div>
        ))}
      </section>
       */}

      <section id="about" className="glass rounded-3xl p-10">
  <div className="grid gap-10 lg:grid-cols-2 items-center">

    <div>
      <div className="inline-flex items-center rounded-full border border-mint/20 px-3 py-1 text-xs font-semibold text-mint">
        ABOUT THE PLATFORM
      </div>

      <h2 className="mt-5 text-4xl font-extrabold tracking-tight">
        More Than A Code Analyzer
      </h2>

      <p className="mt-5 text-lg leading-8 text-slate-400">
        Devlens acts like a software engineer,
        technical reviewer, and mentor combined into one platform.
      </p>

      <p className="mt-4 text-slate-400 leading-8">
        Instead of simply checking syntax or linting issues,
        the platform evaluates architecture, maintainability,
        recruiter readiness, scalability, and overall project quality.
      </p>
    </div>

    <div className="grid gap-4">

      <div className="glass rounded-2xl p-5">
        <h3 className="font-bold text-lg">
          AI Code Review
        </h3>
        <p className="mt-2 text-slate-400">
          Identify strengths, weaknesses and coding best practices.
        </p>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="font-bold text-lg">
          Architecture Insights
        </h3>
        <p className="mt-2 text-slate-400">
          Understand scalability, structure and engineering quality.
        </p>
      </div>

      {/* <div className="glass rounded-2xl p-5">
        <h3 className="font-bold text-lg">
          Recruiter Readiness
        </h3>
        <p className="mt-2 text-slate-400">
          Measure how portfolio-worthy your projects really are.
        </p>
      </div> */}

      <div className="glass rounded-2xl p-5">
        <h3 className="font-bold text-lg">
          AI Mentor Guidance
        </h3>
        <p className="mt-2 text-slate-400">
          Get personalized recommendations for continuous growth.
        </p>
      </div>

    </div>

  </div>
</section>

      <section id="how-it-works" className="glass rounded-3xl p-10">
  <div className="mb-10">
    <span className="text-mint text-sm font-semibold uppercase tracking-[0.2em]">
      Workflow
    </span>

    <h2 className="mt-3 text-4xl font-extrabold tracking-tight">
      How Devlens Works
    </h2>

    <p className="mt-4 text-slate-400 max-w-2xl">
      Submit a project and receive professional AI-powered
      engineering feedback within seconds.
    </p>
  </div>

  <div className="grid lg:grid-cols-4 gap-8">

    {[
      {
        number: "01",
        title: "Submit Repository",
        text: "Paste a GitHub repository URL or upload source files."
      },
      {
        number: "02",
        title: "AI Analysis",
        text: "Gemini evaluates architecture, quality and structure."
      },
      {
        number: "03",
        title: "Receive Insights",
        text: "Get strengths, weaknesses and improvement suggestions."
      },
      {
        number: "04",
        title: "Improve Portfolio",
        text: "Track growth and increase recruiter readiness."
      }
    ].map((step) => (
      <div
        key={step.number}
        className="relative"
      >
        <div className="text-5xl font-black text-mint/20">
          {step.number}
        </div>

        <h3 className="mt-4 text-xl font-bold">
          {step.title}
        </h3>

        <p className="mt-3 text-slate-400 leading-7">
          {step.text}
        </p>
      </div>
    ))}

  </div>
</section>

      
      
      
      <section className="glass rounded-3xl p-12 text-center">
  <Rocket
    size={50}
    className="mx-auto mb-6 text-mint"
  />

  <h2 className="text-4xl font-bold">
    Ready To Improve Your Projects?
  </h2>

  <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
    Analyze your GitHub repositories and receive
    professional AI feedback, architecture reviews,
    portfolio scoring, and personalized mentor guidance.
  </p>

  <button
    onClick={() =>
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    }
    className="mt-8 rounded-xl bg-mint px-8 py-4 font-bold text-black hover:bg-mint/90"
  >
    Start Analysis
  </button>
</section>

      <footer className="border-t border-white/10 pt-12">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">

          <div>
            <h3 className="text-xl font-bold">
              Devlens
            </h3>

            <p className="mt-4 text-sm text-slate-400 leading-7">
              See your code through an AI lens.

              Devlens helps developers build stronger projects,
              improve portfolio quality, and become more
              recruiter-ready with AI-powered reviews.
            </p>

            <div className="mt-4 inline-flex rounded-full border border-mint/30 px-3 py-1 text-xs text-mint">
              Powered by Gemini AI
            </div>
          </div>

          <div>
            <h4 className="
uppercase
tracking-[0.18em]
text-xs
font-bold
text-slate-500
mb-5
">
              Product
            </h4>

            <ul className="space-y-2">

            <li>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-slate-300 hover:text-mint transition-colors duration-200"
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/profile"
                className="text-sm font-medium text-slate-300 hover:text-mint transition-colors duration-200"
              >
                Profile
              </Link>
            </li>

          </ul>
          </div>

          <div>
            <h4 className="
uppercase
tracking-[0.18em]
text-xs
font-bold
text-slate-500
mb-5
">
              Resources
            </h4>

            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-sm font-medium text-slate-300 hover:text-mint transition-colors duration-200">
                  About Project
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-mint transition-colors duration-200">
                  How It Works
                </a>
              </li>
              {/* <li>Contact</li> */}
            </ul>
          </div>

          <div>
  <h4
    className="
uppercase
tracking-[0.18em]
text-xs
font-bold
text-slate-500
mb-5
"
  >
    Legal
  </h4>

  <ul className="space-y-3">
    <li>
      <Link
        to="/privacy"
        className="
text-sm
font-medium
text-slate-300
hover:text-mint
transition-colors
duration-200
"
      >
        Privacy Policy
      </Link>
    </li>

    <li>
      <Link
        to="/terms"
        className="
text-sm
font-medium
text-slate-300
hover:text-mint
transition-colors
duration-200
"
      >
        Terms & Conditions
      </Link>
    </li>
  </ul>
</div>

          <div>
  <h4 className="
uppercase
tracking-[0.18em]
text-xs
font-bold
text-slate-500
mb-5
">
    Contact
  </h4>

  <div className="
space-y-3 text-sm
font-medium
text-slate-300

">

    <a
      href="mailto:vermaharsh8630@gmail.com"
      className="flex items-center gap-2 hover:text-mint transition"
    >
      <Mail size={16} />
      Email
    </a>

    <a
      href="https://github.com/harshvardhan-26"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 hover:text-mint transition"
    >
      <Github size={16} />
      GitHub
    </a>

    <a
      href="https://linkedin.com/in/harshvardhan-14465a377"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 hover:text-mint transition"
    >
      <Linkedin size={16} />
      LinkedIn
    </a>

  </div>
</div>

        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between text-sm text-slate-500">
          <span>
            © 2026 Devlens
          </span>

          <span>
            Built with ❤️ by Harshvardhan
          </span>
        </div>
      </footer>
    </PageShell>
  );
}
