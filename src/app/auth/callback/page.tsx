import { onAuthenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {}

const AuthCallbackPage = async (props: Props) => {
  const auth = await onAuthenticateUser();
  if (auth.status ===200 || auth.status === 201) {
    return redirect(`/dashboard/${auth.user?.firstname}${auth.user?.lastname}`)
  }

  if (auth.status === 400 || auth.status === 404 || auth.status === 500) {
    return redirect('/auth/signin')
  }
}

export default AuthCallbackPage;