'use client'

import { createFileRoute } from '@tanstack/react-router'
import OnboardingPage from '~/pages/onboarding/page'

export const Route = createFileRoute('/_pages/onboarding')({
  component: OnboardingPage,
  staleTime: Infinity,
})
