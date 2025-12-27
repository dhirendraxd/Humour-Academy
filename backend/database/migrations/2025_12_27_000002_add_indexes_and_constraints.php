<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if email unique constraint exists before adding
        Schema::table('enrollments', function (Blueprint $table) {
            $table->index('cohort_id');
            $table->index('student_id');
            // Check if unique constraint exists
            try {
                $table->unique(['cohort_id', 'student_id']);
            } catch (\Exception $e) {
                // Already exists
            }
        });

        Schema::table('modules', function (Blueprint $table) {
            $table->index('curriculum_id');
        });

        Schema::table('cohorts', function (Blueprint $table) {
            $table->index('module_id');
        });

        Schema::table('assessments', function (Blueprint $table) {
            $table->index('cohort_id');
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->index('assessment_id');
        });

        Schema::table('submissions', function (Blueprint $table) {
            $table->index('assessment_id');
            $table->index('student_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropIndex(['cohort_id']);
            $table->dropIndex(['student_id']);
            try {
                $table->dropUnique(['cohort_id', 'student_id']);
            } catch (\Exception $e) {
                // Already dropped
            }
        });

        Schema::table('modules', function (Blueprint $table) {
            $table->dropIndex(['curriculum_id']);
        });

        Schema::table('cohorts', function (Blueprint $table) {
            $table->dropIndex(['module_id']);
        });

        Schema::table('assessments', function (Blueprint $table) {
            $table->dropIndex(['cohort_id']);
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->dropIndex(['assessment_id']);
        });

        Schema::table('submissions', function (Blueprint $table) {
            $table->dropIndex(['assessment_id']);
            $table->dropIndex(['student_id']);
        });
    }
};
