export interface Profile {
    id: string;
    user_id: string;
    full_name: string;
    email: string;
    role: 'student' | 'faculty' | 'bod';
    level: number;
    rank: string;
    bio?: string;
    city?: string;
    phone?: string;
    interests?: string[];
}

export const MOCK_PROFILES: Profile[] = [
    // Board of Directors
    {
        id: 'bod-1',
        user_id: 'u-bod-1',
        full_name: 'Dr. Hasmukh Lal',
        email: 'hasmukh@ramay.edu',
        role: 'bod',
        level: 99,
        rank: 'Dean of Laughter',
    },
    {
        id: 'bod-2',
        user_id: 'u-bod-2',
        full_name: 'Dr. Giggle Sharma',
        email: 'giggle@ramay.edu',
        role: 'bod',
        level: 90,
        rank: 'Director of Chuckles',
    },

    // Faculty
    {
        id: 'fac-1',
        user_id: 'u-fac-1',
        full_name: 'Prof. Joke Singh',
        email: 'joke@ramay.edu',
        role: 'faculty',
        level: 50,
        rank: 'Senior Professor',
    },
    {
        id: 'fac-2',
        user_id: 'u-fac-2',
        full_name: 'Ms. Smilie Kaur',
        email: 'smilie@ramay.edu',
        role: 'faculty',
        level: 45,
        rank: 'Associate Professor',
    },
    {
        id: 'fac-3',
        user_id: 'u-fac-3',
        full_name: 'Mr. Punny Wala',
        email: 'punny@ramay.edu',
        role: 'faculty',
        level: 40,
        rank: 'Lecturer',
    },

    // Students
    {
        id: 'stu-1',
        user_id: 'u-stu-1',
        full_name: 'Funny Bones',
        email: 'funny@student.ramay.edu',
        role: 'student',
        level: 10,
        rank: 'Class Clown',
    },
    {
        id: 'stu-2',
        user_id: 'u-stu-2',
        full_name: 'Hilarious Harry',
        email: 'harry@student.ramay.edu',
        role: 'student',
        level: 8,
        rank: 'Novice Jester',
    },
    {
        id: 'stu-3',
        user_id: 'u-stu-3',
        full_name: 'Witty Wendy',
        email: 'wendy@student.ramay.edu',
        role: 'student',
        level: 15,
        rank: 'Witty Wizard',
    },
    {
        id: 'stu-4',
        user_id: 'u-stu-4',
        full_name: 'Silly Sally',
        email: 'sally@student.ramay.edu',
        role: 'student',
        level: 5,
        rank: 'Giggle Starter',
    },
    {
        id: 'stu-5',
        user_id: 'u-stu-5',
        full_name: 'Chuckling Charlie',
        email: 'charlie@student.ramay.edu',
        role: 'student',
        level: 12,
        rank: 'Humor Apprentice',
    },
];

export const MOCK_USER = {
    id: 'mock-user-id',
    email: 'mock@example.com',
};
