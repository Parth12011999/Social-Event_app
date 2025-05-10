import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><RegisterForm/></div>
}
