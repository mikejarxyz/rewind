import { getInvitationByToken } from '@/actions/invitations'
import { InviteForm } from './invite-form'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function InvitePage({ params }: { params: { token: string } }) {
  const { success, data: invitation, error } = await getInvitationByToken(params.token)

  if (!success || !invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription>
              {error || 'This invitation link is invalid or has expired.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Please contact your administrator for a new invitation.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Accept Invitation</CardTitle>
          <CardDescription>
            You've been invited to join as a <strong>{invitation.role.replace('_', ' ')}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InviteForm invitation={invitation} />
        </CardContent>
      </Card>
    </div>
  )
}
