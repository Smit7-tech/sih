import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'doctor' | 'patient';
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  user_id?: string;
  doctor_id?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  bmi?: number;
  blood_group?: string;
  address?: string;
  occupation?: string;
  constitution?: string;
  allergies?: string;
  medical_history?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  dosha_effect: string;
  rasa?: string;
  virya?: string;
  vipaka?: string;
  properties?: string[];
  ayurvedic_note?: string;
  created_by?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DietChart {
  id: string;
  patient_id: string;
  doctor_id: string;
  title: string;
  description?: string;
  duration_weeks: number;
  status: 'active' | 'completed' | 'paused';
  target_calories?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DietChartMeal {
  id: string;
  diet_chart_id: string;
  name: string;
  time_slot?: string;
  order_index: number;
  created_at: string;
}

export interface DietChartItem {
  id: string;
  meal_id: string;
  food_item_id: string;
  quantity: string;
  notes?: string;
  order_index: number;
  created_at: string;
  food_item?: FoodItem;
}

export interface PatientProgress {
  id: string;
  patient_id: string;
  diet_chart_id?: string;
  date: string;
  weight?: number;
  energy_level?: number;
  sleep_quality?: number;
  stress_level?: number;
  bowel_movement: boolean;
  water_intake: number;
  symptoms?: string;
  notes?: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  doctor_id: string;
  patient_id: string;
  appointment_date: string;
  duration_minutes: number;
  type: 'consultation' | 'follow-up' | 'diet-review' | 'progress-check';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}