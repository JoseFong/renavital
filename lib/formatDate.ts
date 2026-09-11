export function formatDate(d: string) {
    try {
        let months = [
            "Ene",
            "Feb",
            "Mar",
            "Abr",
            "May",
            "Jun",
            "Jul",
            "Ago",
            "Sep",
            "Oct",
            "Nov",
            "Dic"
        ]

        let parts = d.split("-")
        if(parts.length!==3) return "-"
        return parts[2] + "/" + months[Number(parts[1]) - 1] + "/" + parts[0]
    } catch (e: any) {
        return "-"
    }
}