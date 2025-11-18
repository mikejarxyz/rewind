'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { Invitation } from '@/actions/invitations'

interface InviteFormProps {
  invitation: Invitation
}

export function InviteForm({ invitation }: InviteFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate passwords
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters')
        setIsLoading(false)
        return
      }

      if (password !== confirmPassword) {
        toast.error('Passwords do not match')
        setIsLoading(false)
        return
      }

      const supabase = createClient()

      // Create the user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: invitation.email,
        password,
        options: {
          data: {
            invitation_token: invitation.token,
          },
        },
      })

      if (signUpError) {
        toast.error(signUpError.message)
        setIsLoading(false)
        return
      }

      if (!authData.user) {
        toast.error('Failed to create account')
        setIsLoading(false)
        return
      }

      // Accept the invitation (creates profile with correct organization and role)
      const { data: acceptResult, error: acceptError } = await supabase.rpc(
        'accept_invitation',
        {
          invitation_token: invitation.token,
          user_id: authData.user.id,
        }
      )

      if (acceptError || !acceptResult?.success) {
        toast.error(acceptResult?.error || 'Failed to accept invitation')
        setIsLoading(false)
        return
      }

      toast.success('Account created successfully!')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Error accepting invitation:', error)
      toast.error('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={invitation.email}
          disabled
          className="bg-muted"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          disabled={isLoading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Accept Invitation'}
      </Button>
    </form>
  )
}
