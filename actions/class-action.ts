'use server';

import { prisma } from '@/lib/prisma';
import { ClassFormValues, classSchema } from '@/schemas';

export const createClass = async (userId:string, classData: ClassFormValues) => {

    try{

        
        if(!userId) throw new Error("Unauthorized")
            
        const validatedData =  classSchema.safeParse(classData)

        if(!validatedData.success) {
            throw new Error("Invalid class data")
        }

    const newClass = await prisma.class.create({
        data: {
            name: validatedData.data.name,
            type: validatedData.data.type,
            instructor: validatedData.data.instructor,
            description: validatedData.data.description,
            image: validatedData.data.image,
            capacity: validatedData.data.capacity,
            status: validatedData.data.status,
            locationId: validatedData.data.locationId,
            startsAt: validatedData.data.startsAt,
            endsAt: validatedData.data.endsAt,
        }
    })

    return {message:'class created suscessfully'}
    
}
catch (error) {
    console.error("Error creating class:", error)
    throw new Error("Failed to create class")
}
};

export const updateClass = async (classId:string, classData: ClassFormValues) => {

    try {
        const updatedClass = await prisma.class.update({
            where: {
                id: classId
            },
            data: {
                name: classData.name,
                type: classData.type,
                instructor: classData.instructor,
                description: classData.description,
                image: classData.image,
                capacity: classData.capacity,
                status: classData.status,
                locationId: classData.locationId,
                startsAt: classData.startsAt,
                endsAt: classData.endsAt,
            }
        })

        return { message: 'class updated successfully' }
    } catch (error) {
        console.error("Error updating class:", error)
        throw new Error("Failed to update class")
    }
};

export const deleteClass = async (userId:string, classId:string) => {

    try {
        
        if(!userId) throw new Error("Unauthorized")
        
        const existingClass = await prisma.class.findUnique({
            where:{
                id:classId
            }
        })

        if(!existingClass) throw new Error("Class not found")

        await prisma.class.delete({
            where: {
                id: classId
            }
        })

        return { message: 'class deleted successfully' }
    } catch (error) {
        console.error("Error deleting class:", error)
        throw new Error("Failed to delete class")
    }
};

export const cancelClass = async (userId:string, classId:string) => {

    try {
        
        if(!userId) throw new Error("Unauthorized")
        
        const existingClass = await prisma.class.findUnique({
            where:{
                id:classId
            }
        })

        if(!existingClass) throw new Error("Class not found")

        await prisma.class.update({
            where: {
                id: classId
            },
            data: {
                status: "CANCELLED"
            }
        })

        return { message: 'class cancelled successfully' }
    } catch (error) {
        console.error("Error cancelling class:", error)
        throw new Error("Failed to cancel class")
    }
};
