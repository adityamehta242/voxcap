import { getNotifications, onAuthenticateUser } from '@/actions/user'
import { getAllUserVideos, getWorkspaceFolders, getWorkspaces, verifyAccessToWorkspace } from '@/actions/workspace'
import { redirect } from 'next/navigation'
import { queryClient } from '@/lib/queryClient'
import React from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

type Props = {
    params: {
        workspaceid: string
    },
    children: React.ReactNode
}

const Layout = async ({ params: { workspaceid }, children }: Props) => {
    const auth = await onAuthenticateUser()

    if (!auth.user?.workspaces) redirect(`/auth/signin`)
    if(!auth.user?.workspaces.length) redirect(`/auth/signin`)

    const hasAccess = await verifyAccessToWorkspace(workspaceid)
    if(hasAccess?.status !== 200) redirect(`/dashboard/${auth.user?.workspaces[0].id}`)
    if (!hasAccess.data?.workspace) {
        return null;
    }
    
    await queryClient.prefetchQuery({
        queryKey: ['workspace-folders'],
        queryFn: () => getWorkspaceFolders(workspaceid),
    })
    await queryClient.prefetchQuery({
        queryKey: ['user-videos'],
        queryFn: () => getAllUserVideos(workspaceid),
    })
    await queryClient.prefetchQuery({
        queryKey: ['user-workspaces'],
        queryFn: () => getWorkspaces(),
    })
    await queryClient.prefetchQuery({
        queryKey: ['user-notifications'],
        queryFn: () => getNotifications(),
    })



    return (
        <HydrationBoundary state={dehydrate(queryClient)}> 
            <div className='flex h-screen w-screen'>
                {/* <Sidebar actionworkspaceId={workspaceid} /> */}
            </div>
        </HydrationBoundary>
    )
}

export default Layout;