import React from "react";
import type { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, className = "", ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label htmlFor={props.id} className="block text-sm font-semibold">
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary-foreground opacity-50">
              <Icon size={20} />
            </div>
          )}
          <input
            ref={ref}
            className={`block w-full ${Icon ? "pl-11" : "px-4"} pr-4 py-3 bg-input border rounded-xl outline-none transition-all focus:ring-2 placeholder:text-secondary-foreground/40 ${
              error 
                ? "border-destructive focus:ring-destructive/20" 
                : "border-border focus:ring-primary focus:border-primary"
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
