import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "destructive";
type ButtonSize = "sm" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "lg",
      className = "",
      children,
      isLoading = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={`btn btn-${variant} btn--${size} ${isLoading ? "btn--loading" : ""} ${disabled ? "btn--disabled" : ""} ${className} `}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <span className="btn__loading-wrapper">
            <svg className="btn__spinner" viewBox="0 0 24 24">
              <circle className="btn__spinner-track" cx="12" cy="12" r="10" />
              <circle className="btn__spinner-head" cx="12" cy="12" r="10" />
            </svg>
            <span className="btn__text">{children}</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
