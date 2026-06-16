export default function FeedbackSection({ title, children }) {
  return (
    <section className="glass rounded-lg p-5">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</h3>
      <div className="mt-4 text-sm leading-6 text-slate-300">{children}</div>
    </section>
  );
}
