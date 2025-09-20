import { useState, useEffect } from 'react';
import { supabase, Patient, Profile } from '../lib/supabase';
import { useAuth } from './useAuth';

export function usePatients() {
  const { profile } = useAuth();
  const [patients, setPatients] = useState<(Patient & { profile?: Profile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      fetchPatients();
    }
  }, [profile]);

  const fetchPatients = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      let query = supabase
        .from('patients')
        .select(`
          *,
          profile:profiles(*)
        `);

      // If doctor, get their patients. If patient, get own record
      if (profile.role === 'doctor') {
        query = query.eq('doctor_id', profile.id);
      } else {
        query = query.eq('user_id', profile.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setPatients(data || []);
      }
    } catch (err) {
      setError('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const addPatient = async (patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert({
          ...patientData,
          doctor_id: profile?.role === 'doctor' ? profile.id : patientData.doctor_id,
        })
        .select(`
          *,
          profile:profiles(*)
        `)
        .single();

      if (error) {
        throw error;
      }

      setPatients(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      const error = err as Error;
      return { data: null, error: error.message };
    }
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          profile:profiles(*)
        `)
        .single();

      if (error) {
        throw error;
      }

      setPatients(prev => prev.map(patient => patient.id === id ? data : patient));
      return { data, error: null };
    } catch (err) {
      const error = err as Error;
      return { data: null, error: error.message };
    }
  };

  const deletePatient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setPatients(prev => prev.filter(patient => patient.id !== id));
      return { error: null };
    } catch (err) {
      const error = err as Error;
      return { error: error.message };
    }
  };

  return {
    patients,
    loading,
    error,
    addPatient,
    updatePatient,
    deletePatient,
    refetch: fetchPatients,
  };
}