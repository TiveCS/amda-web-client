import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const routeError = useRouteError();
  if (isRouteErrorResponse(routeError)) {
    return (
      <div
        id="error-page"
        className="min-w-full min-h-screen flex flex-col items-center justify-center gap-y-4 font-poppins"
      >
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p className="text-gray-400">
          <i>{routeError.statusText || routeError.error?.message}</i>
        </p>
      </div>
    );
  }
}
