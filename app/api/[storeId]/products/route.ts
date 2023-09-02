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

        const { name,
            images,
            price,
            categoryId,
            colorId,
            sizeId,
            isFeatured,
            isArchived
        } = body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!images || !images.length) {
            return new NextResponse("Images is required", { status: 400 })
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 })
        }

        if (!categoryId) {
            return new NextResponse("Category ID is required", { status: 400 })
        }

        if (!colorId) {
            return new NextResponse("Color ID is required", { status: 400 })
        }

        if (!sizeId) {
            return new NextResponse("Size ID is required", { status: 400 })
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

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                isFeatured,
                isArchived,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        })
        return NextResponse.json(product)
    }
    catch (error) {
        console.log('[PRODUCTS_POST]', error)
        return new NextResponse("Internal error", { status: 500 })
    }

}


export async function GET(req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get("categoryId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const isFeatured = searchParams.get("isFeatured")


        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return NextResponse.json(products)
    }
    catch (error) {
        console.log('[PRODUCTS_GET]', error)
        return new NextResponse("Internal error", { status: 500 })
    }

}