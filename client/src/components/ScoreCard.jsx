export default function ScoreCard({ score = 0, readiness = "Pending" }) {
  const color = score >= 80 ? "#63e6be" : score >= 60 ? "#f5c76b" : "#fb7185";

  return (
    <div className="glass rounded-lg p-6">
      <div className="flex items-center justify-between gap-5">
        <div>
          <p className="text-sm text-slate-400">Job readiness score</p>
          <h2 className="mt-2 text-3xl font-bold">{readiness}</h2>
          <p className="mt-2 text-sm text-slate-500">Measured across quality, architecture, product usability, and portfolio signal.</p>
        </div>
        <div
          className="score-ring grid h-32 w-32 shrink-0 place-items-center rounded-full"
          style={{ "--score": score, "--score-color": color }}
        >
          <div className="text-center">
            <div className="text-3xl font-extrabold">{score}</div>
            <div className="text-xs text-slate-500">/ 100</div>
          </div>
        </div>
      </div>
    </div>
  );
}
