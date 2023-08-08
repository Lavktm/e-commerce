import prismadb from "@/lib/primadb"
import { BillboardForm } from "./components/billboard-form"


const BillboardPage = async ({ params }: { params: { billboardId: string } }) => {
    //fetching existing billboard
    const billboard = await prismadb.billBoard.findUnique({
        where: {
            id: params.billboardId
        }
    })
    return (
        <div className="flex-col">
            <div className="flex-1 space-x-4 p-8 pt-6">
                <BillboardForm initialData={billboard} />
            </div>
        </div>
    )
}

export default BillboardPage