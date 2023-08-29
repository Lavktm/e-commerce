import prismadb from "@/lib/primadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

//GET
export async function GET(req: Request,
    { params }: { params: { sizeId: string } }
) {
    try {
        if (!params.sizeId) {
            return new NextResponse("Size id is required", { status: 400 })
        }
        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId,
            },
        })
        return NextResponse.json(size);
    }
    catch (error) {
        console.log('[SIZE_GET]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

//PATCH ROUTE UPDATE STORE
//sizeId comes from sizeId folder above in hierarchy
export async function PATCH(req: Request,
    { params }: { params: { storeId: string, sizeId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
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

        if (!params.sizeId) {
            return new NextResponse("Size id is required", { status: 400 })
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

        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(size);
    }
    catch (error) {
        console.log('[SIZES_PATCH]', error)
        return new NextResponse("Internal error", { status: 500 })
    }

}

//DELETE
export async function DELETE(req: Request,
    { params }: { params: { storeId: string, sizeId: string } }
) {
    try {
        const { userId } = auth();


        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params.sizeId) {
            return new NextResponse("Size id is required", { status: 400 })
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

        const size = await prismadb.size.deleteMany({
            where: {
                id: params.sizeId,
            },

        })

        return NextResponse.json(size);
    }
    catch (error) {
        console.log('[SIZE_DELETE]', error)
        return new NextResponse("Internal error", { status: 500 })
    }

}