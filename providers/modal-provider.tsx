"use client";

import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/store-modal";


export const ModalProvider = () => {
    //Precaution to avoid hydration error on with modal, aysnchronization 
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    },
        []
    )
    //means the app is at server side
    if (!isMounted) {
        return null
    }
    return (
        <>
            <StoreModal />
        </>
    )

}