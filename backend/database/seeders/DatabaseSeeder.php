<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Curriculum;
use App\Models\Module;
use App\Models\Cohort;
use App\Models\Enrollment;
use App\Models\Notification;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create BOD user
        $bod = User::create([
            'name' => 'Board Administrator',
            'email' => 'bod@academy.com',
            'password' => Hash::make('password123'),
            'role' => 'bod',
            'rank' => 'Board Director',
            'level' => 10,
            'bio' => 'Academy oversight and strategic planning.',
        ]);

        // Create Faculty/Teachers
        $teacher1 = User::create([
            'name' => 'Dr. Sarah Mitchell',
            'email' => 'sarah@academy.com',
            'password' => Hash::make('password123'),
            'role' => 'faculty',
            'rank' => 'Senior Architect',
            'level' => 8,
            'bio' => 'Expert in satire and comedic timing with 15 years of experience.',
            'interests' => json_encode(['Satire', 'Writing', 'Stand-up']),
        ]);

        $teacher2 = User::create([
            'name' => 'Prof. James Chen',
            'email' => 'james@academy.com',
            'password' => Hash::make('password123'),
            'role' => 'faculty',
            'rank' => 'Master Architect',
            'level' => 9,
            'bio' => 'Specializes in public speaking and improvisational comedy.',
            'interests' => json_encode(['Improv', 'Public Speaking', 'Leadership']),
        ]);

        // Create Students
        $student1 = User::create([
            'name' => 'Alex Johnson',
            'email' => 'alex@student.com',
            'password' => Hash::make('password123'),
            'role' => 'student',
            'level' => 3,
            'bio' => 'Aspiring comedian learning the craft.',
            'interests' => json_encode(['Comedy', 'Writing']),
        ]);

        $student2 = User::create([
            'name' => 'Emma Rodriguez',
            'email' => 'emma@student.com',
            'password' => Hash::make('password123'),
            'role' => 'student',
            'level' => 2,
            'bio' => 'Marketing professional looking to improve presentation skills.',
            'interests' => json_encode(['Public Speaking', 'Leadership']),
        ]);

        $student3 = User::create([
            'name' => 'Marcus Williams',
            'email' => 'marcus@student.com',
            'password' => Hash::make('password123'),
            'role' => 'student',
            'level' => 4,
            'bio' => 'Stand-up comedian refining my technique.',
            'interests' => json_encode(['Stand-up', 'Storytelling']),
        ]);

        // Create Curriculums (Courses)
        $curriculum1 = Curriculum::create([
            'title' => 'Emotional Intelligence & Wit',
            'description' => 'Master the art of reading rooms, understanding social dynamics, and deploying humor with surgical precision. Learn timing, delivery techniques, and audience psychology.',
        ]);

        $curriculum2 = Curriculum::create([
            'title' => 'Public Speaking & Presence',
            'description' => 'Transform from speaker to performer. Master vocal techniques, develop stage presence, and learn crowd engagement strategies to command any stage with confidence.',
        ]);

        $curriculum3 = Curriculum::create([
            'title' => 'Adaptive Leadership',
            'description' => 'Lead with humor and authenticity. Apply humor in leadership contexts, build team rapport, and navigate difficult conversations with wit.',
        ]);

        $curriculum4 = Curriculum::create([
            'title' => 'Advanced Satire & Strategy',
            'description' => 'Beyond jokes—craft intelligent commentary that challenges and entertains. Master satirical writing, social commentary techniques, and develop your unique voice.',
        ]);

        // Create Modules for Curriculum 1
        $module1_1 = Module::create([
            'curriculum_id' => $curriculum1->id,
            'title' => 'Foundations of Emotional Reading',
            'description' => 'Learn to read micro-expressions and social cues to understand your audience.',
            'duration_months' => 2,
            'teacher_id' => $teacher1->id,
        ]);

        $module1_2 = Module::create([
            'curriculum_id' => $curriculum1->id,
            'title' => 'Timing & Delivery Mechanics',
            'description' => 'The science behind comedic timing and effective delivery.',
            'duration_months' => 2,
            'teacher_id' => $teacher1->id,
        ]);

        $module1_3 = Module::create([
            'curriculum_id' => $curriculum1->id,
            'title' => 'Advanced Wit Application',
            'description' => 'Apply wit in real-world scenarios with confidence.',
            'duration_months' => 3,
            'teacher_id' => $teacher1->id,
        ]);

        // Create Modules for Curriculum 2
        $module2_1 = Module::create([
            'curriculum_id' => $curriculum2->id,
            'title' => 'Voice & Vocal Power',
            'description' => 'Develop your vocal instrument for maximum impact.',
            'duration_months' => 2,
            'teacher_id' => $teacher2->id,
        ]);

        $module2_2 = Module::create([
            'curriculum_id' => $curriculum2->id,
            'title' => 'Stage Presence & Body Language',
            'description' => 'Command attention through physical presence.',
            'duration_months' => 2,
            'teacher_id' => $teacher2->id,
        ]);

        $module2_3 = Module::create([
            'curriculum_id' => $curriculum2->id,
            'title' => 'Audience Engagement Tactics',
            'description' => 'Interactive techniques to keep your audience captivated.',
            'duration_months' => 2,
            'teacher_id' => $teacher2->id,
        ]);

        // Create Modules for Curriculum 3
        $module3_1 = Module::create([
            'curriculum_id' => $curriculum3->id,
            'title' => 'Leadership Through Humor',
            'description' => 'Use humor as a leadership tool to build trust and rapport.',
            'duration_months' => 3,
            'teacher_id' => $teacher2->id,
        ]);

        $module3_2 = Module::create([
            'curriculum_id' => $curriculum3->id,
            'title' => 'Difficult Conversations',
            'description' => 'Navigate challenging discussions with grace and wit.',
            'duration_months' => 2,
            'teacher_id' => $teacher2->id,
        ]);

        // Create Modules for Curriculum 4
        $module4_1 = Module::create([
            'curriculum_id' => $curriculum4->id,
            'title' => 'Satirical Writing Fundamentals',
            'description' => 'Craft intelligent satire that entertains and enlightens.',
            'duration_months' => 3,
            'teacher_id' => $teacher1->id,
        ]);

        $module4_2 = Module::create([
            'curriculum_id' => $curriculum4->id,
            'title' => 'Social Commentary Techniques',
            'description' => 'Master the art of meaningful social commentary through humor.',
            'duration_months' => 3,
            'teacher_id' => $teacher1->id,
        ]);

        // Create Cohorts
        $cohort1 = Cohort::create([
            'module_id' => $module1_1->id,
            'title' => 'Spring 2025 Cohort',
            'start_date' => '2025-03-01',
            'end_date' => '2025-05-01',
            'capacity' => 30,
            'status' => 'active',
        ]);

        $cohort2 = Cohort::create([
            'module_id' => $module2_1->id,
            'title' => 'Spring 2025 Speaking Cohort',
            'start_date' => '2025-03-15',
            'end_date' => '2025-05-15',
            'capacity' => 25,
            'status' => 'active',
        ]);

        $cohort3 = Cohort::create([
            'module_id' => $module1_2->id,
            'title' => 'Summer 2025 Advanced',
            'start_date' => '2025-06-01',
            'end_date' => '2025-08-01',
            'capacity' => 20,
            'status' => 'planned',
        ]);

        // Enroll students in cohorts
        Enrollment::create([
            'cohort_id' => $cohort1->id,
            'student_id' => $student1->id,
            'status' => 'approved',
        ]);

        Enrollment::create([
            'cohort_id' => $cohort2->id,
            'student_id' => $student2->id,
            'status' => 'approved',
        ]);

        Enrollment::create([
            'cohort_id' => $cohort1->id,
            'student_id' => $student3->id,
            'status' => 'approved',
        ]);

        // Create notifications for teachers about their assigned modules
        Notification::create([
            'user_id' => $teacher1->id,
            'type' => 'module_assigned',
            'title' => 'New Module Assignment',
            'message' => 'You have been assigned to teach: Foundations of Emotional Reading',
        ]);

        Notification::create([
            'user_id' => $teacher2->id,
            'type' => 'module_assigned',
            'title' => 'New Module Assignment',
            'message' => 'You have been assigned to teach: Voice & Vocal Power',
        ]);

        $this->command->info('Database seeded successfully!');
        $this->command->info('BOD: bod@academy.com / password123');
        $this->command->info('Teacher 1: sarah@academy.com / password123');
        $this->command->info('Teacher 2: james@academy.com / password123');
        $this->command->info('Student 1: alex@student.com / password123');
        $this->command->info('Student 2: emma@student.com / password123');
        $this->command->info('Student 3: marcus@student.com / password123');
    }
}
