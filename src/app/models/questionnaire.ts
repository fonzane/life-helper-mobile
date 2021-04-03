export interface Questionnaire {
    createdAt: string;
    lastModified: string;
    name: string;
    questions: Question[];
    schedule: Schedule[];
    userID: string;
    weekdays: string[];
    _id: string;
}

interface Question {
    _id: string;
    open: boolean;
    phrase: string;
}

export interface Schedule {
    [key: string]: string;
}