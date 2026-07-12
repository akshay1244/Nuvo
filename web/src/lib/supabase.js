import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const getInitialSession = async () => {
  if (!supabase) {
    return null;
  }

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.user) {
    return null;
  }

  const profile = await getStoredProfile(sessionData.session.user.id);
  const photos = await getStoredPhotos(sessionData.session.user.id);

  return { user: sessionData.session.user, profile, photos, session: sessionData.session };
};

export const signUpWithEmail = async ({ name, email, password }) => {
  if (!supabase) {
    return { message: 'Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable auth.' };
  }

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return { message: error.message };
  }

  if (data.user) {
    await supabase.from('profiles').upsert({ id: data.user.id, name, email, created_at: new Date().toISOString() });
  }

  return { user: data.user, profile: { name, email } };
};

export const signInWithEmail = async ({ email, password }) => {
  if (!supabase) {
    return { message: 'Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable auth.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { message: error.message };
  }

  const profile = await getStoredProfile(data.user.id);
  const photos = await getStoredPhotos(data.user.id);

  return { user: data.user, profile, photos };
};

export const resetPassword = async (email) => {
  if (!supabase) {
    return { message: 'Supabase is not configured yet.' };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
  if (error) {
    return { message: error.message };
  }

  return { message: 'Reset email sent.' };
};

export const signOutUser = async () => {
  if (!supabase) return;
  await supabase.auth.signOut();
};

export const getStoredProfile = async (userId) => {
  if (!supabase) return null;
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
  return data;
};

export const getStoredPhotos = async (userId) => {
  if (!supabase) return [];
  const { data } = await supabase.from('photos').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  return data || [];
};

export const uploadPhotoFile = async (file, userId) => {
  if (!supabase) {
    return { id: crypto.randomUUID(), title: file.name, description: 'Demo upload', url: URL.createObjectURL(file) };
  }

  const filePath = `${userId}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from('photos').upload(filePath, file, { upsert: true });
  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from('photos').getPublicUrl(filePath);
  return { id: filePath, title: file.name, description: 'Secure photo', url: data.publicUrl };
};
