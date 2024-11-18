'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ForceGraph2D, {
  ForceGraphMethods,
  NodeObject,
} from 'react-force-graph-2d';
import data from '@/lib/utils/graph-demo-data.json';
import TelegramHelper from "@/lib/utils/telegram/telegram-helper";

type ImageCache = {
  [key: string]: HTMLImageElement;
};

const ForceGraph = () => {
  const fgRef = React.useRef<ForceGraphMethods>();
  useEffect(() => {
    fgRef?.current?.d3Force('charge')!.distanceMax(80);
    fgRef?.current?.centerAt(0, 0);
    fgRef?.current?.zoom(2);
  }, []);
  const [imageCache, setImageCache] = useState<ImageCache>({});

  useMemo(() => {
    const loadImage = (url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
      });
    };

    const preloadImages = async () => {
      const cache: ImageCache = {};
      for (const node of data.nodes) {
        const avatarUrl = await TelegramHelper.getProfileAvatar(node.username)
        cache[node.id] = await loadImage(avatarUrl);
      }
      setImageCache(cache);
    };

    preloadImages();
  }, []);

  const drawNode = useCallback(
    (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const imgSize = node.size || 10;
      const fontSize = Math.min(3, (12 * globalScale) / 4);
      const textOpacity = Math.min(globalScale / 4, 0.9);

      ctx.font = `${fontSize}px Sans-Serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = `rgba(201, 225, 253, ${textOpacity})`;
      ctx.fillText(
        node.id!.toString(),
        node.x!,
        node.y! + imgSize / 2 + 1,
      );

      const img = imageCache[node.id!];

      if (img) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x!, node.y!, imgSize / 2, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(
          img,
          node.x! - imgSize / 2,
          node.y! - imgSize / 2,
          imgSize,
          imgSize,
        );
        ctx.restore();
      }
    },
    [imageCache],
  );

  /*const data = useMemo(() => ({
    nodes: [...user.themes, ...user.contacts],
    links: user.links,
  }), [user]);*/

  return (
    <div
      style={{
        backgroundImage: '/chat-bg-pattern-dark.png',
        minHeight: '100vh',
        color: 'white',
      }}
    >
      <img
        src="/app/assets/chat-bg-pattern-dark.png"
        alt=""
        className="absolute h-screen"
      />
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        nodeAutoColorBy="group"
        nodeCanvasObject={drawNode}
        dagLevelDistance={-100}
        nodePointerAreaPaint={(node, color, ctx) => {
          const imgSize = 10;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, imgSize / 2, 0, 2 * Math.PI, false);
          ctx.fill();
        }}
        warmupTicks={50}
        linkCanvasObject={(link, ctx) => {
          ctx.strokeStyle = getCssVariableValue('--tg-theme-button-color');
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(
            (link.source as { x: number; y: number }).x,
            (link.source as { x: number; y: number }).y,
          );
          ctx.lineTo(
            (link.target as { x: number; y: number }).x,
            (link.target as { x: number; y: number }).y,
          );
          ctx.stroke();
        }}
        enableNodeDrag={true}
      />
    </div>
  );
};

function getCssVariableValue(variableName: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
}

export default ForceGraph;
