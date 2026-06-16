import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import { getProjects } from "../lib/api.js";
import { useAuth } from "../state/AuthContext.jsx";
import {
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
// import { useLocation } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const THEME_COLORS = [
  "#34d399", // emerald (main brand)
  "#10b981", // darker emerald
  "#6ee7b7", // light mint
  "#60a5fa", // soft blue accent
  "#818cf8", // subtle indigo
  "#f472b6"  // soft pink (minimal use)
];

  
  useEffect(() => {
  async function loadProjects() {
    try {
      setLoading(true);

      const data = await getProjects();
      

      setProjects(
        Array.isArray(data.projects) ? [...data.projects] : []
      );
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  // ✅ always load on mount + route change
  loadProjects();

  // ✅ force refresh when coming back with state
  if (location.state?.refresh) {
    loadProjects();
  }

}, [location.pathname, location.state]);

  

  // ✅ 3. 👉 ADD YOUR TREND HERE
  const trend = useMemo(() => {
  if (projects.length < 4) return { 
    text: "Not enough data",
    icon: Minus
  };

  const scores = projects.map(p => p.score);

  const midpoint = Math.floor(scores.length / 2);

  const older =
    scores.slice(0, midpoint);

  const recent =
    scores.slice(midpoint);

  const olderAvg =
    older.reduce((a, b) => a + b, 0) /
    older.length;

  const recentAvg =
    recent.reduce((a, b) => a + b, 0) /
    recent.length;

  const diff = recentAvg - olderAvg;

  if (diff > 5)
    return {
      text: "Improving",
      icon: TrendingUp
    };

  if (diff < -5)
    return {
      text: "Declining",
      icon: TrendingDown
    };

  return {
    text: "Stable",
    icon: Minus
  };
}, [projects]);

  // ✅ 4. 👉 ADD YOUR PREDICTION HERE
  const prediction = useMemo(() => {
  if (projects.length < 4)
    return "Analyze more projects to unlock predictions.";

  const recentScores =
    projects.slice(-5).map(p => p.score);

  const average =
    recentScores.reduce((a, b) => a + b, 0) /
    recentScores.length;

  if (average >= 85)
    return "You're performing at a strong senior level.";

  if (average >= 75)
    return "You're progressing steadily toward advanced projects.";

  if (average >= 60)
    return "Focus on consistency and project quality.";

  return "Build more complete projects to improve scores.";
}, [projects]);

  // 📊 Average Score
  const average = useMemo(() => {
    if (!projects.length) return 0;

    const total = projects.reduce((sum, project) => {
      const score = project.feedback?.score ?? project.score ?? 0;
      return sum + score;
    }, 0);

    return Math.round(total / projects.length);
  }, [projects]);

  // 📊 Score Chart
  const scoreData = useMemo(() => {
    return projects.map((p) => ({
      name: p.projectName.slice(0, 10),
      score: p.feedback?.score ?? p.score ?? 0,
    }));
  }, [projects]);

  // 🥧 Project Type Chart
  const typeData = useMemo(() => {
    const count = {};
    projects.forEach((p) => {
      count[p.projectType] = (count[p.projectType] || 0) + 1;
    });
    return Object.keys(count).map((k) => ({
      name: k,
      value: count[k],
    }));
  }, [projects]);

  // 🟣 Readiness Chart
  const readinessData = useMemo(() => {
    const count = {};
    projects.forEach((p) => {
      count[p.jobReadiness] = (count[p.jobReadiness] || 0) + 1;
    });
    return Object.keys(count).map((k) => ({
      name: k,
      value: count[k],
    }));
  }, [projects]);

  const skillData = useMemo(() => {
  if (!projects.length) return [];

  const latest = projects[projects.length - 1];
  const feedback = latest.feedback || {};

  return [
    {
      subject: "Code",
      value: feedback.codeQuality ? 80 : 60
    },
    {
      subject: "Architecture",
      value: feedback.architecture ? 75 : 60
    },
    {
      subject: "UI/UX",
      value: feedback.uiFeedback ? 70 : 60
    },
    {
      subject: "Logic",
      value: (feedback.strengths?.length || 0) * 10 + 50
    },
    {
      subject: "Completeness",
      value: latest.score || 60
    }
  ];
}, [projects]);

  // 🔴 Strength vs Weakness
  const swData = useMemo(() => {
  let strengths = 0;
  let weaknesses = 0;

  projects.forEach(p => {
    strengths += p.feedback?.strengths?.length || 0;
    weaknesses += p.feedback?.weaknesses?.length || 0;
  });

  const total = strengths + weaknesses;

  // fallback (avoid divide by 0)
  if (total === 0) {
    return [
      { name: "Strengths", value: 50 },
      { name: "Weaknesses", value: 50 }
    ];
  }

  const strengthPercent = Math.round((strengths / total) * 100);
  const weaknessPercent = 100 - strengthPercent; // ensures total = 100

  return [
    { name: "Strengths", value: strengthPercent },
    { name: "Weaknesses", value: weaknessPercent }
  ];
}, [projects]);
    const TrendIcon = trend.icon;

  return (
  <PageShell className="space-y-8">
    
    {/* HEADER */}
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Project history
        </h1>
        <p className="mt-2 text-slate-400">
          Track your growth and analyze your coding journey.
        </p>
      </div>

      {/* Average Score Card */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl px-6 py-4 shadow-xl">
        <div className="text-xs uppercase tracking-wider text-slate-400">
          Average Score
        </div>
        <div className="mt-1 text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
          {average}
        </div>
      </div>
    </div>

    {/* INSIGHTS */}
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-lg">
    <h2 className="text-lg font-semibold">
      Insights
    </h2>

    <div className="mt-2 flex items-center gap-2">
      <TrendIcon size={16} />

      <span className="text-white font-medium">
        {trend.text}
      </span>
    </div>

    <p className="mt-2 text-sm text-slate-400">
      Prediction:
      <span className="ml-1 text-white font-medium">
        {prediction}
      </span>
    </p>
  </div>

    {/* CHARTS */}
    {projects.length > 0 && (
      <div className="grid gap-6 md:grid-cols-2">

        {/* Score Trend */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-lg">
          <h2 className="mb-4 font-semibold">Score Trend</h2>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={scoreData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.5} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />

                <Tooltip
                    contentStyle={{
                      background: "#020617",
                      border: "1px solid #1e293b",
                      borderRadius: "10px",
                      color: "#e2e8f0"
                    }}
                  />

                {/* 👇 ADD ANIMATION HERE */}
                <Bar
                  dataKey="score"
                  fill="url(#scoreGradient)"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive
                  animationDuration={900}
                  animationEasing="ease-out"
                />
              </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Project Types */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-lg">
          <h2 className="mb-4 font-semibold">Project Types</h2>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={typeData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                innerRadius={45} // slightly bigger hole = cleaner look

                isAnimationActive
                animationDuration={800}
                animationEasing="ease-out"
              >
                {typeData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={THEME_COLORS[i % THEME_COLORS.length]}
                    stroke="transparent" // 🔥 removed black border
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Readiness */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-6 shadow-xl">
          <h2 className="mb-4 font-semibold">Skill Analysis</h2>

          <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={skillData}>
            
            {/* 🌈 Gradient */}
            <defs>
              <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
              </linearGradient>
            </defs>

            {/* 🧊 Grid */}
            <PolarGrid stroke="#1e293b" strokeDasharray="3 3" />

            {/* 🎯 Labels */}
            <PolarAngleAxis
              dataKey="subject"
              stroke="#cbd5f5"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />

            {/* 📏 Radius */}
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              stroke="#334155"
              tick={{ fill: "#64748b", fontSize: 10 }}
            />

            {/* 🔥 MAIN RADAR */}
            <Radar
              name="Skill"
              dataKey="value"
              stroke="#34d399"
              fill="url(#radarGradient)"
              fillOpacity={0.6}
              strokeWidth={2}
              dot={{ r: 3, fill: "#34d399" }}
              activeDot={{
                r: 6,
                fill: "#10b981",
                stroke: "#fff",
                strokeWidth: 2
              }}
              isAnimationActive
              animationDuration={900}
            />
          </RadarChart>
        </ResponsiveContainer>
        </div>

        {/* Strength vs Weakness */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-lg">
          <h2 className="mb-4 font-semibold">Strength vs Weakness</h2>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={swData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                innerRadius={50} // slightly bigger hole = cleaner look

                isAnimationActive
                animationDuration={800}
                animationEasing="ease-out"
              >
                {typeData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={THEME_COLORS[i % THEME_COLORS.length]}
                    stroke="transparent" // 🔥 removed black border
                  />
                ))}
              </Pie>
              
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    )}

    {/* PROJECT LIST */}
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden shadow-lg">
      {loading ? (
        <div className="p-6 text-slate-400">Loading projects...</div>
      ) : projects.length > 0 ? (
        <div className="divide-y divide-white/10">
          {projects.map((project) => {
            const score = project.feedback?.score ?? project.score ?? 0;

            return (
              <Link
                key={project._id}
                to={`/analysis/${project._id}`}
                state={{ project, feedback: project.feedback }}
                className="grid gap-4 p-5 transition hover:bg-white/[0.05] md:grid-cols-[1fr_150px_120px_140px]"
              >
                <div>
                  <div className="font-semibold">{project.projectName}</div>
                  <div className="mt-1 truncate text-sm text-slate-500">
                    {project.githubUrl || "Uploaded files"}
                  </div>
                </div>

                <div className="text-sm text-slate-400">
                  {project.projectType}
                </div>

                <div className="font-bold text-emerald-400">
                  {score}/100
                </div>

                <div className="text-sm text-slate-500">
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center">
          <h2 className="text-lg font-semibold">No analyses yet</h2>
          <p className="mt-2 text-sm text-slate-500">
            Analyze a GitHub repo to start your journey.
          </p>

          <Link
            to="/"
            className="mt-5 inline-flex rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 px-5 py-2 text-sm font-bold text-black shadow-md"
          >
            Analyze a project
          </Link>
        </div>
      )}
    </div>

  </PageShell>
);
}