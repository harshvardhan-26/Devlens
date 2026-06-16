// src/pages/PrivacyPolicy.jsx

import PageShell from "../components/PageShell.jsx";

export default function PrivacyPolicy() {
  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight">
            Privacy Policy
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Transparency about how Devlens collects,
            processes, and protects your information.
        </p>
        </div>

        <div className="space-y-6 text-slate-300 leading-8">
          <div className="grid gap-5">

  <div className="glass rounded-2xl border border-white/10 p-6">
    <h2 className="text-xl font-semibold mb-3">
      What We Collect
    </h2>

    <p className="text-slate-400 leading-8">
      Devlens collects basic account information such as your
      name, email address, and profile picture through Google
      Sign-In. This information is used solely to personalize
      your experience and manage your account.
    </p>
  </div>

  <div className="glass rounded-2xl border border-white/10 p-6">
    <h2 className="text-xl font-semibold mb-3">
      Repository Analysis
    </h2>

    <p className="text-slate-400 leading-8">
      When you submit a GitHub repository or upload project files,
      Devlens analyzes the source code to generate AI-powered
      feedback, architecture reviews, and portfolio insights.
    </p>
  </div>

  <div className="glass rounded-2xl border border-white/10 p-6">
    <h2 className="text-xl font-semibold mb-3">
      Data Storage
    </h2>

    <p className="text-slate-400 leading-8">
      Analysis results may be stored securely to provide project
      history, dashboards, and personalized insights. We do not
      sell or share personal data with advertisers.
    </p>
  </div>

  <div className="glass rounded-2xl border border-white/10 p-6">
    <h2 className="text-xl font-semibold mb-3">
      Third-Party Services
    </h2>

    <p className="text-slate-400 leading-8">
      Devlens relies on trusted providers such as Google
      Authentication and AI services to deliver platform
      functionality and project analysis.
    </p>
  </div>

  <div className="glass rounded-2xl border border-white/10 p-6">
    <h2 className="text-xl font-semibold mb-3">
      Your Rights
    </h2>

    <p className="text-slate-400 leading-8">
      You may request deletion of your account data at any time.
      Users retain ownership of repositories and files submitted
      for analysis.
    </p>
  </div>

  <div className="glass rounded-2xl border border-mint/20 bg-mint/[0.03] p-6">
    <h2 className="text-xl font-semibold mb-3 text-mint">
      Contact
    </h2>

    <p className="text-slate-300">
      Questions about privacy?
    </p>

    <a
      href="mailto:vermaharsh8630@gmail.com"
      className="mt-2 inline-block text-mint hover:underline"
    >
      vermaharsh8630@gmail.com
    </a>
  </div>

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