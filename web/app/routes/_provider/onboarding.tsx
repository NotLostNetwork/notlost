'use client'

import { createFileRoute } from '@tanstack/react-router'
import OnboardingPage from '~/pages/onboarding/page'

export const Route = createFileRoute('/_provider/onboarding')({
  component: OnboardingPage,
  staleTime: Infinity,
})
