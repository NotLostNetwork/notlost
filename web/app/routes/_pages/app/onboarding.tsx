'use client'

import { createFileRoute } from '@tanstack/react-router'
import OnboardingPage from '~/pages/onboarding'

export const Route = createFileRoute('/_pages/app/onboarding')({
  component: OnboardingPage,
  staleTime: Infinity,
})
