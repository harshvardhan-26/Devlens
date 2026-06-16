import { BarChart3, Home, LogOut, Sparkles, UserRound } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import Logo from "./Logo.jsx";

const navItems = [
  { to: "/", label: "Analyze", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: UserRound }
];

export default function Layout() {
  const { user, signOutUser } = useAuth();
  

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/78 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Logo />
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                    isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img
                src={user?.avatar}
                alt={user?.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || "User"
                    )}&background=0f172a&color=5eead4`;
                }}
                className="h-10 w-10 rounded-full object-cover border border-white/20"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-mint/10 text-sm font-semibold text-mint">
                {user?.name?.charAt(0)}
              </div>
            )}
            <div className="hidden md:block text-sm">
              <div className="font-medium text-white">
                {user?.name}
              </div>

              <div className="text-xs text-slate-400">
                {user?.email}
              </div>
            </div>
          </div>
            <button
              onClick={signOutUser}
              className="rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
            >
              Logout
            </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <nav className="fixed inset-x-4 bottom-4 z-40 grid grid-cols-3 rounded-xl border border-white/10 bg-panel/95 p-2 shadow-glow backdrop-blur-xl md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs ${isActive ? "bg-white/10 text-white" : "text-slate-500"}`
            }
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
