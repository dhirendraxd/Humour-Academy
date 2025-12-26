<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            // Drop old course_id column (SQLite might need workarounds, but Laravel's Schema handles it usually)
            $table->dropForeign(['course_id']);
            $table->dropColumn('course_id');

            $table->foreignId('cohort_id')->nullable()->constrained('cohorts')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropForeign(['cohort_id']);
            $table->dropColumn('cohort_id');

            $table->foreignId('course_id')->nullable()->constrained('courses')->onDelete('cascade');
        });
    }
};
