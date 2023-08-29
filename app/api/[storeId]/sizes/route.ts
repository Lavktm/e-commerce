import prismadb from "@/lib/primadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        //creating store
        //Using clerk to authenticate the POST route
        const { userId } = auth()
        const body = await req.json()

        const { name, value } = body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!value) {
            return new NextResponse("Value is required", { status: 400 })
        }

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }
        //Checking storeId exist for the current user
        const storeByuserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })
        // check added if user is tries to update someone else  store
        if (!storeByuserId) {
            return new NextResponse("Unauthorized", { status: 403 })
        }

        const size = await prismadb.size.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        })
        return NextResponse.json(size)
    }
    catch (error) {
        console.log('[SIZES_POST]', error)
        return new NextResponse("Internal error", { status: 500 })
    }

}


export async function GET(req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }

        const sizes = await prismadb.size.findMany({
            where: {
                storeId: params.storeId
            }
        })
        return NextResponse.json(sizes)
    }
    catch (error) {
        console.log('[SIZES_GET]', error)
        return new NextResponse("Internal error", { status: 500 })
    }

}