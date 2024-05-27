import zod, { z, ZodType } from 'zod'

// Role Schema Zod
export const schemaRoles: ZodType = zod.object({
    name: zod.string({
        required_error: 'Role name is required!',
        invalid_type_error: 'Role name must be a string'
    }).min(1, {
        message: 'Role name cannot be empty character'
    }).max(30, {
        message: 'Role name characters is too long'
    })
})

// Room Schema Zod
export const schemaRooms: ZodType = zod.object({
    name: zod.string({
        invalid_type_error: 'Room name is required!',
        required_error: 'Room name must be a string'
    }).min(1, {
        message: 'Room name cannot be empty character'
    }),
    amount: zod.coerce.number({
        required_error: 'Room amount is required!',
        invalid_type_error: 'Room amount must be a number'
    }).int({
        message: 'Room amount must be an integer'
    }).gte(1, {
        message: 'Room amount cannot be empty'
    }).lte(99999, {
        message: 'Room amount is too large'
    })
})

// User Schema Zod
export const schemaUsers: ZodType = zod.object({
    email: zod.string({
        required_error: 'Email is required!',
        invalid_type_error: 'Email must be a string'
    }).email({
        message: 'Invalid email address'
    }).min(5, {
        message: 'Role cannot be empty character'
    }).max(254, {
        message: 'Email characters is too long'
    }),
    password: zod.string({
        required_error: 'Password is required!',
        invalid_type_error: 'Email must be a string'
    }).min(8, {
        message: 'Password must be 8 or more characters long'
    })
})

// User Sign Up Schema Zod
export const schemaUserAdd: ZodType = zod.object({
    email: zod.string({
        required_error: 'Email is required!',
        invalid_type_error: 'Email must be a string'
    }).email({
        message: 'Invalid email address'
    }).min(5, {
        message: 'Role cannot be empty character'
    }).max(254, {
        message: 'Email characters is too long'
    }),
    password: zod.string({
        required_error: 'Password is required!',
        invalid_type_error: 'Email must be a string'
    }).min(8, {
        message: 'Password must be 8 or more characters long'
    }),
    confirmPassword: zod.string({
        required_error: 'Password is required!',
        invalid_type_error: 'Email must be a string'
    }).min(8, {
        message: 'Password must be 8 or more characters long'
    })
}).superRefine(({ confirmPassword, password }, ctx: z.RefinementCtx): void => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Confirm Password must match with Password'
        })
    }
})