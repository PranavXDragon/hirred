'use client';

import React from 'react';
import DelayedSkeleton from '../../../components/ui/DelayedSkeleton';

export default function EmployerDashboardLoading() {
  return (
    <DelayedSkeleton>
      <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="w-64 h-8 bg-gray-200 border-2 border-black mb-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
          <div className="w-48 h-4 bg-gray-200" />
        </div>
        <div className="w-40 h-12 bg-gray-200 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-12 h-12 bg-gray-200 mb-4 rounded-full" />
            <div className="w-32 h-8 bg-gray-200 mb-2" />
            <div className="w-20 h-4 bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-96 flex items-center justify-center">
            <div className="w-full h-full bg-gray-100" />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-40 h-6 bg-gray-200 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="w-full h-4 bg-gray-200" />
                    <div className="w-2/3 h-3 bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </DelayedSkeleton>
  );
}
