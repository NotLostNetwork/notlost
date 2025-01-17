/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AppImport } from './routes/app'
import { Route as IndexImport } from './routes/index'
import { Route as AppIndexImport } from './routes/app/index'
import { Route as AppTryImport } from './routes/app/try'
import { Route as AppTgSignInImport } from './routes/app/tg-sign-in'
import { Route as AppOnboardingImport } from './routes/app/onboarding'
import { Route as AppAutoSignInJazzImport } from './routes/app/auto-sign-in-jazz'
import { Route as AppTabBarImport } from './routes/app/_tab-bar'
import { Route as AppTabBarGraphIndexImport } from './routes/app/_tab-bar/graph/index'
import { Route as AppTabBarEventsIndexImport } from './routes/app/_tab-bar/events/index'
import { Route as AppTabBarContactsIndexImport } from './routes/app/_tab-bar/contacts/index'
import { Route as AppTabBarEventsEventImport } from './routes/app/_tab-bar/events/event'

// Create/Update Routes

const AppRoute = AppImport.update({
  id: '/app',
  path: '/app',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AppIndexRoute = AppIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AppRoute,
} as any)

const AppTryRoute = AppTryImport.update({
  id: '/try',
  path: '/try',
  getParentRoute: () => AppRoute,
} as any)

const AppTgSignInRoute = AppTgSignInImport.update({
  id: '/tg-sign-in',
  path: '/tg-sign-in',
  getParentRoute: () => AppRoute,
} as any)

const AppOnboardingRoute = AppOnboardingImport.update({
  id: '/onboarding',
  path: '/onboarding',
  getParentRoute: () => AppRoute,
} as any)

const AppAutoSignInJazzRoute = AppAutoSignInJazzImport.update({
  id: '/auto-sign-in-jazz',
  path: '/auto-sign-in-jazz',
  getParentRoute: () => AppRoute,
} as any)

const AppTabBarRoute = AppTabBarImport.update({
  id: '/_tab-bar',
  getParentRoute: () => AppRoute,
} as any)

const AppTabBarGraphIndexRoute = AppTabBarGraphIndexImport.update({
  id: '/graph/',
  path: '/graph/',
  getParentRoute: () => AppTabBarRoute,
} as any)

const AppTabBarEventsIndexRoute = AppTabBarEventsIndexImport.update({
  id: '/events/',
  path: '/events/',
  getParentRoute: () => AppTabBarRoute,
} as any)

const AppTabBarContactsIndexRoute = AppTabBarContactsIndexImport.update({
  id: '/contacts/',
  path: '/contacts/',
  getParentRoute: () => AppTabBarRoute,
} as any)

