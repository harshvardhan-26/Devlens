import { useEffect, useState } from "react";
import { ArrowLeft, GitBranch, Layers3 } from "lucide-react";
import { Link, useParams, useLocation } from "react-router-dom"; // ✅ FIX
import FeedbackSection from "../components/FeedbackSection.jsx";
import PageShell from "../components/PageShell.jsx";
import RoadmapList from "../components/RoadmapList.jsx";
import ScoreCard from "../components/ScoreCard.jsx";
import { getProject } from "../lib/api.js";
import { useAuth } from "../state/AuthContext.jsx";

export default function Analysis() {
  const { id } = useParams();
  const location = useLocation(); // ✅ FIX
  
  const { user } = useAuth();

  const [project, setProject] = useState(location.state?.project || null); // ✅ FIX
  const [loading, setLoading] = useState(!location.state?.project);
  

  // ✅ FETCH ONLY IF STATE NOT PRESENT
  useEffect(() => {
    if (project) return;

    async function fetchProject() {
      try {
        setLoading(true);

        const data = await getProject(id);

        setProject(
          data.project,
          );
      } catch (err) {
        console.error("ERROR FETCHING PROJECT:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id, project]);

  if (loading) {
    return (
      <PageShell className="text-slate-400">
        Loading analysis...
      </PageShell>
    );
  }

  if (!project) {
    return (
      <PageShell className="text-slate-400">
        Analysis not found.
      </PageShell>
    );
  }

  const feedback = project.feedback || {};

  return (
    <PageShell className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>

          <h1 className="text-5xl font-black tracking-tight">
            {project.projectName}
          </h1>

          <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Layers3 size={15} />
              {project.projectType}
            </span>

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-mint"
              >
                <GitBranch size={15} />
                GitHub repository
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Score */}
      <ScoreCard
        score={feedback.score ?? project.score ?? 0}
        readiness={feedback.jobReadiness ?? project.jobReadiness}
      />
      
      {/* Sections */}
      <div className="grid gap-5 lg:grid-cols-3">
        <FeedbackSection title="Project Quality">
          {feedback.codeQuality || "No data available"}
        </FeedbackSection>

        <FeedbackSection title="Architecture">
          {feedback.architecture || "No data available"}
        </FeedbackSection>

        <FeedbackSection title="UI/UX Feedback">
          {feedback.uiFeedback || "No data available"}
        </FeedbackSection>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <FeedbackSection title="Strengths">
          <div className="grid gap-3">
            {feedback.strengths.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"
              >
                <div className="flex items-start gap-3">
                  {/* <span>✅</span> */}
                  <span>{item}</span>
                </div>
              </div>
            ))}
          </div>
        </FeedbackSection>

        <FeedbackSection title="Weaknesses">
          <div className="grid gap-3">
            {feedback.weaknesses.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4"
              >
                <div className="flex items-start gap-3">
                  {/* <span>⚠️</span> */}
                  <span>{item}</span>
                </div>
              </div>
            ))}
          </div>
        </FeedbackSection>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <FeedbackSection title="Improvement Roadmap">
          <div className="space-y-3">
  {feedback.improvements.map((item, index) => (
    <div
      key={index}
      className="flex gap-4 rounded-xl border border-white/10 p-4"
    >
      <div className="text-mint font-bold">
        {index + 1}
      </div>

      <div>{item}</div>
    </div>
  ))}
</div>
        </FeedbackSection>

        <FeedbackSection title="Next Steps">
          <div className="space-y-3">
  {feedback.nextSteps.map((item, index) => (
    <div
      key={index}
      className="flex gap-4 rounded-xl border border-white/10 p-4"
    >
      <div className="text-mint font-bold">
        {index + 1}
      </div>

      <div>{item}</div>
    </div>
  ))}
</div>
        </FeedbackSection>
      </div>

      <details className="glass rounded-2xl p-6">
  <summary className="cursor-pointer text-lg font-semibold text-white">
    Files Analyzed ({project?.analyzedFiles?.length || 0})
  </summary>

  {project?.analyzedFiles?.length ? (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {project.analyzedFiles.map((file) => (
        <div
          key={file.path}
          className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-mint/30 hover:bg-white/[0.05]"
        >
          <div className="truncate font-medium text-slate-200">
            {file.path}
          </div>

          <div className="mt-2 text-xs text-slate-500">
            {file.language} • {Math.round(file.bytes / 1024)} KB
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="mt-4 text-slate-500">
      No files available
    </p>
  )}
</details>
    </PageShell>
  );
}