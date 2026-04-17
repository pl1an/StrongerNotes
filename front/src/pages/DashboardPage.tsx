import { Dumbbell, LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary flex items-center justify-center rounded-xl">
              <Dumbbell className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">StrongerNotes</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-secondary-foreground">
              <User className="w-4 h-4" />
              <span>{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-secondary-foreground hover:text-primary transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-secondary-foreground mt-2 opacity-80">
            Your training dashboard is ready. More features coming in the next phases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Workout routines", value: "—", hint: "Coming in Phase 3" },
            { label: "Training sessions", value: "—", hint: "Coming in Phase 3" },
            { label: "Exercises tracked", value: "—", hint: "Coming in Phase 3" },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm"
            >
              <p className="text-sm font-semibold text-secondary-foreground opacity-70 uppercase tracking-wider mb-2">
                {card.label}
              </p>
              <p className="text-4xl font-bold text-primary">{card.value}</p>
              <p className="text-xs text-secondary-foreground opacity-50 mt-2">{card.hint}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