const AppTabBarEventsEventRoute = AppTabBarEventsEventImport.update({
  id: '/events/event',
  path: '/events/event',
  getParentRoute: () => AppTabBarRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/app': {
      id: '/app'
      path: '/app'
      fullPath: '/app'
      preLoaderRoute: typeof AppImport
      parentRoute: typeof rootRoute
    }
    '/app/_tab-bar': {
      id: '/app/_tab-bar'
      path: ''
      fullPath: '/app'
      preLoaderRoute: typeof AppTabBarImport
      parentRoute: typeof AppImport
    }
    '/app/auto-sign-in-jazz': {
      id: '/app/auto-sign-in-jazz'
      path: '/auto-sign-in-jazz'
      fullPath: '/app/auto-sign-in-jazz'
      preLoaderRoute: typeof AppAutoSignInJazzImport
      parentRoute: typeof AppImport
    }
    '/app/onboarding': {
      id: '/app/onboarding'
      path: '/onboarding'
      fullPath: '/app/onboarding'
      preLoaderRoute: typeof AppOnboardingImport
      parentRoute: typeof AppImport
    }
    '/app/tg-sign-in': {
      id: '/app/tg-sign-in'
      path: '/tg-sign-in'
      fullPath: '/app/tg-sign-in'
      preLoaderRoute: typeof AppTgSignInImport
      parentRoute: typeof AppImport
    }
    '/app/try': {
      id: '/app/try'
      path: '/try'
      fullPath: '/app/try'
      preLoaderRoute: typeof AppTryImport
      parentRoute: typeof AppImport
    }
    '/app/': {
      id: '/app/'
      path: '/'
      fullPath: '/app/'
      preLoaderRoute: typeof AppIndexImport
      parentRoute: typeof AppImport
    }
    '/app/_tab-bar/events/event': {
      id: '/app/_tab-bar/events/event'
      path: '/events/event'
      fullPath: '/app/events/event'
      preLoaderRoute: typeof AppTabBarEventsEventImport
      parentRoute: typeof AppTabBarImport
    }
    '/app/_tab-bar/contacts/': {
      id: '/app/_tab-bar/contacts/'
      path: '/contacts'
      fullPath: '/app/contacts'
      preLoaderRoute: typeof AppTabBarContactsIndexImport
      parentRoute: typeof AppTabBarImport
    }
    '/app/_tab-bar/events/': {
      id: '/app/_tab-bar/events/'
      path: '/events'
      fullPath: '/app/events'
      preLoaderRoute: typeof AppTabBarEventsIndexImport
      parentRoute: typeof AppTabBarImport
    }
    '/app/_tab-bar/graph/': {
      id: '/app/_tab-bar/graph/'
      path: '/graph'
      fullPath: '/app/graph'
      preLoaderRoute: typeof AppTabBarGraphIndexImport
      parentRoute: typeof AppTabBarImport
    }
  }
}

// Create and export the route tree

interface AppTabBarRouteChildren {
  AppTabBarEventsEventRoute: typeof AppTabBarEventsEventRoute
  AppTabBarContactsIndexRoute: typeof AppTabBarContactsIndexRoute
  AppTabBarEventsIndexRoute: typeof AppTabBarEventsIndexRoute
  AppTabBarGraphIndexRoute: typeof AppTabBarGraphIndexRoute
}

const AppTabBarRouteChildren: AppTabBarRouteChildren = {
  AppTabBarEventsEventRoute: AppTabBarEventsEventRoute,
  AppTabBarContactsIndexRoute: AppTabBarContactsIndexRoute,
  AppTabBarEventsIndexRoute: AppTabBarEventsIndexRoute,
  AppTabBarGraphIndexRoute: AppTabBarGraphIndexRoute,
}

const AppTabBarRouteWithChildren = AppTabBarRoute._addFileChildren(
  AppTabBarRouteChildren,
)

interface AppRouteChildren {
  AppTabBarRoute: typeof AppTabBarRouteWithChildren
  AppAutoSignInJazzRoute: typeof AppAutoSignInJazzRoute
  AppOnboardingRoute: typeof AppOnboardingRoute
  AppTgSignInRoute: typeof AppTgSignInRoute
  AppTryRoute: typeof AppTryRoute
  AppIndexRoute: typeof AppIndexRoute
}

const AppRouteChildren: AppRouteChildren = {
  AppTabBarRoute: AppTabBarRouteWithChildren,
  AppAutoSignInJazzRoute: AppAutoSignInJazzRoute,
  AppOnboardingRoute: AppOnboardingRoute,
  AppTgSignInRoute: AppTgSignInRoute,
  AppTryRoute: AppTryRoute,
  AppIndexRoute: AppIndexRoute,
}

