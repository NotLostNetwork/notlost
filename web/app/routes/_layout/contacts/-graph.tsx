import { FilterByLatest, FilterBySearch, FilterByTag } from '~/routes/_layout/contacts/-filters';
import { AnimatePresence, motion } from 'framer-motion';
import React, { Suspense } from 'react';
import { Button } from '@telegram-apps/telegram-ui';
import { GraphIcon } from '~/assets/icons/iconsAsComponent/graph-icon';
import TWallpaper from "@twallpaper/react"

const Graph = () => {
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
  );
};

export default Graph;