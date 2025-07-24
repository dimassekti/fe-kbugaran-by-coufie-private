import React from "react";
import PropTypes from "prop-types";

function ErrorBoundary({ error, onRetry, onBackendCheck }) {
  if (!error) return null;

  const isNetworkError =
    error.message?.includes("fetch") ||
    error.message?.includes("network") ||
    error.message?.includes("connect") ||
    error.message?.includes("Cannot connect to server");

  return (
    <div className="error-boundary">
      <div className="error-content">
        <h3>⚠️ Something went wrong</h3>

        {isNetworkError ? (
          <div className="network-error">
            <p>Cannot connect to the server.</p>
            <p>
              Please check if the backend is running on{" "}
              <code>http://localhost:5000</code>
            </p>
            <div className="error-actions">
              <button
                onClick={onBackendCheck}
                className="btn-secondary">
                Check Backend Status
              </button>
              <button
                onClick={onRetry}
                className="btn-primary">
                Retry Connection
              </button>
            </div>
          </div>
        ) : (
          <div className="validation-error">
            <p>{error.message}</p>
            <button
              onClick={onRetry}
              className="btn-primary">
              Try Again
            </button>
          </div>
        )}

        <details className="error-details">
          <summary>Technical Details</summary>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </details>
      </div>
    </div>
  );
}

ErrorBoundary.propTypes = {
  error: PropTypes.object,
  onRetry: PropTypes.func.isRequired,
  onBackendCheck: PropTypes.func.isRequired,
};

export default ErrorBoundary;
