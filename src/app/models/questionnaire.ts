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

export interface SolvedQuestionnaire {
    _id: string;
    solvedAt: string;
    name: string;
    solvedQuestions: SolvedQuestion[];
    userID: string;
    number: number;
}

export interface SolvedQuestion extends Question {
    answer: string | number;
}

export interface Question {
    _id: string;
    open: boolean;
    phrase: string;
}

export interface Schedule {
    [key: string]: string;
}