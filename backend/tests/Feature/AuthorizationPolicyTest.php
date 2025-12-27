<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Curriculum;
use App\Models\Module;
use App\Models\Cohort;
use App\Models\Assessment;
use Tests\TestCase;

class AuthorizationPolicyTest extends TestCase
{
    protected User $bodUser;
    protected User $facultyUser;
    protected User $studentUser;
    protected Curriculum $curriculum;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test users
        $this->bodUser = User::factory()->create(['role' => 'bod']);
        $this->facultyUser = User::factory()->create(['role' => 'faculty']);
        $this->studentUser = User::factory()->create(['role' => 'student']);

        // Create test curriculum
        $this->curriculum = Curriculum::factory()->create();
    }

    // ============ Curriculum Policy Tests ============

    public function test_bod_can_create_curriculum()
    {
        $this->assertTrue(
            $this->bodUser->can('create', Curriculum::class)
        );
    }

    public function test_faculty_cannot_create_curriculum()
    {
        $this->assertFalse(
            $this->facultyUser->can('create', Curriculum::class)
        );
    }

    public function test_student_cannot_create_curriculum()
    {
        $this->assertFalse(
            $this->studentUser->can('create', Curriculum::class)
        );
    }

    public function test_bod_can_update_curriculum()
    {
        $this->assertTrue(
            $this->bodUser->can('update', $this->curriculum)
        );
    }

    public function test_faculty_cannot_update_curriculum()
    {
        $this->assertFalse(
            $this->facultyUser->can('update', $this->curriculum)
        );
    }

    public function test_bod_can_delete_curriculum()
    {
        $this->assertTrue(
            $this->bodUser->can('delete', $this->curriculum)
        );
    }

    public function test_faculty_cannot_delete_curriculum()
    {
        $this->assertFalse(
            $this->facultyUser->can('delete', $this->curriculum)
        );
    }

    // ============ Module Policy Tests ============

    public function test_bod_can_create_module()
    {
        $this->assertTrue(
            $this->bodUser->can('create', Module::class)
        );
    }

    public function test_faculty_cannot_create_module()
    {
        $this->assertFalse(
            $this->facultyUser->can('create', Module::class)
        );
    }

    public function test_bod_can_update_module()
    {
        $module = Module::factory()->create(['curriculum_id' => $this->curriculum->id]);

        $this->assertTrue(
            $this->bodUser->can('update', $module)
        );
    }

    public function test_faculty_cannot_update_module()
    {
        $module = Module::factory()->create(['curriculum_id' => $this->curriculum->id]);

        $this->assertFalse(
            $this->facultyUser->can('update', $module)
        );
    }

    public function test_bod_can_delete_module()
    {
        $module = Module::factory()->create(['curriculum_id' => $this->curriculum->id]);

        $this->assertTrue(
            $this->bodUser->can('delete', $module)
        );
    }

    // ============ Assessment Policy Tests ============

    public function test_faculty_can_create_assessment()
    {
        $this->assertTrue(
            $this->facultyUser->can('create', Assessment::class)
        );
    }

    public function test_bod_can_create_assessment()
    {
        $this->assertTrue(
            $this->bodUser->can('create', Assessment::class)
        );
    }

    public function test_student_cannot_create_assessment()
    {
        $this->assertFalse(
            $this->studentUser->can('create', Assessment::class)
        );
    }

    public function test_creator_faculty_can_update_own_assessment()
    {
        $cohort = Cohort::factory()->create();
        $assessment = Assessment::factory()->create([
            'cohort_id' => $cohort->id,
            'created_by' => $this->facultyUser->id,
        ]);

        $this->assertTrue(
            $this->facultyUser->can('update', $assessment)
        );
    }

    public function test_non_creator_faculty_cannot_update_assessment()
    {
        $cohort = Cohort::factory()->create();
        $otherFaculty = User::factory()->create(['role' => 'faculty']);
        $assessment = Assessment::factory()->create([
            'cohort_id' => $cohort->id,
            'created_by' => $this->facultyUser->id,
        ]);

        $this->assertFalse(
            $otherFaculty->can('update', $assessment)
        );
    }

    public function test_bod_can_update_any_assessment()
    {
        $cohort = Cohort::factory()->create();
        $assessment = Assessment::factory()->create([
            'cohort_id' => $cohort->id,
            'created_by' => $this->facultyUser->id,
        ]);

        $this->assertTrue(
            $this->bodUser->can('update', $assessment)
        );
    }

    public function test_faculty_can_delete_own_assessment()
    {
        $cohort = Cohort::factory()->create();
        $assessment = Assessment::factory()->create([
            'cohort_id' => $cohort->id,
            'created_by' => $this->facultyUser->id,
        ]);

        $this->assertTrue(
            $this->facultyUser->can('delete', $assessment)
        );
    }

    public function test_bod_can_delete_any_assessment()
    {
        $cohort = Cohort::factory()->create();
        $assessment = Assessment::factory()->create([
            'cohort_id' => $cohort->id,
            'created_by' => $this->facultyUser->id,
        ]);

        $this->assertTrue(
            $this->bodUser->can('delete', $assessment)
        );
    }

    // ============ Cohort Policy Tests ============

    public function test_faculty_can_create_cohort()
    {
        $this->assertTrue(
            $this->facultyUser->can('create', Cohort::class)
        );
    }

    public function test_bod_can_create_cohort()
    {
        $this->assertTrue(
            $this->bodUser->can('create', Cohort::class)
        );
    }

    public function test_student_cannot_create_cohort()
    {
        $this->assertFalse(
            $this->studentUser->can('create', Cohort::class)
        );
    }

    public function test_faculty_can_update_own_cohort()
    {
        $module = Module::factory()->create();
        $cohort = Cohort::factory()->create([
            'module_id' => $module->id,
            'created_by' => $this->facultyUser->id,
        ]);

        $this->assertTrue(
            $this->facultyUser->can('update', $cohort)
        );
    }

    public function test_non_creator_faculty_cannot_update_cohort()
    {
        $module = Module::factory()->create();
        $otherFaculty = User::factory()->create(['role' => 'faculty']);
        $cohort = Cohort::factory()->create([
            'module_id' => $module->id,
            'created_by' => $this->facultyUser->id,
        ]);

        $this->assertFalse(
            $otherFaculty->can('update', $cohort)
        );
    }

    public function test_bod_can_update_any_cohort()
    {
        $module = Module::factory()->create();
        $cohort = Cohort::factory()->create([
            'module_id' => $module->id,
            'created_by' => $this->facultyUser->id,
        ]);

        $this->assertTrue(
            $this->bodUser->can('update', $cohort)
        );
    }

    public function test_only_bod_can_delete_cohort()
    {
        $module = Module::factory()->create();
        $cohort = Cohort::factory()->create([
            'module_id' => $module->id,
            'created_by' => $this->facultyUser->id,
        ]);

        $this->assertTrue($this->bodUser->can('delete', $cohort));
        $this->assertFalse($this->facultyUser->can('delete', $cohort));
    }
}
