// Global loading screen for Next.js app directory

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-b-4 border-blue-500 mb-6"></div>
      <h2 className="text-xl font-bold text-green-700 mb-2">Loading...</h2>
      <p className="text-gray-500">Please wait while we load your smart city experience.</p>
    </div>
  );
}
