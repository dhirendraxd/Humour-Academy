<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::rename('courses', 'modules');

        Schema::table('modules', function (Blueprint $table) {
            $table->foreignId('curriculum_id')->nullable()->constrained('curriculums')->onDelete('cascade');
            $table->integer('order_index')->default(1);
            $table->integer('duration_months')->default(3);
        });
    }

    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->dropForeign(['curriculum_id']);
            $table->dropColumn(['curriculum_id', 'order_index', 'duration_months']);
        });

        Schema::rename('modules', 'courses');
    }
};
