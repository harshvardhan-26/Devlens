export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint/10 border border-mint/20">
  <svg
    width="26"
    height="26"
    viewBox="0 0 100 100"
    fill="none"
  >
    {/* Outer ring */}
    <circle
      cx="50"
      cy="50"
      r="42"
      stroke="#5EEAD4"
      strokeWidth="5"
      opacity="0.9"
    />

    {/* Lens ring */}
    <circle
      cx="50"
      cy="50"
      r="28"
      stroke="#5EEAD4"
      strokeWidth="4"
      opacity="0.6"
    />

    {/* Inner glass */}
    <circle
      cx="50"
      cy="50"
      r="16"
      fill="#5EEAD4"
      opacity="0.15"
    />

    {/* Center */}
    <circle
      cx="50"
      cy="50"
      r="8"
      fill="#5EEAD4"
    />

    {/* Reflection */}
    <circle
      cx="43"
      cy="43"
      r="4"
      fill="white"
      opacity="0.7"
    />
  </svg>
</div>

      <div>
        <div className="text-lg font-semibold tracking-tight">
          Devlens
        </div>

        <div className="text-xs text-slate-500">
          Code • Review • Improve
        </div>
      </div>
    </div>
  );
}