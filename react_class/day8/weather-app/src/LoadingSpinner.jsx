import "./LoadingSpinner.css";

function LoadingSpinner() {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p className="loading-text">Fetching weather...</p>
    </div>
  );
}

export default LoadingSpinner;
