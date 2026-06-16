// src/pages/Terms.jsx

import PageShell from "../components/PageShell.jsx";

export default function Terms() {
  return (
    <PageShell>
  <div className="max-w-5xl mx-auto">

    <div className="mb-12 text-center">
      <p className="text-sm uppercase tracking-[0.25em] text-slate-500 mb-4">
        Legal
      </p>

      <h1 className="text-5xl md:text-6xl font-black tracking-tight">
        Terms & Conditions
      </h1>

      <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
        The rules and responsibilities that govern the use of
        Devlens and its AI-powered analysis platform.
      </p>
    </div>

    <div className="grid gap-5">

      <div className="glass rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-3">
          Using Devlens
        </h2>

        <p className="text-slate-400 leading-8">
          Devlens provides AI-powered project reviews and
          developer insights. By using the platform, you agree
          to these terms and conditions.
        </p>
      </div>

      <div className="glass rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-3">
          AI-Generated Feedback
        </h2>

        <p className="text-slate-400 leading-8">
          Analysis results are generated using artificial
          intelligence and should be treated as guidance rather
          than professional engineering, hiring, or legal advice.
        </p>
      </div>

      <div className="glass rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-3">
          Repository Ownership
        </h2>

        <p className="text-slate-400 leading-8">
          You must only submit repositories and files that you
          own or are authorized to analyze. Users retain full
          ownership of their submitted content.
        </p>
      </div>

      <div className="glass rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-3">
          Platform Limitations
        </h2>

        <p className="text-slate-400 leading-8">
          Devlens is provided on an "as is" basis. We do not
          guarantee the accuracy, completeness, or suitability
          of AI-generated feedback.
        </p>
      </div>

      <div className="glass rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-3">
          Service Updates
        </h2>

        <p className="text-slate-400 leading-8">
          We may improve, modify, or discontinue features at
          any time to enhance the platform experience.
        </p>
      </div>

      <div className="glass rounded-2xl border border-mint/20 bg-mint/[0.03] p-6">
        <h2 className="text-xl font-semibold mb-3 text-mint">
          Contact
        </h2>

        <p className="text-slate-300">
          Questions regarding these terms?
        </p>

        <a
          href="mailto:vermaharsh8630@gmail.com"
          className="mt-2 inline-block text-mint hover:underline"
        >
          vermaharsh8630@gmail.com
        </a>
      </div>

    </div>

    <div className="mt-12 border-t border-white/10 pt-8 text-center">
      <div className="text-2xl font-bold tracking-tight">
        Devlens
      </div>

      <div className="mt-2 text-slate-500">
        See your code through an AI lens.
      </div>
    </div>

  </div>
</PageShell>
  );
}