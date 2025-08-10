"use server"

import client from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export const verifyAccessToWorkspace = async (workspaceid: string) => {
    try {
        const userr = await currentUser()
        if (!userr) return { status: 403 }

        const isUserInWorkspace = await client.workspace.findUnique({
            where: {
                id: workspaceid,
                OR: [{
                    user: {
                        clerkid: userr.id
                    }
                },
                {
                    members: {
                        every: {
                            User: {
                                clerkid: userr.id
                            }
                        }
                    }
                }
                ]
            }
        })

        return {
            status: 200,
            data: { workspace: isUserInWorkspace }
        }

    } catch (error) {
        return {
            status: 403,
            workspace: null
        }
    }
}

export const getWorkspaceFolders = async (workspaceId: string) => {
    try {
        const isFolder = await client.folder.findMany({
            where: {
                workspaceId,
            },
            include: {
                _count: {
                    select: {
                        videos: true
                    }
                }
            }
        })

        if (isFolder && isFolder.length > 0) {
            return {
                status: 200,
                data: isFolder
            }
        } else {
            return {
                status: 404,
                data: []
            }
        }

    } catch (error) {
        return {
            status: 403,
            data: []
        }
    }
}

export const getAllUserVideos = async (workspaceId: string) => {
    try {
        const user = await currentUser()
        if (!user) return { status: 404 }

        const videos = await client.video.findMany({
            where: {
                OR: [
                    { workspaceId }, { folderId: workspaceId }
                ]
            },
            select: {
                id: true,
                title: true,
                source: true,
                description: true,
                createdAt: true,
                processing: true,
                folder: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                user: {
                    select: {
                        firstname: true,
                        lastname: true,
                        image: true
                    }
                },
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        if (videos && videos.length > 0) {
            return {
                status: 200,
                data: videos
            }
        } else {
            return {
                status: 404,
                data: []
            }
        }

    } catch (error) {
        return {
            status: 400,
            data: null
        }
    }
}

export const getWorkspaces = async () => {
    try {
        const user = await currentUser()
        if (!user) return { status: 404 }

        const workspace = await client.user?.findUnique({
            where: {
                clerkid: user.id
            },
            select: {
                subscription: {
                    select: {
                        plan: true
                    }
                },
                workspaces: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                    }
                },
                members: {
                    select: {
                        workspace: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                            }
                        }
                    }
                },
            }
        })

        if (workspace) {
            return {
                status: 200,
                data: workspace
            }
        } else {
            return {
                status: 404,
                data: []
            }
        }

    } catch (error) {
        return {
            status: 400
        }
    }
}

