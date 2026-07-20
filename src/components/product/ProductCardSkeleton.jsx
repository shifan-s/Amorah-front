function ProductCardSkeleton() {
  return (
    <div className="animate-pulse bg-amorah-white" aria-hidden="true">
      <div className="aspect-[3/4] bg-amorah-light" />
      <div className="space-y-3 border-x border-b border-amorah-border p-4">
        <div className="h-3 w-1/3 bg-amorah-light" />
        <div className="h-6 w-4/5 bg-amorah-light" />
        <div className="h-4 w-1/2 bg-amorah-light" />
        <div className="flex gap-2">
          <div className="h-4 w-4 bg-amorah-light" />
          <div className="h-4 w-4 bg-amorah-light" />
          <div className="h-4 w-4 bg-amorah-light" />
        </div>
        <div className="h-12 w-full bg-amorah-light" />
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
