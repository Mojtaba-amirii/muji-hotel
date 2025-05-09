"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className=" container mx-auto">
      <h2 className=" font-heading text-red-800 mb-10">
        Something went wrong!
      </h2>
      <p className=" text-red-700">
        {error.message}
        <br />
        {error.digest && (
          <small className=" text-gray-500">Error ID: {error.digest}</small>
        )}
      </p>
      <button
        type="button"
        className=" btn-primary"
        title="Try Again btn"
        onClick={() => reset()}
      >
        Try Again
      </button>
    </div>
  );
}
