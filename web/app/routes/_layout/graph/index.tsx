'use client';

import { createFileRoute } from '@tanstack/react-router';
import '@/styles/app.css';
import ForceGraph from './-force-graph';
import React, { useState } from 'react';
import graphBgDark from '@/assets/chat-bg-pattern-dark.png';

export const Route = createFileRoute('/_layout/graph/')({
  component: Index,
  staleTime: 60_000,
});

function Index() {
  const [visible, setVisible] = useState(false);

  setTimeout(() => {
    setVisible(true);
  }, 100);

  return (
    <div>
      <img src={graphBgDark} alt="" className="absolute h-screen" />
      <div
        className={`transition-all duration-300 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}
      >
        <ForceGraph />
      </div>
    </div>
  );
}
