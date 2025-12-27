<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Enrollment;
use App\Models\Cohort;
use App\Models\Curriculum;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    use ApiResponse;

    public function dashboard()
    {
        try {
            // Calculate metrics from real data
            $enrollmentCapacity = $this->calculateEnrollmentCapacity();
            $courseCompletion = $this->calculateCompletionRate();
            $activeFaculty = User::where('role', 'faculty')->count();
            $totalStudents = User::where('role', 'student')->count();

            return $this->success([
                'metrics' => [
                    'enrollment_capacity' => [
                        'value' => $enrollmentCapacity['current'] . '%',
                        'trend' => $enrollmentCapacity['trend'],
                        'trend_value' => $enrollmentCapacity['diff'] . '%'
                    ],
                    'course_completion' => [
                        'value' => $courseCompletion . '%',
                        'trend' => 'up',
                        'trend_value' => '+' . $courseCompletion . '%'
                    ],
                    'active_faculty' => [
                        'value' => $activeFaculty,
                        'trend' => 'up',
                        'trend_value' => $activeFaculty > 0 ? '+' . $activeFaculty : '0'
                    ],
                    'total_students' => [
                        'value' => $totalStudents,
                        'trend' => 'up',
                        'trend_value' => $totalStudents > 0 ? '+' . $totalStudents : '0'
                    ]
                ]
            ], 'Dashboard metrics retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Error fetching dashboard metrics: ' . $e->getMessage(), 500);
        }
    }

    public function enrollmentTrends()
    {
        try {
            // Get enrollments from last 6 months grouped by month
            $trends = Enrollment::select(
                DB::raw('count(id) as students'),
                DB::raw("DATE_FORMAT(created_at, '%b') as name"),
                DB::raw('MONTH(created_at) as month_num')
            )
                ->where('created_at', '>=', Carbon::now()->subMonths(6))
                ->groupBy('name', 'month_num')
                ->orderBy('month_num')
                ->get();

            // If no data, create placeholder with current month
            if ($trends->isEmpty()) {
                $trends = collect([
                    (object) ['name' => Carbon::now()->format('M'), 'students' => 0]
                ]);
            }

            return $this->success($trends, 'Enrollment trends retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Error fetching enrollment trends: ' . $e->getMessage(), 500);
        }
    }

    public function programDistribution()
    {
        try {
            // Distribution of enrollments across curriculums
            $distribution = Curriculum::select('curriculums.id', 'curriculums.title')
                ->withCount([
                    'modules as enrollment_count' => function ($query) {
                        $query->join('cohorts', 'modules.id', '=', 'cohorts.module_id')
                            ->join('enrollments', 'cohorts.id', '=', 'enrollments.cohort_id');
                    }
                ])
                ->get()
                ->map(function ($c) {
                    $colors = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6'];
                    return [
                        'name' => explode(' ', $c->title)[0],
                        'value' => max(1, $c->enrollment_count), // Min 1 for visibility
                        'fill' => $colors[$c->id % count($colors)]
                    ];
                })
                ->sortByDesc('value')
                ->values();

            // Fallback for demo if no enrollments yet
            if ($distribution->isEmpty()) {
                $curriculums = Curriculum::take(4)->get();
                $colors = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981'];
                $distribution = $curriculums->map(function ($c, $key) use ($colors) {
                    return [
                        'name' => explode(' ', $c->title)[0],
                        'value' => 1,
                        'fill' => $colors[$key % count($colors)]
                    ];
                });
            }

            return $this->success($distribution, 'Program distribution retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Error fetching program distribution: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Calculate enrollment capacity percentage
     */
    private function calculateEnrollmentCapacity(): array
    {
        try {
            $totalCapacity = Cohort::sum('capacity') ?? 0;
            $totalEnrollments = Enrollment::count() ?? 0;

            if ($totalCapacity == 0) {
                return ['current' => 0, 'trend' => 'neutral', 'diff' => 0];
            }

            $capacity = round(($totalEnrollments / $totalCapacity) * 100, 1);
            $trend = $capacity > 50 ? 'up' : 'down';
            $diff = round($capacity / 10); // Rough trend indicator

            return [
                'current' => $capacity,
                'trend' => $trend,
                'diff' => $diff
            ];
        } catch (\Exception $e) {
            return ['current' => 0, 'trend' => 'neutral', 'diff' => 0];
        }
    }

    /**
     * Calculate course completion rate
     */
    private function calculateCompletionRate(): float
    {
        try {
            $total = Enrollment::count();
            if ($total == 0) {
                return 0;
            }

            $completed = Enrollment::where('status', 'completed')->count();
            return round(($completed / $total) * 100, 1);
        } catch (\Exception $e) {
            return 0;
        }
    }
}
