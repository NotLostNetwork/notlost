'use client';

import { useEffect, useRef, useState } from 'react';
import mockData from '@/lib/utils/graph-demo-data.json';
import { createFileRoute } from '@tanstack/react-router';
import {
  FilterByLatest,
  FilterBySearch,
  FilterByTag,
} from '@/routes/_layout/contacts-list/-filters';
import Contact from '@/routes/_layout/contacts-list/-contact';
import { Pencil } from '@/routes/_layout/contacts-list/-pencil';
import { AnimatePresence, motion } from 'framer-motion';

export interface NodeBody {
  id: string;
  group: number;
  username: string;
  description?: string;
  tags?: Tag[];
  topic?: string;
  type?: string;
  createdAt: Date;
}

interface Tag {
  title: string;
  color: string;
}

enum FilterOptions {
  LAST_ADDED,
}

const Index = () => {
  const [filterState, setFilterState] = useState<FilterOptions[]>([]);
  const [searchState, setSearchState] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filtersBlock = useRef<HTMLDivElement>(null);
  const [filtersBlockHeight, setFiltersBlockHeight] = useState<number>(0);

  let animationDelay = -0.1;

  useEffect(() => {
    if (filtersBlock.current) {
      setFiltersBlockHeight(filtersBlock.current.offsetHeight);
    }
  }, []);

  const data = [...mockData.nodes] as NodeBody[];

  const filteredData = data
    .filter((node) => {
      if (selectedTag) {
        return node.tags?.some((tag) => tag.title === selectedTag);
      }
      return true;
    })
    .filter((node) => {
      if (searchState) {
        return (
          node.id.toLowerCase().includes(searchState.toLowerCase()) ||
          node.description?.toLowerCase().includes(searchState.toLowerCase())
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (filterState.includes(FilterOptions.LAST_ADDED)) {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return 0;
    });

  const uniqueTags = Array.from(
    new Set(data.flatMap((node) => node.tags?.map((tag) => tag.title) || [])),
  );

  return (
    <div className="py-4 overflow-hidden">
      <div
        ref={filtersBlock}
        className="pb-4 fixed z-50 w-full bg-primary -mt-4 pl-4 pr-4 shadow-lg border-b-primary border-b-[1px]"
      >
        <FilterBySearch
          value={searchState}
          onChange={(value: string) => setSearchState(value)}
        />
        <div className={'flex space-x-2'}>
          <FilterByTag
            tags={uniqueTags}
            setSelectedTag={(tag: string | null) => {
              setSelectedTag(tag);
            }}
          />
          <FilterByLatest
            enable={() => {
              setFilterState([...filterState, FilterOptions.LAST_ADDED]);
              setSelectedTag(null);
            }}
            disable={() => {
              setFilterState(
                filterState.filter(
                  (option) => option !== FilterOptions.LAST_ADDED,
                ),
              );
            }}
          />
        </div>
      </div>
      <div className="pb-16" style={{ marginTop: filtersBlockHeight - 16 }}>
        {filtersBlockHeight > 0 &&
          filteredData.map((node) => {
            if (node.type === 'topic') return;
            animationDelay += 0.05;
            return (
              <AnimatePresence key={node.id}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    type: 'spring',
                    damping: 50,
                    stiffness: 500,
                    delay: animationDelay,
                  }}
                >
                  <Contact node={node} />
                </motion.div>
              </AnimatePresence>
            );
          })}
      </div>
      <Pencil />
    </div>
  );
};

export const Route = createFileRoute('/_layout/contacts-list/')({
  component: Index,
  staleTime: Infinity,
});
