import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Dumbbell, LogOut, Moon, Sun, User } from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import { useTheme } from "../contexts/ThemeContext";
import { getSessions, type SessionSummary } from "../services/requests/sessions/getSessions";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString();
};

const SessionsPage = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getSessions()
      .then(setSessions)
      .catch(() => setError("Could not load session history."))
      .finally(() => setLoading(false));
  }, []);

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

      <main className="flex-1 px-6 py-10 max-w-4xl mx-auto w-full">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-secondary-foreground hover:text-foreground mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Session History</h1>
            <p className="text-secondary-foreground opacity-70 mt-1 text-sm">
              Review past workouts and continue where you left off.
            </p>
          </div>
          <Link
            to="/workouts/new"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all"
          >
            New Workout
          </Link>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && sessions.length === 0 && (
          <div className="bg-card rounded-2xl border border-border border-dashed p-12 text-center">
            <p className="text-secondary-foreground opacity-50 mb-6">No sessions recorded yet.</p>
            <Link
              to="/workouts/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all"
            >
              Start First Workout
            </Link>
          </div>
        )}

        {!loading && !error && sessions.length > 0 && (
          <div className="space-y-4">
            {sessions.map((session) => {
              const dateLabel = formatDate(session.date || session.createdAt);
              return (
                <Link
                  key={session._id}
                  to={`/sessions/${session._id}`}
                  className="block bg-card border border-border rounded-2xl px-6 py-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-bold">{session.workout?.name ?? "Workout"}</p>
                      <p className="text-xs text-secondary-foreground opacity-60">{dateLabel}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">Open</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default SessionsPage;
