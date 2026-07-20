import LoadingSpinner from './LoadingSpinner.jsx';

function PageLoader() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-amorah-ivory px-6 text-center text-amorah-brown"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" label="Loading Amorah page" />
        <p className="text-sm font-semibold uppercase tracking-[0.24em]">Loading Amorah</p>
      </div>
    </div>
  );
}

export default PageLoader;
