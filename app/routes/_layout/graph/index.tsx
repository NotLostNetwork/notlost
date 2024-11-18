'use client';

import { createFileRoute } from '@tanstack/react-router';
import '@/index.css';
import ForceGraph from './-force-graph';

export const Route = createFileRoute('/_layout/graph/')({
  component: Index,
  staleTime: 60_000,
});

function Index() {
  return (
    <div>
      <ForceGraph />
    </div>
  );
}
