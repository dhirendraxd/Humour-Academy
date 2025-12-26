<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('curriculums', function (Blueprint $table) {
            $table->text('outcomes')->nullable();
            $table->text('prerequisites')->nullable();
        });

        Schema::table('cohorts', function (Blueprint $table) {
            $table->integer('capacity')->default(25);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('curriculums', function (Blueprint $table) {
            $table->dropColumn(['outcomes', 'prerequisites']);
        });

        Schema::table('cohorts', function (Blueprint $table) {
            $table->dropColumn('capacity');
        });
    }
};
