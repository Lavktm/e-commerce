import prismadb from "@/lib/primadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

//GET
export async function GET(req: Request,
    { params }: { params: { categoryId: string } }
) {
    try {
        if (!params.categoryId) {
            return new NextResponse("Category id is required", { status: 400 })
        }
        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            },
        })
        return NextResponse.json(category);
    }
    catch (error) {
        console.log('[CATEGORY_GET]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

//PATCH ROUTE UPDATE STORE
//billboardId comes from categoryId folder above in hierarchy
export async function PATCH(req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, billboardId } = body
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!billboardId) {
            return new NextResponse("Category Id is required", { status: 400 })
        }

        if (!params.categoryId) {
            return new NextResponse("Category id is required", { status: 400 })
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

        const category = await prismadb.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId,
            }
        })

        return NextResponse.json(category);
    }
    catch (error) {
        console.log('[CATEGORIES_PATCH]', error)
        return new NextResponse("Internal error", { status: 500 })
    }

}

//DELETE
export async function DELETE(req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {
        const { userId } = auth();


        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params.categoryId) {
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

        const category = await prismadb.category.deleteMany({
            where: {
                id: params.categoryId,
            },

        })

        return NextResponse.json(category);
    }
    catch (error) {
        console.log('[CATEGORY_DELETE]', error)
        return new NextResponse("Internal error", { status: 500 })
    }

}