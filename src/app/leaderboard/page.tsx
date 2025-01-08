'use client';
// src/app/leaderboard/page.tsx
import React, { useState } from 'react';
import { mockUsers } from '@/lib/mockData';
import { FaRibbon } from 'react-icons/fa';
import { getProgress } from '@/lib/utils';

export default function LeaderboardPage() {
  const [timeFrame, setTimeFrame] = useState('daily');

  // Filter users based on timeframe (mock logic)
  const getFilteredUsers = () => {
    return mockUsers; // Replace with actual filtering logic
  };

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold text-center mb-6'>Leaderboard</h1>
      <div className='flex justify-center gap-4 mb-6'>
        <button
          onClick={() => setTimeFrame('daily')}
          className={`px-4 py-2 ${timeFrame === 'daily' ? 'bg-blue-500' : 'bg-gray-300'} text-white rounded`}
        >
          Harian
        </button>
        <button
          onClick={() => setTimeFrame('weekly')}
          className={`px-4 py-2 ${timeFrame === 'weekly' ? 'bg-green-500' : 'bg-gray-300'} text-white rounded`}
        >
          Mingguan
        </button>
        <button
          onClick={() => setTimeFrame('monthly')}
          className={`px-4 py-2 ${timeFrame === 'monthly' ? 'bg-purple-500' : 'bg-gray-300'} text-white rounded`}
        >
          Bulanan
        </button>
      </div>
      <div className='grid grid-cols-1 gap-4'>
        {getFilteredUsers().map((user, index) => {
          const progress = getProgress(user.points);

          return (
            <div key={user.id} className='flex items-center p-4 bg-white shadow rounded-lg hover-effect'>
              <span className={`text-lg font-bold mr-4 ${index < 3 ? 'text-yellow-500' : 'text-gray-700'}`}>{index + 1}</span>
              <img src={user.avatar} alt={user.name} className='w-12 h-12 rounded-full mr-4' />
              <div className='flex-1'>
                <h2 className='text-lg font-semibold'>
                  {user.rank} {user.name} {/* Prepend rank to name */}
                  {index < 3 && (
                    <FaRibbon className={`inline-block ml-2 ${index === 0 ? 'text-gold' : index === 1 ? 'text-silver' : 'text-bronze'}`} />
                  )}
                </h2>
                <p className='text-sm text-gray-600'>
                  Level {user.level} • {user.points} Poin {/* Display level and points */}
                </p>
                <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                  <div className='bg-blue-500 h-2 rounded-full' style={{ width: `${progress}%` }}></div>
                </div>
              </div>
              <span className='text-lg font-bold'>{`#${index + 1}`}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
