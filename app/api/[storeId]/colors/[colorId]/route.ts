import prismadb from "@/lib/primadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

//GET
export async function GET(req: Request,
    { params }: { params: { colorId: string } }
) {
    try {
        if (!params.colorId) {
            return new NextResponse("Color id is required", { status: 400 })
        }
        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId,
            },
        })
        return NextResponse.json(color);
    }
    catch (error) {
        console.log('[COLOR_GET]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

//PATCH ROUTE UPDATE STORE
//colorId comes from colorId folder above in hierarchy
export async function PATCH(req: Request,
    { params }: { params: { storeId: string, colorId: string } }
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

        if (!params.colorId) {
            return new NextResponse("Color id is required", { status: 400 })
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

        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(color);
    }
    catch (error) {
        console.log('[COLORS_PATCH]', error)
        return new NextResponse("Internal error", { status: 500 })
    }

}

//DELETE
export async function DELETE(req: Request,
    { params }: { params: { storeId: string, colorId: string } }
) {
    try {
        const { userId } = auth();


        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params.colorId) {
            return new NextResponse("Color id is required", { status: 400 })
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

        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId,
            },

        })

        return NextResponse.json(color);
    }
    catch (error) {
        console.log('[COLOR_DELETE]', error)
        return new NextResponse("Internal error", { status: 500 })
    }

}