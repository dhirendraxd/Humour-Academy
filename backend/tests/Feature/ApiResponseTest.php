<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Curriculum;
use Tests\TestCase;

class ApiResponseTest extends TestCase
{
    protected User $bodUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->bodUser = User::factory()->create(['role' => 'bod']);
    }

    /**
     * Test successful response format
     */
    public function test_api_returns_success_response_format()
    {
        $response = $this->actingAs($this->bodUser)
            ->getJson('/api/curriculums');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data',
                'pagination',
            ]);
    }

    /**
     * Test pagination structure
     */
    public function test_api_pagination_contains_required_fields()
    {
        $response = $this->actingAs($this->bodUser)
            ->getJson('/api/curriculums');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'pagination' => [
                    'total',
                    'per_page',
                    'current_page',
                    'last_page',
                    'from',
                    'to',
                ],
            ]);
    }

    /**
     * Test error response format
     */
    public function test_api_returns_error_response_format()
    {
        $response = $this->actingAs($this->bodUser)
            ->postJson('/api/curriculums', []);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'success',
                'message',
                'errors',
            ]);
    }

    /**
     * Test unauthorized response
     */
    public function test_api_returns_401_for_unauthenticated_request()
    {
        $response = $this->getJson('/api/curriculums');

        $response->assertStatus(401);
    }

    /**
     * Test forbidden response
     */
    public function test_api_returns_403_for_unauthorized_action()
    {
        $studentUser = User::factory()->create(['role' => 'student']);

        $response = $this->actingAs($studentUser)
            ->postJson('/api/curriculums', [
                'title' => 'Test',
                'description' => 'Test description',
            ]);

        $response->assertStatus(403);
    }

    /**
     * Test not found response
     */
    public function test_api_returns_404_for_missing_resource()
    {
        $response = $this->actingAs($this->bodUser)
            ->getJson('/api/curriculums/99999');

        $response->assertStatus(404);
    }

    /**
     * Test successful creation returns 201
     */
    public function test_api_returns_201_on_successful_creation()
    {
        $response = $this->actingAs($this->bodUser)
            ->postJson('/api/curriculums', [
                'title' => 'New Curriculum',
                'description' => 'A comprehensive curriculum for advanced studies',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'title',
                    'description',
                ],
            ]);
    }

    /**
     * Test validation errors are properly formatted
     */
    public function test_api_validation_errors_are_properly_formatted()
    {
        $response = $this->actingAs($this->bodUser)
            ->postJson('/api/curriculums', [
                'title' => '', // Required field
                'description' => 'x', // Too short
            ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'errors' => [
                    'title',
                    'description',
                ],
            ]);
    }

    /**
     * Test search functionality returns filtered results
     */
    public function test_api_search_returns_filtered_results()
    {
        Curriculum::factory()->create([
            'title' => 'Emotional Intelligence',
            'description' => 'Master emotions',
        ]);

        Curriculum::factory()->create([
            'title' => 'Advanced Comedy',
            'description' => 'Learn advanced techniques',
        ]);

        $response = $this->actingAs($this->bodUser)
            ->getJson('/api/curriculums?search=Emotional');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    /**
     * Test pagination with multiple pages
     */
    public function test_api_pagination_works_correctly()
    {
        Curriculum::factory(30)->create();

        $page1 = $this->actingAs($this->bodUser)
            ->getJson('/api/curriculums?page=1');

        $page2 = $this->actingAs($this->bodUser)
            ->getJson('/api/curriculums?page=2');

        $page1->assertStatus(200)
            ->assertJsonCount(15, 'data');

        $page2->assertStatus(200)
            ->assertJsonCount(15, 'data');
    }
}
