const SkeletonCard = () => (
  <div className="card">
    <div className="h-48 bg-dark-800 shimmer" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-dark-800 rounded shimmer w-3/4" />
      <div className="h-3 bg-dark-800 rounded shimmer w-full" />
      <div className="h-3 bg-dark-800 rounded shimmer w-2/3" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-dark-800 rounded shimmer w-24" />
        <div className="h-8 bg-dark-800 rounded shimmer w-20" />
      </div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 12 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }, (_, i) => <SkeletonCard key={i} />)}
  </div>
);

export const SkeletonDetail = () => (
  <div className="max-w-6xl mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="h-80 bg-dark-800 rounded-xl shimmer" />
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-dark-800 rounded shimmer" />)}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-8 bg-dark-800 rounded shimmer w-3/4" />
        <div className="h-10 bg-dark-800 rounded shimmer w-1/3" />
        <div className="h-32 bg-dark-800 rounded shimmer" />
        <div className="h-12 bg-dark-800 rounded shimmer" />
      </div>
    </div>
  </div>
);

export default SkeletonCard;