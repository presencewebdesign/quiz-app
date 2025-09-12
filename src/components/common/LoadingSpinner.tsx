interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

export const LoadingSpinner = ({
  size = "medium",
  color = "#007bff",
}: LoadingSpinnerProps) => (
  <div className={`spinner spinner-${size}`} style={{ color }}>
    <div className="spinner-inner" />
  </div>
);