const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/app': typeof AppTabBarRouteWithChildren
  '/app/auto-sign-in-jazz': typeof AppAutoSignInJazzRoute
  '/app/onboarding': typeof AppOnboardingRoute
  '/app/tg-sign-in': typeof AppTgSignInRoute
  '/app/try': typeof AppTryRoute
  '/app/': typeof AppIndexRoute
  '/app/events/event': typeof AppTabBarEventsEventRoute
  '/app/contacts': typeof AppTabBarContactsIndexRoute
  '/app/events': typeof AppTabBarEventsIndexRoute
  '/app/graph': typeof AppTabBarGraphIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/app': typeof AppIndexRoute
  '/app/auto-sign-in-jazz': typeof AppAutoSignInJazzRoute
  '/app/onboarding': typeof AppOnboardingRoute
  '/app/tg-sign-in': typeof AppTgSignInRoute
  '/app/try': typeof AppTryRoute
  '/app/events/event': typeof AppTabBarEventsEventRoute
  '/app/contacts': typeof AppTabBarContactsIndexRoute
  '/app/events': typeof AppTabBarEventsIndexRoute
  '/app/graph': typeof AppTabBarGraphIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/app': typeof AppRouteWithChildren
  '/app/_tab-bar': typeof AppTabBarRouteWithChildren
  '/app/auto-sign-in-jazz': typeof AppAutoSignInJazzRoute
  '/app/onboarding': typeof AppOnboardingRoute
  '/app/tg-sign-in': typeof AppTgSignInRoute
  '/app/try': typeof AppTryRoute
  '/app/': typeof AppIndexRoute
  '/app/_tab-bar/events/event': typeof AppTabBarEventsEventRoute
  '/app/_tab-bar/contacts/': typeof AppTabBarContactsIndexRoute
  '/app/_tab-bar/events/': typeof AppTabBarEventsIndexRoute
  '/app/_tab-bar/graph/': typeof AppTabBarGraphIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/app'
    | '/app/auto-sign-in-jazz'
    | '/app/onboarding'
    | '/app/tg-sign-in'
    | '/app/try'
    | '/app/'
    | '/app/events/event'
    | '/app/contacts'
    | '/app/events'
    | '/app/graph'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/app'
    | '/app/auto-sign-in-jazz'
    | '/app/onboarding'
    | '/app/tg-sign-in'
    | '/app/try'
    | '/app/events/event'
    | '/app/contacts'
    | '/app/events'
    | '/app/graph'
  id:
    | '__root__'
    | '/'
    | '/app'
    | '/app/_tab-bar'
    | '/app/auto-sign-in-jazz'
    | '/app/onboarding'
    | '/app/tg-sign-in'
    | '/app/try'
    | '/app/'
    | '/app/_tab-bar/events/event'
    | '/app/_tab-bar/contacts/'
    | '/app/_tab-bar/events/'
    | '/app/_tab-bar/graph/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AppRoute: typeof AppRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AppRoute: AppRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/app"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/app": {
      "filePath": "app.tsx",
      "children": [
        "/app/_tab-bar",
        "/app/auto-sign-in-jazz",
        "/app/onboarding",
        "/app/tg-sign-in",
        "/app/try",
        "/app/"
      ]
    },
    "/app/_tab-bar": {
      "filePath": "app/_tab-bar.tsx",
      "parent": "/app",
      "children": [
        "/app/_tab-bar/events/event",
        "/app/_tab-bar/contacts/",
        "/app/_tab-bar/events/",
        "/app/_tab-bar/graph/"
      ]
    },
    "/app/auto-sign-in-jazz": {
      "filePath": "app/auto-sign-in-jazz.tsx",
      "parent": "/app"
    },
    "/app/onboarding": {
      "filePath": "app/onboarding.tsx",
      "parent": "/app"
    },
    "/app/tg-sign-in": {
      "filePath": "app/tg-sign-in.tsx",
      "parent": "/app"
    },
    "/app/try": {
      "filePath": "app/try.tsx",
      "parent": "/app"
    },
    "/app/": {
      "filePath": "app/index.tsx",
      "parent": "/app"
    },
    "/app/_tab-bar/events/event": {
      "filePath": "app/_tab-bar/events/event.tsx",
      "parent": "/app/_tab-bar"
    },
    "/app/_tab-bar/contacts/": {
      "filePath": "app/_tab-bar/contacts/index.tsx",
      "parent": "/app/_tab-bar"
    },
    "/app/_tab-bar/events/": {
      "filePath": "app/_tab-bar/events/index.tsx",
      "parent": "/app/_tab-bar"
    },
    "/app/_tab-bar/graph/": {
      "filePath": "app/_tab-bar/graph/index.tsx",
      "parent": "/app/_tab-bar"
    }
  }
}
ROUTE_MANIFEST_END */
