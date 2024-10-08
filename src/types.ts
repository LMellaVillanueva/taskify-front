
export interface Task {
    id: number
    description: string
    urgency: boolean
    date: Date
    elim: boolean
    color: string
    reminder: Date
    userId: string
    user?: User
}

export interface User {
    id: string
    name: string
    email: string
    password: string
    admin?: boolean
}

export type TasksList = Task[];
export type UsersList = User[];