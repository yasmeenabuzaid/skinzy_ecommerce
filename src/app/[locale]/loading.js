// app/loading.js

export default function Loading() {
  // يمكنك تصميم أي واجهة تحميل هنا، مثل Skeleton
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div
        className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-orange-500 border-t-transparent"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}