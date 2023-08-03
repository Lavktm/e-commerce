import Navbar from "@/components/navbar";
import prismadb from "@/lib/primadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: { storeId: string }
}) {
    //checking user is logged in or not
    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in')
    }
    //loading store created by the user
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    })

    if (!store) {
        redirect('/')
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    )

}

