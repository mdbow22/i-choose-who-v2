import TopNav from '@/components/navigation/TopNav';
import { NextPage } from 'next';
import React from 'react';

const planner: NextPage = () => {
  return (
    <div className='min-h-screen bg-gradient-to-t from-[#c6f2ff] to-[#ffffff]'>
      <TopNav />
      <main className='container relative mx-auto mt-10 max-w-5xl min-h-screen'>
        <h1 className="mb-5 text-4xl font-bold text-teal-600">
          Battle Planner
        </h1>
        <p>Plan our your next battle: pick the enemy pokemon and figure out which of yours you should use.</p>
        <h2 className='my-5 text-2xl font-bold text-teal-600'>The Enemy</h2>
      </main>
    </div>
  );
};

export default planner;
