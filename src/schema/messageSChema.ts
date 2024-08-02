import {z} from 'zod'

export const messageSchema = z.object({
    content : z.string().min(10,{message: "Content must be at least of 10 characters"})
    .max(300,"Content must be not more that of 300 characters"),
})