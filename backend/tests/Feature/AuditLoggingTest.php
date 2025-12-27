<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Curriculum;
use App\Models\Activity;
use Tests\TestCase;

class AuditLoggingTest extends TestCase
{
    protected User $bodUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->bodUser = User::factory()->create(['role' => 'bod']);
    }

    /**
     * Test that curriculum creation is logged
     */
    public function test_curriculum_creation_is_logged()
    {
        $this->actingAs($this->bodUser)
            ->postJson('/api/curriculums', [
                'title' => 'Test Curriculum',
                'description' => 'Test description for logging',
            ]);

        $this->assertDatabaseHas('activities', [
            'action' => 'created',
            'model_type' => Curriculum::class,
            'user_id' => $this->bodUser->id,
        ]);
    }

    /**
     * Test that curriculum update is logged
     */
    public function test_curriculum_update_is_logged()
    {
        $curriculum = Curriculum::factory()->create([
            'title' => 'Original Title',
        ]);

        $this->actingAs($this->bodUser)
            ->putJson("/api/curriculums/{$curriculum->id}", [
                'title' => 'Updated Title',
                'description' => 'Updated description',
            ]);

        $activity = Activity::where('model_type', Curriculum::class)
            ->where('model_id', $curriculum->id)
            ->where('action', 'updated')
            ->first();

        $this->assertNotNull($activity);
        $this->assertEquals($this->bodUser->id, $activity->user_id);
    }

    /**
     * Test that curriculum deletion is logged
     */
    public function test_curriculum_deletion_is_logged()
    {
        $curriculum = Curriculum::factory()->create();

        $this->actingAs($this->bodUser)
            ->deleteJson("/api/curriculums/{$curriculum->id}");

        $this->assertDatabaseHas('activities', [
            'action' => 'deleted',
            'model_type' => Curriculum::class,
            'model_id' => $curriculum->id,
            'user_id' => $this->bodUser->id,
        ]);
    }

    /**
     * Test that activity log contains IP address and user agent
     */
    public function test_activity_log_contains_ip_and_user_agent()
    {
        Curriculum::factory()->create();

        $activity = Activity::latest()->first();

        $this->assertNotNull($activity->ip_address);
        $this->assertNotNull($activity->user_agent);
    }

    /**
     * Test activity log query by user
     */
    public function test_activity_log_can_be_queried_by_user()
    {
        $this->actingAs($this->bodUser)
            ->postJson('/api/curriculums', [
                'title' => 'User Activity Test',
                'description' => 'Test description',
            ]);

        $activities = Activity::where('user_id', $this->bodUser->id)
            ->where('action', 'created')
            ->get();

        $this->assertCount(1, $activities);
    }

    /**
     * Test activity log query by model
     */
    public function test_activity_log_can_be_queried_by_model()
    {
        $curriculum = Curriculum::factory()->create();

        $this->actingAs($this->bodUser)
            ->putJson("/api/curriculums/{$curriculum->id}", [
                'title' => 'Changed',
                'description' => 'Changed description',
            ]);

        $activities = Activity::where('model_type', Curriculum::class)
            ->where('model_id', $curriculum->id)
            ->get();

        $this->assertGreaterThan(0, $activities->count());
    }

    /**
     * Test that changes are tracked in activity log
     */
    public function test_activity_log_tracks_changes()
    {
        $curriculum = Curriculum::factory()->create([
            'title' => 'Original Title',
        ]);

        $this->actingAs($this->bodUser)
            ->putJson("/api/curriculums/{$curriculum->id}", [
                'title' => 'New Title',
                'description' => 'New description',
            ]);

        $activity = Activity::where('model_type', Curriculum::class)
            ->where('model_id', $curriculum->id)
            ->where('action', 'updated')
            ->first();

        $this->assertNotNull($activity);
        // Changes should contain old and new values
        if ($activity->changes) {
            $changes = json_decode($activity->changes, true);
            $this->assertTrue(isset($changes['title']) || isset($changes['description']));
        }
    }
}
