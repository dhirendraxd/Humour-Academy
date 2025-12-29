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
        // Create fresh minimal users: one per role
        $bod = User::updateOrCreate(
            ['email' => 'bod@academy.com'],
            [
                'name' => 'Board Admin',
                'password' => Hash::make('password123'),
                'role' => 'bod',
                'rank' => 'Board Director',
                'level' => 10,
                'bio' => 'Academy oversight and strategic planning.',
            ]
        );

        $faculty = User::updateOrCreate(
            ['email' => 'faculty@academy.com'],
            [
                'name' => 'Faculty Member',
                'password' => Hash::make('password123'),
                'role' => 'faculty',
                'rank' => 'Architect',
                'level' => 5,
                'bio' => 'Faculty for core modules.',
                'interests' => json_encode(['Teaching'])
            ]
        );

        $student = User::updateOrCreate(
            ['email' => 'student@academy.com'],
            [
                'name' => 'Student User',
                'password' => Hash::make('password123'),
                'role' => 'student',
                'level' => 1,
                'bio' => 'New student.',
                'interests' => json_encode(['Learning'])
            ]
        );

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
            'teacher_id' => $faculty->id,
        ]);

        $module1_2 = Module::create([
            'curriculum_id' => $curriculum1->id,
            'title' => 'Timing & Delivery Mechanics',
            'description' => 'The science behind comedic timing and effective delivery.',
            'duration_months' => 2,
            'teacher_id' => $faculty->id,
        ]);

        $module1_3 = Module::create([
            'curriculum_id' => $curriculum1->id,
            'title' => 'Advanced Wit Application',
            'description' => 'Apply wit in real-world scenarios with confidence.',
            'duration_months' => 3,
            'teacher_id' => $faculty->id,
        ]);

        // Create Modules for Curriculum 2
        $module2_1 = Module::create([
            'curriculum_id' => $curriculum2->id,
            'title' => 'Voice & Vocal Power',
            'description' => 'Develop your vocal instrument for maximum impact.',
            'duration_months' => 2,
            'teacher_id' => $faculty->id,
        ]);

        $module2_2 = Module::create([
            'curriculum_id' => $curriculum2->id,
            'title' => 'Stage Presence & Body Language',
            'description' => 'Command attention through physical presence.',
            'duration_months' => 2,
            'teacher_id' => $faculty->id,
        ]);

        $module2_3 = Module::create([
            'curriculum_id' => $curriculum2->id,
            'title' => 'Audience Engagement Tactics',
            'description' => 'Interactive techniques to keep your audience captivated.',
            'duration_months' => 2,
            'teacher_id' => $faculty->id,
        ]);

        // Create Modules for Curriculum 3
        $module3_1 = Module::create([
            'curriculum_id' => $curriculum3->id,
            'title' => 'Leadership Through Humor',
            'description' => 'Use humor as a leadership tool to build trust and rapport.',
            'duration_months' => 3,
            'teacher_id' => $faculty->id,
        ]);

        $module3_2 = Module::create([
            'curriculum_id' => $curriculum3->id,
            'title' => 'Difficult Conversations',
            'description' => 'Navigate challenging discussions with grace and wit.',
            'duration_months' => 2,
            'teacher_id' => $faculty->id,
        ]);

        // Create Modules for Curriculum 4
        $module4_1 = Module::create([
            'curriculum_id' => $curriculum4->id,
            'title' => 'Satirical Writing Fundamentals',
            'description' => 'Craft intelligent satire that entertains and enlightens.',
            'duration_months' => 3,
            'teacher_id' => $faculty->id,
        ]);

        $module4_2 = Module::create([
            'curriculum_id' => $curriculum4->id,
            'title' => 'Social Commentary Techniques',
            'description' => 'Master the art of meaningful social commentary through humor.',
            'duration_months' => 3,
            'teacher_id' => $faculty->id,
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
            'student_id' => $student->id,
            'status' => 'approved',
        ]);

        // Create notifications for teachers about their assigned modules
        Notification::create([
            'user_id' => $faculty->id,
            'type' => 'module_assigned',
            'title' => 'New Module Assignment',
            'message' => 'You have been assigned to teach: Foundations of Emotional Reading',
        ]);

        $this->command->info('Database seeded successfully!');
        $this->command->info('BOD: bod@academy.com / password123');
        $this->command->info('Faculty: faculty@academy.com / password123');
        $this->command->info('Student: student@academy.com / password123');
    }
}
