export interface Questionnaire {
    createdAt: string;
    lastModified: string;
    name: string;
    questions: Question[];
    schedule: {[key: string]: string}[];
    userID: string;
    weekdays: string[];
    _id: string;
}

interface Question {
    _id: string;
    open: boolean;
    phrase: string;
}