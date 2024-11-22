'use client';

import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import mockData from '@/lib/utils/graph-demo-data.json';
import { createFileRoute } from '@tanstack/react-router';
import {
  FilterByLatest,
  FilterBySearch,
  FilterByTag,
} from '~/routes/_layout/contacts/-filters';
import Contact from '~/routes/_layout/contacts/-contact';
import { Pencil } from '~/routes/_layout/contacts/-pencil';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@telegram-apps/telegram-ui';
import { GraphIcon } from '~/assets/icons/iconsAsComponent/graph-icon';
import { lazyWithPreload } from "react-lazy-with-preload";
import { TWallpaper } from '@twallpaper/react'
import utyaLoading from '~/assets/utya-loading.gif';

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
  const LazyForceGraph = lazyWithPreload(
    () => import("~/components/force-graph"),
  )
  LazyForceGraph.preload()

  const [graphMode, setGraphMode] = useState(false)

  const [filterState, setFilterState] = useState<FilterOptions[]>([])
  const [searchState, setSearchState] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const filtersBlock = useRef<HTMLDivElement>(null)
  const [filtersBlockHeight, setFiltersBlockHeight] = useState<number>(0)

  let animationDelay = -0.1

  useEffect(() => {
    if (filtersBlock.current) {
      setFiltersBlockHeight(filtersBlock.current.offsetHeight)
    }
  }, [])

  const data = [...mockData.nodes] as NodeBody[]

  const filteredData = data
    .filter((node) => {
      if (selectedTag) {
        return node.tags?.some((tag) => tag.title === selectedTag)
      }
      return true
    })
    .filter((node) => {
      if (searchState) {
        return (
          node.id.toLowerCase().includes(searchState.toLowerCase()) ||
          node.username.toLowerCase().includes(searchState.toLowerCase()) ||
          node.description?.toLowerCase().includes(searchState.toLowerCase())
        )
      }
      return true
    })
    .sort((a, b) => {
      if (filterState.includes(FilterOptions.LAST_ADDED)) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return 0
    })

  const uniqueTags = Array.from(
    new Set(data.flatMap((node) => node.tags?.map((tag) => tag.title) || [])),
  )

  const toggleGraphMode = () => {
    setGraphMode(!graphMode)
  }

  if (graphMode)
    return (
      <div>
        <div className="h-screen absolute">
          <TWallpaper
            options={{
              fps: 60,
              tails: 90,
              animate: false,
              scrollAnimate: true,
              colors: ["#2F2F2F", "#2F2F2F", "#2F2F2F", "#2F2F2F"],
              pattern: {
                image: "https://twallpaper.js.org/patterns/paris.svg",
                background: "#212121",
                blur: 0,
                size: "420px",
                opacity: 1,
                mask: true,
              },
            }}
          />
        </div>
        <div>
          <div
            ref={filtersBlock}
            className="pb-4 fixed z-50 w-full bg-primary pl-4 pr-4 shadow-lg border-b-primary border-b-[1px]"
          >
            <FilterBySearch
              value={searchState}
              onChange={(value: string) => setSearchState(value)}
            />
            <div className={"flex space-x-2"}>
              <FilterByTag
                tags={uniqueTags}
                setSelectedTag={(tag: string | null) => {
                  setSelectedTag(tag)
                }}
              />
              <FilterByLatest
                enable={() => {
                  setFilterState([...filterState, FilterOptions.LAST_ADDED])
                  setSelectedTag(null)
                }}
                disable={() => {
                  setFilterState(
                    filterState.filter(
                      (option) => option !== FilterOptions.LAST_ADDED,
                    ),
                  )
                }}
              />
            </div>
          </div>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                type: "spring",
                damping: 50,
                stiffness: 500,
                delay: 0.1,
              }}
            >
              <Suspense>
                <LazyForceGraph nodes={filteredData} />
              </Suspense>
            </motion.div>
          </AnimatePresence>
          <Button
            size={"s"}
            mode={"outline"}
            className={"rounded-full absolute bottom-20 left-6"}
            style={{ borderRadius: "50% !important" }}
            onClick={toggleGraphMode}
          >
            <div className="h-6 w-6">
              <GraphIcon
                color={getCssVariableValue("--tg-theme-button-color")}
              />
            </div>
          </Button>
        </div>
      </div>
    )

  return (
    <div className="py-4 overflow-hidden">
      <div className="absolute h-screen">
        <div className=''>
          <TWallpaper
            options={{
              fps: 60,
              tails: 90,
              animate: false,
              scrollAnimate: true,
              colors: ["#2F2F2F", "#2F2F2F", "#2F2F2F", "#2F2F2F"],
              pattern: {
                image: "https://twallpaper.js.org/patterns/paris.svg",
                background: "#212121",
                blur: 5,
                size: "420px",
                opacity: 0.3,
                mask: true,
              },
            }}
          />
        </div>

      </div>
      <div
        ref={filtersBlock}
        className="pb-4 fixed z-50 w-full bg-primary -mt-4 pl-4 pr-4 shadow-lg border-b-primary border-b-[1px]"
      >
        <FilterBySearch
          value={searchState}
          onChange={(value: string) => setSearchState(value)}
        />
        <div className={"flex space-x-2"}>
          <FilterByTag
            tags={uniqueTags}
            setSelectedTag={(tag: string | null) => {
              setSelectedTag(tag)
            }}
          />
          <FilterByLatest
            enable={() => {
              setFilterState([...filterState, FilterOptions.LAST_ADDED])
              setSelectedTag(null)
            }}
            disable={() => {
              setFilterState(
                filterState.filter(
                  (option) => option !== FilterOptions.LAST_ADDED,
                ),
              )
            }}
          />
        </div>
      </div>
      <div
        className="pb-16"
        style={{
          marginTop: filtersBlockHeight - 16,
          visibility: graphMode ? "hidden" : "visible",
        }}
      >
        {filtersBlockHeight > 0 &&
          filteredData.map((node) => {
            if (node.type === "topic") return
            animationDelay += 0.05
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
                    type: "spring",
                    damping: 50,
                    stiffness: 500,
                    delay: animationDelay,
                  }}
                >
                  <Contact node={node} />
                </motion.div>
              </AnimatePresence>
            )
          })}
        {filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center pr-4 pl-4 absolute h-screen top-0 -mt-16">
            <img
              src={utyaLoading}
              alt={"Utya sticker"}
              height={150}
              width={150}
            />
            <div className='mt-2 text-2xl font-medium'>Nobody found</div>
            <div className='text-center mt-2 opacity-60'>It's seems you don't have that person in your network.</div>
          </div>
        )}

        <Pencil />
        <div className="fixed bottom-20 left-6">
          <Button
            size={"s"}
            className={"rounded-full"}
            style={{ borderRadius: "50% !important" }}
            onClick={toggleGraphMode}
          >
            <div className="h-6 w-6">
              <GraphIcon color={"#fff"} />
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/_layout/contacts/")({
  component: Index,
  staleTime: Infinity,
})


function getCssVariableValue(variableName: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
}