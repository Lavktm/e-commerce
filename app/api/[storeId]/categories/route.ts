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

        const { name, billboardId } = body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 })
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

        const billboard = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId
            }
        })
        return NextResponse.json(billboard)
    }
    catch (error) {
        console.log('[CATEGORIES_POST]', error)
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

        const categories = await prismadb.category.findMany({
            where: {
                storeId: params.storeId
            }
        })
        return NextResponse.json(categories)
    }
    catch (error) {
        console.log('[CATEGORIES_GET]', error)
        return new NextResponse("Internal error", { status: 500 })
    }

}