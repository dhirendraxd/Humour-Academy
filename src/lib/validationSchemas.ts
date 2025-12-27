import { z } from 'zod';

/**
 * Form Validation Schemas using Zod
 */

// Authentication
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  role: z.enum(['student', 'faculty', 'bod'], {
    errorMap: () => ({ message: 'Invalid role' }),
  }),
  department: z.string().optional(),
  phone: z.string().regex(/^\d{10,}$/, 'Invalid phone number').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Curriculum
export const curriculumSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  outcomes: z.string().optional(),
  prerequisites: z.string().optional(),
});

// Module
export const moduleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  curriculum_id: z.number().positive('Curriculum is required'),
  teacher_id: z.number().positive('Teacher is required'),
  order_index: z.number().int().positive().optional(),
  duration_months: z
    .number()
    .int()
    .min(1, 'Duration must be at least 1 month')
    .max(36, 'Duration cannot exceed 36 months')
    .optional(),
});

// Cohort
export const cohortSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(255),
  module_id: z.number().positive('Module is required'),
  capacity: z
    .number()
    .int()
    .min(5, 'Capacity must be at least 5 students')
    .max(500, 'Capacity cannot exceed 500 students'),
  start_date: z.string().datetime('Invalid date format'),
  end_date: z.string().datetime('Invalid date format'),
  status: z.enum(['upcoming', 'ongoing', 'completed'], {
    errorMap: () => ({ message: 'Invalid status' }),
  }),
  max_assessment_attempts: z.number().int().min(1).optional(),
});

// Assessment
export const assessmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  cohort_id: z.number().positive('Cohort is required'),
  assessment_type: z.enum(['quiz', 'assignment', 'project', 'exam'], {
    errorMap: () => ({ message: 'Invalid assessment type' }),
  }),
  total_marks: z
    .number()
    .int()
    .min(1, 'Total marks must be at least 1')
    .max(1000, 'Total marks cannot exceed 1000'),
  passing_marks: z
    .number()
    .int()
    .min(0, 'Passing marks must be at least 0')
    .optional(),
  duration_minutes: z
    .number()
    .int()
    .min(5, 'Duration must be at least 5 minutes')
    .optional(),
  due_date: z.string().datetime('Invalid date format'),
});

// Enrollment
export const enrollmentSchema = z.object({
  cohort_id: z.number().positive('Cohort is required'),
  student_id: z.number().positive('Student is required'),
});

// Profile Update
export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255).optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().regex(/^\d{10,}$/, 'Invalid phone number').optional(),
  bio: z.string().max(1000, 'Bio cannot exceed 1000 characters').optional(),
  department: z.string().optional(),
});

// Question
export const questionSchema = z.object({
  assessment_id: z.number().positive('Assessment is required'),
  question_text: z.string().min(10, 'Question must be at least 10 characters'),
  question_type: z.enum(['mcq', 'short_answer', 'essay'], {
    errorMap: () => ({ message: 'Invalid question type' }),
  }),
  marks: z
    .number()
    .int()
    .min(1, 'Marks must be at least 1')
    .max(100, 'Marks cannot exceed 100'),
  order: z.number().int().optional(),
});

// Submission
export const submissionSchema = z.object({
  assessment_id: z.number().positive('Assessment is required'),
  student_id: z.number().positive('Student is required'),
  answers: z.record(z.any()).optional(),
  submission_date: z.string().datetime('Invalid date format').optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type CurriculumFormData = z.infer<typeof curriculumSchema>;
export type ModuleFormData = z.infer<typeof moduleSchema>;
export type CohortFormData = z.infer<typeof cohortSchema>;
export type AssessmentFormData = z.infer<typeof assessmentSchema>;
export type EnrollmentFormData = z.infer<typeof enrollmentSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type QuestionFormData = z.infer<typeof questionSchema>;
export type SubmissionFormData = z.infer<typeof submissionSchema>;
