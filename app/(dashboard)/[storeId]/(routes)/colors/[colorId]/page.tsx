import prismadb from "@/lib/primadb"
import { ColorForm } from "./components/color-form"


const ColorPage = async ({ params }: { params: { colorId: string } }) => {
    //fetching existing  color
    const color = await prismadb.color.findUnique({
        where: {
            id: params.colorId
        }
    })
    return (
        <div className="flex-col">
            <div className="flex-1 space-x-4 p-8 pt-6">
                <ColorForm initialData={color} />
            </div>
        </div>
    )
}

export default ColorPage