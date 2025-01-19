import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "@gadgetinc/react"; 
import { api } from "./api";
import App from "./components/App";
import "./main.css";
import { ErrorBoundary } from "react-error-boundary";

const root = document.getElementById("root");
if (!root) throw new Error("#root element not found for booting react app");

 
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="flex items-center justify-center min-h-screen p-4">
    <div className="text-red-500 max-w-lg">
      <h2 className="text-xl font-bold mb-4">An error occurred:</h2>
      <pre>{error.message}</pre>
      {process.env.NODE_ENV === 'development' && (
        <pre className="mt-2 text-sm">{error.stack}</pre>
      )}
    </div>
  </div>
);
 
const rootInstance = ReactDOM.createRoot(root, {
  onRecoverableError: (error) => console.error("Recoverable error:", error),
});

rootInstance.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <Provider api={api} signInPath="/sign-in">
          <App />
        </Provider>
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
);
