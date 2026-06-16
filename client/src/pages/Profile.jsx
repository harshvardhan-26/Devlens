import { useEffect, useMemo, useState } from "react";
import { Award, Code2, TrendingUp } from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import { getProjects } from "../lib/api.js";
import { useAuth } from "../state/AuthContext.jsx";
const API_URL = import.meta.env.VITE_API_URL;



export default function Profile() {
  
  const { user } = useAuth();
  
  const [projects, setProjects] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        
        const token = localStorage.getItem("token");

          

          const res = await fetch(`${API_URL}/api/summary`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          });

        

          const data = await res.json();

          
        

        
        setSummary(data.summary || null);
        
      } catch (err) {
        console.error("SUMMARY ERROR:", err);
      }
    }

    fetchSummary();
  }, []);

  useEffect(() => {
  async function loadProjects() {
    try {
      
      const data = await getProjects();
      
      setProjects(data.projects || []);
    } catch (err) {
      console.error("PROJECT ERROR:", err);
    }
  }

  loadProjects();
}, []);

  

  const skillSummary = useMemo(() => {
  if (!projects.length) {
    return {
      strengths: [],
      improvements: []
    };
  }

  const strengths = projects.flatMap(
    p => p.feedback?.strengths || []
  );

  const weaknesses = projects.flatMap(
    p => p.feedback?.weaknesses || []
  );

  const uniqueStrengths = [...new Set(strengths)];
  const uniqueWeaknesses = [...new Set(weaknesses)];
  
  return {
    strengths: uniqueStrengths.slice(0, 3),
    improvements: uniqueWeaknesses.slice(0, 3)
  };
}, [projects]);



const projectsAnalyzed = projects.length;





const averageScore =
  projects.length
    ? Math.round(
        projects.reduce(
          (sum, p) => sum + p.score,
          0
        ) / projects.length
      )
    : 0;

const bestScore =
  projects.length
    ? Math.max(...projects.map(p => p.score))
    : 0;


  function clean(text = "") {
  let t = text.replace(/\*\*/g, "");
  t = t.split(".")[0];
  return t;
}

 

  return (
    <PageShell className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="mt-2 text-slate-500">Your portfolio quality snapshot across analyzed projects.</p>
      </div>

      <section>
        <div className="glass p-6 rounded-lg flex items-center gap-4">
          <img
            src={user?.avatar}
            alt="avatar"
            className="w-16 h-16 rounded-full"
          />

          <div>
            <h2 className="text-xl font-bold">
              {user?.name || "User"}
            </h2>
            <p className="text-slate-400">
              {user?.email}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          [Code2, "Projects analyzed", projectsAnalyzed],
          [TrendingUp, "Average score", averageScore],
          [Award, "Best score", bestScore],
        ].map(([Icon, label, value]) => (
          <div key={label} className="glass rounded-lg p-5">
            <Icon className="mb-4 text-mint" size={20} />
            <div className="text-sm text-slate-500">{label}</div>
            <div className="mt-2 text-3xl font-bold">{value}</div>
          </div>
        ))}
      </section>
      

      <div className="glass rounded-xl p-5 space-y-5">
        <h2 className="text-lg font-semibold">Skill Insights</h2>

        {projects.length > 0 ? (
          <>
            {/* ✅ STRENGTHS */}
            <div>
              <h3 className="text-sm text-green-400 font-semibold mb-2">
                Strengths
              </h3>
              <div className="space-y-2">
                {skillSummary.strengths?.map((item, i) => (
                  <div key={i} className="flex gap-2 text-sm text-slate-300">
                    <span className="text-green-400">✔</span>
                    {clean(item)}
                  </div>
                ))}
              </div>
            </div>

            {/* ⚠️ IMPROVEMENTS */}
            <div>
              <h3 className="text-sm text-yellow-400 font-semibold mb-2">
                Growth Areas
              </h3>
              <div className="space-y-2">
                {skillSummary.improvements?.map((item, i) => (
                  <div key={i} className="flex gap-2 text-sm text-slate-300">
                    <span className="text-yellow-400">•</span>
                    {clean(item)}
                  </div>
                ))}
              </div>
            </div>

            {/* 🎯 OVERALL */}
            <div className="mt-3 text-sm text-slate-400">
              You show strong fundamentals with room to improve in key areas.
            </div>
          </>
        ) : (
          <div className="text-sm text-slate-400">
            Start analyzing projects to get personalized skill insights.
          </div>
        )}
      </div>
    </PageShell>
  );
}
