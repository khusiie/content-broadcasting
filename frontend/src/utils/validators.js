import { z } from 'zod';
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});
export const registerSchema = z.object({
  name: z.string().min(1, 'Full name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  role: z.enum(['teacher', 'principal'], { required_error: 'Please select a role' }),
});
const MAX_FILE_SIZE = 10 * 1024 * 1024; 
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
export const uploadContentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be under 100 characters'),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().optional(),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  rotation_duration: z.coerce.number().min(1, 'Minimum 1 minute').default(5),
}).refine((data) => {
  if (data.start_time && data.end_time) {
    return new Date(data.end_time) > new Date(data.start_time);
  }
  return true;
}, {
  message: 'End time must be after start time',
  path: ['end_time'],
});
export const rejectSchema = z.object({
  reason: z.string().min(1, 'Rejection reason is required').min(5, 'Please provide a more detailed reason'),
});
export const validateFile = (file) => {
  if (!file) return 'Please select a file';
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) return 'Only JPG, PNG, and GIF files are allowed';
  if (file.size > MAX_FILE_SIZE) return `File size must be under 10MB (current: ${(file.size / 1024 / 1024).toFixed(1)}MB)`;
  return null;
};
