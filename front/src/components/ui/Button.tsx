import React from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
  icon?: LucideIcon;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", isLoading, icon: Icon, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20",
      secondary: "bg-secondary text-secondary-foreground border border-border hover:opacity-80",
      ghost: "bg-transparent hover:bg-secondary text-secondary-foreground",
    };

    const sizes = "w-full py-4 px-6 text-lg";

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : Icon ? (
          <Icon className="mr-2 h-5 w-5" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
