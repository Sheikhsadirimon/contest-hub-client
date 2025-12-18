import { Link } from "react-router";

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-primary animate-bounce">404</h1>
        <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
        <p className="text-base-content/70 mt-2">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="mt-8 space-x-5">
          <Link to="/">
            <button className="btn btn-primary btn-lg">Go Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
