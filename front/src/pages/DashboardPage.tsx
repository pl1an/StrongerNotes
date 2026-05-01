import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, TrendingUp, Calendar, Plus, User, LogOut, Sun, Moon, ChevronRight, Play } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../App";
import { getWorkouts, type Workout } from "../services/requests/workouts/getWorkouts";
import { getSessions, type SessionSummary } from "../services/requests/sessions/getSessions";
import { createSession } from "../services/requests/sessions/createSession";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingSession, setStartingSession] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getWorkouts(), getSessions()])
      .then(([w, s]) => { setWorkouts(w); setSessions(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sessionsThisWeek = sessions.filter((s) => {
    const sessionDate = new Date(s.date);
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return sessionDate >= startOfWeek;
  }).length;

  const handleStartSession = async (workoutId: string) => {
    setStartingSession(workoutId);
    try {
      const session = await createSession({ workoutId });
      navigate(`/sessions/${session._id}`);
    } catch (err) {
      console.error("Failed to start session:", err);
    } finally {
      setStartingSession(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">StrongerNotes</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link
            to="/exercises"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-secondary-foreground hover:text-foreground hover:bg-secondary transition-all border border-border"
          >
            <Dumbbell className="w-4 h-4" />
            Exercises
          </Link>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: <Calendar className="w-6 h-6 text-primary" />, label: "Sessions this week", value: loading ? "—" : String(sessionsThisWeek) },
            { icon: <TrendingUp className="w-6 h-6 text-primary" />, label: "Total sessions", value: loading ? "—" : String(sessions.length) },
            { icon: <Dumbbell className="w-6 h-6 text-primary" />, label: "Active routines", value: loading ? "—" : String(workouts.length) },
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

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">My Routines</h2>
          <Link
            to="/workouts/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Routine
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse h-20" />
            ))}
          </div>
        ) : workouts.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-2xl mx-auto mb-4">
              <Dumbbell className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">No routines yet</h3>
            <p className="text-secondary-foreground opacity-70 mb-6 max-w-sm mx-auto">
              Create your first training routine to start tracking your progress.
            </p>
            <Link
              to="/workouts/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all"
            >
              <Plus className="w-5 h-5" />
              Create First Routine
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {workouts.map((workout) => (
              <div
                key={workout._id}
                className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-xl shrink-0">
                  <Dumbbell className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{workout.name}</p>
                  <p className="text-sm text-secondary-foreground opacity-70">
                    {workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleStartSession(workout._id)}
                    disabled={startingSession === workout._id}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    <Play className="w-3.5 h-3.5" />
                    {startingSession === workout._id ? "Starting…" : "Start"}
                  </button>
                  <Link
                    to={`/workouts/${workout._id}`}
                    className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-80 transition-all border border-border"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
