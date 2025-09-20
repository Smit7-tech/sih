/*
  # Initial Schema for Ayurvedic Diet Management System

  1. New Tables
    - `profiles` - User profiles (doctors and patients)
    - `patients` - Patient-specific information
    - `food_items` - Ayurvedic food database
    - `diet_charts` - Diet plan templates
    - `diet_chart_meals` - Meals within diet charts
    - `diet_chart_items` - Food items within meals
    - `patient_progress` - Progress tracking data
    - `appointments` - Appointment scheduling
    - `notifications` - System notifications

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Separate access for doctors and patients

  3. Features
    - User authentication integration
    - Role-based access control
    - Data relationships and constraints
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('doctor', 'patient')),
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Patients table (additional patient-specific data)
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES profiles(id),
  age integer,
  gender text CHECK (gender IN ('male', 'female', 'other')),
  weight numeric(5,2),
  height numeric(5,2),
  bmi numeric(4,2),
  blood_group text,
  address text,
  occupation text,
  constitution text, -- Ayurvedic constitution (Vata, Pitta, Kapha)
  allergies text,
  medical_history text,
  emergency_contact text,
  emergency_phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Food items database
CREATE TABLE IF NOT EXISTS food_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  calories numeric(6,2) DEFAULT 0,
  protein numeric(5,2) DEFAULT 0,
  carbs numeric(5,2) DEFAULT 0,
  fat numeric(5,2) DEFAULT 0,
  fiber numeric(5,2) DEFAULT 0,
  dosha_effect text NOT NULL DEFAULT 'Tridoshic',
  rasa text, -- Taste (Sweet, Sour, Salty, Pungent, Bitter, Astringent)
  virya text, -- Energy (Heating, Cooling)
  vipaka text, -- Post-digestive effect
  properties text[], -- Array of properties
  ayurvedic_note text,
  created_by uuid REFERENCES profiles(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Diet charts (templates)
CREATE TABLE IF NOT EXISTS diet_charts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES profiles(id),
  title text NOT NULL,
  description text,
  duration_weeks integer DEFAULT 4,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  target_calories integer,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Meals within diet charts
CREATE TABLE IF NOT EXISTS diet_chart_meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diet_chart_id uuid REFERENCES diet_charts(id) ON DELETE CASCADE,
  name text NOT NULL, -- Breakfast, Lunch, Dinner, etc.
  time_slot text, -- 8:00 AM, 1:00 PM, etc.
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Food items within meals
CREATE TABLE IF NOT EXISTS diet_chart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id uuid REFERENCES diet_chart_meals(id) ON DELETE CASCADE,
  food_item_id uuid REFERENCES food_items(id),
  quantity text NOT NULL, -- "1 cup", "2 pieces", etc.
  notes text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Patient progress tracking
CREATE TABLE IF NOT EXISTS patient_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  diet_chart_id uuid REFERENCES diet_charts(id),
  date date DEFAULT CURRENT_DATE,
  weight numeric(5,2),
  energy_level integer CHECK (energy_level >= 1 AND energy_level <= 10),
  sleep_quality integer CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  stress_level integer CHECK (stress_level >= 1 AND stress_level <= 10),
  bowel_movement boolean DEFAULT false,
  water_intake integer DEFAULT 0, -- glasses of water
  symptoms text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES profiles(id),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  appointment_date timestamptz NOT NULL,
  duration_minutes integer DEFAULT 30,
  type text DEFAULT 'consultation' CHECK (type IN ('consultation', 'follow-up', 'diet-review', 'progress-check')),
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_chart_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_chart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Patients policies
CREATE POLICY "Doctors can read their patients"
  ON patients
  FOR SELECT
  TO authenticated
  USING (
    doctor_id = auth.uid() OR 
    user_id = auth.uid()
  );

CREATE POLICY "Doctors can manage their patients"
  ON patients
  FOR ALL
  TO authenticated
  USING (
    doctor_id = auth.uid() OR 
    user_id = auth.uid()
  );

-- Food items policies
CREATE POLICY "Anyone can read food items"
  ON food_items
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Doctors can manage food items"
  ON food_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'doctor'
    )
  );

-- Diet charts policies
CREATE POLICY "Users can read relevant diet charts"
  ON diet_charts
  FOR SELECT
  TO authenticated
  USING (
    doctor_id = auth.uid() OR 
    patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can manage diet charts"
  ON diet_charts
  FOR ALL
  TO authenticated
  USING (
    doctor_id = auth.uid()
  );

-- Diet chart meals policies
CREATE POLICY "Users can read relevant meals"
  ON diet_chart_meals
  FOR SELECT
  TO authenticated
  USING (
    diet_chart_id IN (
      SELECT id FROM diet_charts 
      WHERE doctor_id = auth.uid() OR 
      patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Doctors can manage meals"
  ON diet_chart_meals
  FOR ALL
  TO authenticated
  USING (
    diet_chart_id IN (
      SELECT id FROM diet_charts WHERE doctor_id = auth.uid()
    )
  );

-- Diet chart items policies
CREATE POLICY "Users can read relevant diet items"
  ON diet_chart_items
  FOR SELECT
  TO authenticated
  USING (
    meal_id IN (
      SELECT dcm.id FROM diet_chart_meals dcm
      JOIN diet_charts dc ON dcm.diet_chart_id = dc.id
      WHERE dc.doctor_id = auth.uid() OR 
      dc.patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Doctors can manage diet items"
  ON diet_chart_items
  FOR ALL
  TO authenticated
  USING (
    meal_id IN (
      SELECT dcm.id FROM diet_chart_meals dcm
      JOIN diet_charts dc ON dcm.diet_chart_id = dc.id
      WHERE dc.doctor_id = auth.uid()
    )
  );

-- Patient progress policies
CREATE POLICY "Users can read relevant progress"
  ON patient_progress
  FOR SELECT
  TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients 
      WHERE doctor_id = auth.uid() OR user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can manage own progress"
  ON patient_progress
  FOR ALL
  TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    )
  );

-- Appointments policies
CREATE POLICY "Users can read relevant appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    doctor_id = auth.uid() OR 
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
  );

CREATE POLICY "Doctors can manage appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (doctor_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_food_items_updated_at BEFORE UPDATE ON food_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_diet_charts_updated_at BEFORE UPDATE ON diet_charts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();