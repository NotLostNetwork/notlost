import { AnimatePresence, motion } from 'framer-motion';
import React, { Suspense } from 'react';
import { Button } from '@telegram-apps/telegram-ui';
import { GraphIcon } from '~/assets/icons/iconsAsComponent/graph-icon';
import TgWallpaper from '~/components/tg-wallpaper';
import { getCssVariableValue } from '~/lib/utils/funcs/get-css-variable-value';
import lazyWithPreload from "react-lazy-with-preload"
import { NodeBody } from '~/routes/_layout/contacts/index';

const ContactsGraph = ({data, toggleGraphMode} : {data: NodeBody[], toggleGraphMode: () => void}) => {

  const LazyForceGraph = lazyWithPreload(
    () => import("~/components/force-graph"),
  )
  LazyForceGraph.preload()

  return (
    <div>
      <div className="h-screen absolute">
        <TgWallpaper/>
      </div>
      <div>
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
              <LazyForceGraph nodes={data} />
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

export default ContactsGraph;