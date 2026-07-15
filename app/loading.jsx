'use client';

import React from 'react';
import DelayedSkeleton from '../components/ui/DelayedSkeleton';

export default function Loading() {
  return (
    <DelayedSkeleton>
      <div className="min-h-screen pt-24 pb-16 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="w-full h-12 bg-gray-200 animate-pulse mb-8 border-2 border-black" />
          
          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-4">
              <div className="w-full h-64 bg-gray-200 animate-pulse border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
              <div className="w-full h-24 bg-gray-200 animate-pulse border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="w-full h-32 bg-gray-200 animate-pulse border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
              <div className="w-full h-32 bg-gray-200 animate-pulse border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
              <div className="w-full h-32 bg-gray-200 animate-pulse border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
            </div>
          </div>
        </div>
      </div>
    </DelayedSkeleton>
  );
}
