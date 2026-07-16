import { prisma } from "@/lib/prisma";

export const getAllLocations= async()=>{

    try {
        const locations= await prisma.location.findMany({
            select:{
                id:true,
                name:true
            }
        });
        return locations;
    } catch (error) {
        console.error("Error fetching locations:", error);
        throw new Error("Failed to fetch locations");
    }

}