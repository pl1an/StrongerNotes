import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { login } from "../services/requests/auth/login";
import { AxiosError } from "axios";


const LoginPage = () => {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [apiError, setApiError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setApiError("");
		setIsSubmitting(true);
		
		try {
			const response = await login({ email, password });
			
			// For now, store token in localStorage
			localStorage.setItem("token", response.data.token);
			localStorage.setItem("user", JSON.stringify(response.data.user));
			
			navigate("/dashboard"); // Redirect to dashboard
		} catch (error) {
			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					setApiError("Invalid e-mail or password.");
				} else {
					setApiError("Could not sign in right now. Please try again.");
				}
			} else {
				setApiError("Unexpected error. Please try again.");
			}
			console.error("Login error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

          <form onSubmit={handleSubmit} className="space-y-6">
            {apiError && (
              <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                {apiError}
              </div>
            )}

			<form onSubmit={handleSubmit} className="space-y-6">
				{apiError && (
					<div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
						{apiError}
					</div>
				)}
				<div>
				<label htmlFor="email" className="block text-sm font-semibold mb-2">
					Email
				</label>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
					<Mail className="h-5 w-5 text-secondary-foreground opacity-50" />
					</div>
					<input
					id="email"
					type="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="block w-full pl-11 pr-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none placeholder:text-secondary-foreground/40"
					placeholder="name@example.com"
					/>
				</div>
				</div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-secondary-foreground opacity-50" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none placeholder:text-secondary-foreground/40"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary-foreground opacity-50 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

				<button
				type="submit"
				disabled={isSubmitting}
				className="w-full py-4 px-6 text-primary-foreground bg-primary hover:opacity-90 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
				>
				{isSubmitting ? "Signing In..." : "Sign In"}
				</button>
			</form>

          <div className="mt-10 pt-8 border-t border-border text-center">
            <p className="text-secondary-foreground opacity-80">
              Don't have an account yet?{" "}
              <Link
                to="/register"
                className="font-bold text-primary hover:opacity-80 transition-opacity"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
