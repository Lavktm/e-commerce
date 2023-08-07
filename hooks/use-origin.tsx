//Safely access windows object in Next13 this tricky because on server side
//windows object is not available 

import { useEffect, useState } from "react"

export const useOrigion = () => {
    const [mounted, setMounted] = useState(false)
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : '';

    useEffect(() => { setMounted(true) }, [])

    if (!mounted) {
        return null
    }
    return (
        origin
    )
}