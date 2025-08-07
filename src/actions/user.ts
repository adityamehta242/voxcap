'use server'

import client from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server"

export const onAuthenticateUser = async () => {
    try {
        const user = await currentUser();
        if (!user) {
            return { status: 403 }
        }

        const userExist = await client.user.findUnique({
            where: {
                clerkid: user.id
            },
            include: {
                workspace: {
                    where: {
                        User: {
                            clerkid: user.id
                        },
                    },
                },
            },
        })

        if (userExist) {
            return { status: 200, user: userExist }
        }

        const newUser = await client.user.create({
            data: {
                clerkid: user.id,
                email: user.emailAddresses[0].emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.imageUrl,
                studio: {
                    create: {}
                },
                subscription: {
                    create: {}
                },
                workspace: {
                    create: {
                        name: `${user.firstName}'s Workspace`,
                        type: 'PERSONAL'
                    }
                }
            },
            include: {
                workspace: {
                    where: {
                        User: {
                            clerkid: user.id,
                        },
                    },
                },
                subscription: {
                    select: {
                        plan: true,
                    },
                },
            }
        })

        if (newUser) {
            return { status: 201, user: newUser }
        }else {
            return { status: 403 }
        }

    } catch (error) {
        return { status: 500 }
    }
}