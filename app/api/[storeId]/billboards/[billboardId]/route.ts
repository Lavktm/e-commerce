import prismadb from "@/lib/primadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

//GET
export async function GET(req: Request,
    { params }: { params: { billboardId: string } }
) {
    try {
        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 })
        }
        const billboard = await prismadb.billBoard.findUnique({
            where: {
                id: params.billboardId,
            },
        })
        return NextResponse.json(billboard);
    }
    catch (error) {
        console.log('[BILLBOARD_GET]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

//PATCH ROUTE UPDATE STORE
//billboardId comes from billBoardId folder above in hierarchy
export async function PATCH(req: Request,
    { params }: { params: { storeId: string, billboardId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { label, imageUrl } = body
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
        if (!label) {
            return new NextResponse("Label is required", { status: 400 })
        }

        if (!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 })
        }

        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 })
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

        const billboard = await prismadb.billBoard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        })

        return NextResponse.json(billboard);
    }
    catch (error) {
        console.log('[BILLBOARDS_PATCH]', error)
        return new NextResponse("Internal error", { status: 500 })
    }

}

//DELETE
export async function DELETE(req: Request,
    { params }: { params: { storeId: string, billboardId: string } }
) {
    try {
        const { userId } = auth();


        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 })
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

        const billboard = await prismadb.billBoard.deleteMany({
            where: {
                id: params.billboardId,
            },

        })

        return NextResponse.json(billboard);
    }
    catch (error) {
        console.log('[BILLBOARD_DELETE]', error)
        return new NextResponse("Internal error", { status: 500 })
    }

}