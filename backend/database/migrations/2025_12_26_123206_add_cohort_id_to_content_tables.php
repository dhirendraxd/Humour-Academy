<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('materials', function (Blueprint $table) {
            $table->foreignId('cohort_id')->nullable()->constrained('cohorts')->onDelete('set null');
        });

        Schema::table('assessments', function (Blueprint $table) {
            $table->foreignId('cohort_id')->nullable()->constrained('cohorts')->onDelete('set null');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->foreignId('cohort_id')->nullable()->constrained('cohorts')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('materials', function (Blueprint $table) {
            $table->dropConstrainedForeignId('cohort_id');
        });

        Schema::table('assessments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('cohort_id');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropConstrainedForeignId('cohort_id');
        });
    }
};
