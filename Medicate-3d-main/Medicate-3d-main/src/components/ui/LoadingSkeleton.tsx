import { motion } from 'motion/react';

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <div className="h-12 bg-muted rounded-2xl w-1/3 animate-pulse" />
          <div className="h-6 bg-muted rounded-xl w-1/2 animate-pulse" />
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 space-y-4"
            >
              <div className="h-48 bg-muted rounded-xl animate-pulse" />
              <div className="h-6 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-muted rounded w-full animate-pulse" />
              <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
