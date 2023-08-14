import prismadb from "@/lib/primadb"
import { CategoryForm } from "./components/category-form"


const CategoryPage = async ({ params }: { params: { categoryId: string, storeId: string } }) => {
    //fetching existing category
    const category = await prismadb.category.findUnique({
        where: {
            id: params.categoryId
        }
    })
    //fetching existing billboards
    const billboards = await prismadb.billBoard.findMany({
        where: {
            storeId: params.storeId
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-x-4 p-8 pt-6">
                <CategoryForm
                    initialData={category}
                    billboards={billboards}
                />
            </div>
        </div>
    )
}

export default CategoryPage