import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dumbbell, ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginSchema, LoginInput } from "../lib/schemas/auth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    console.log("Login success:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12 transition-colors duration-300">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-secondary-foreground hover:text-primary mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>
        
        <div className="bg-card p-8 rounded-2xl shadow-xl shadow-black/5 border border-border">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-primary flex items-center justify-center rounded-2xl mb-4 shadow-lg shadow-primary/20">
              <Dumbbell className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-secondary-foreground mt-2 opacity-80">Access your dashboard to keep growing</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              id="email"
              type="email"
              label="Email"
              icon={Mail}
              placeholder="name@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                icon={Lock}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-[38px] pr-4 flex items-center text-secondary-foreground opacity-50 hover:opacity-100 transition-opacity"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              <div className="mt-2 text-right">
                <a href="#" className="text-sm font-medium text-primary hover:opacity-80 transition-opacity">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button type="submit" isLoading={isSubmitting}>
              Sign In
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-border text-center">
            <p className="text-secondary-foreground opacity-80">
              Don't have an account yet?{" "}
              <Link to="/register" className="font-bold text-primary hover:opacity-80 transition-opacity">
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
