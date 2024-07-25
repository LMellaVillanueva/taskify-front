export enum Important {
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
}

export interface Task {
    id: number
    description: string
    urgency: boolean
    important: Important
    date: Date
    elim: boolean
}

export type TasksList = Task[];