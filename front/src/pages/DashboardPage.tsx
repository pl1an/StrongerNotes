import { Link } from "react-router-dom";
import { Dumbbell, TrendingUp, Calendar, Plus, User, LogOut, Sun, Moon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../App";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">StrongerNotes</span>
        </div>
        <nav className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-80 transition-all border border-border"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <Link
            to="/profile"
            className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-80 transition-all border border-border"
            aria-label="Profile"
          >
            <User size={20} />
          </Link>
          <button
            onClick={logout}
            className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-80 transition-all border border-border"
            aria-label="Sign out"
          >
            <LogOut size={20} />
          </button>
        </nav>
      </header>

      <main className="flex-1 px-6 py-10 max-w-5xl mx-auto w-full">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome back, <span className="text-primary">{user?.name.split(" ")[0]}</span>
          </h1>
          <p className="text-secondary-foreground opacity-80 mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Quick stats — placeholders for Phase 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: <Calendar className="w-6 h-6 text-primary" />, label: "Workouts this week", value: "—" },
            { icon: <TrendingUp className="w-6 h-6 text-primary" />, label: "Total sessions", value: "—" },
            { icon: <Dumbbell className="w-6 h-6 text-primary" />, label: "Active routines", value: "—" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-xl shrink-0">
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-secondary-foreground opacity-70">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Workout routines — placeholder */}
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-2xl mx-auto mb-4">
            <Dumbbell className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">No workout routines yet</h2>
          <p className="text-secondary-foreground opacity-70 mb-6 max-w-sm mx-auto">
            Create your first training routine to start tracking your progress.
          </p>
          <button
            disabled
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold opacity-50 cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            New Routine — Coming in Phase 3
          </button>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
