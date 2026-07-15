'use client';

import React from 'react';
import DelayedSkeleton from '../../components/ui/DelayedSkeleton';

export default function CompaniesLoading() {
  return (
    <DelayedSkeleton>
      <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12 animate-pulse">
        
        {/* Header Skeleton */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="w-32 h-8 bg-gray-200 mx-auto" />
          <div className="w-3/4 h-12 bg-gray-200 mx-auto border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
          <div className="w-2/3 h-4 bg-gray-200 mx-auto" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="max-w-4xl mx-auto flex gap-4">
          <div className="flex-1 h-14 bg-gray-200 border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
          <div className="w-14 h-14 bg-gray-200 border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
        </div>

        {/* Companies Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border-[3px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full border-4 border-black mb-6" />
              <div className="w-3/4 h-6 bg-gray-200 mb-2" />
              <div className="w-1/2 h-4 bg-gray-200 mb-6" />
              <div className="flex gap-2 mb-8">
                <div className="w-16 h-6 bg-gray-200 rounded-full" />
                <div className="w-20 h-6 bg-gray-200 rounded-full" />
              </div>
              <div className="w-full h-12 bg-gray-200 border-2 border-black" />
            </div>
          ))}
        </div>

      </div>
      </div>
    </DelayedSkeleton>
  );
}
