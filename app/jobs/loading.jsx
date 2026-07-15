'use client';

import React from 'react';
import DelayedSkeleton from '../../components/ui/DelayedSkeleton';

export default function JobsLoading() {
  return (
    <DelayedSkeleton>
      <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto flex gap-8">
        
        {/* Sidebar Filters Skeleton */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-24 animate-pulse">
            <div className="w-32 h-6 bg-gray-200 mb-6" />
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="w-24 h-4 bg-gray-200" />
                  <div className="w-full h-10 bg-gray-200 border-2 border-black" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Job Feed Skeleton */}
        <div className="flex-1 space-y-6 animate-pulse">
          {/* Search Header Skeleton */}
          <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex gap-4">
            <div className="flex-1 h-12 bg-gray-200 border-2 border-black" />
            <div className="w-32 h-12 bg-gray-200 border-2 border-black" />
          </div>

          {/* Job Cards Skeleton */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white border-[3px] border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-16 h-16 bg-gray-200 border-2 border-black shrink-0" />
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="w-3/4 h-6 bg-gray-200 mb-2" />
                    <div className="w-1/2 h-4 bg-gray-200" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-20 h-6 bg-gray-200 rounded-full" />
                    <div className="w-24 h-6 bg-gray-200 rounded-full" />
                  </div>
                  <div className="w-full h-16 bg-gray-200" />
                </div>
                <div className="flex md:flex-col gap-3 shrink-0 items-end justify-between md:justify-start">
                  <div className="w-32 h-10 bg-gray-200 border-2 border-black" />
                  <div className="w-10 h-10 bg-gray-200 border-2 border-black" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
      </div>
    </DelayedSkeleton>
  );
}
