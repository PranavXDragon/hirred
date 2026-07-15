"use server";

import { createClient } from '../supabase/server';
import { revalidatePath } from 'next/cache';

export async function uploadAvatar(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const file = formData.get('file');
  if (!file) throw new Error("No file provided");

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(error.message);

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ profile_photo: publicUrl })
    .eq('id', user.id);

  if (updateError) throw new Error(updateError.message);

  revalidatePath('/dashboard/student');
  revalidatePath('/dashboard/settings');
  return { url: publicUrl };
}

export async function uploadResume(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const file = formData.get('file');
  if (!file) throw new Error("No file provided");

  const fileName = `resume_${user.id}_${Date.now()}.pdf`;

  const { error } = await supabase.storage
    .from('resumes')
    .upload(fileName, file, { upsert: true, contentType: 'application/pdf' });

  if (error) throw new Error(error.message);

  const { data: { publicUrl } } = supabase.storage
    .from('resumes')
    .getPublicUrl(fileName);

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ resume_url: publicUrl })
    .eq('id', user.id);

  if (updateError) throw new Error(updateError.message);

  revalidatePath('/dashboard/student');
  return { url: publicUrl };
}

export async function uploadCompanyLogo(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const file = formData.get('file');
  if (!file) throw new Error("No file provided");

  const fileExt = file.name.split('.').pop();
  const fileName = `logo_${user.id}_${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('company-logos')
    .upload(fileName, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(error.message);

  const { data: { publicUrl } } = supabase.storage
    .from('company-logos')
    .getPublicUrl(fileName);

  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('employer_id', user.id)
    .maybeSingle();

  if (company) {
    const { error: updateError } = await supabase
      .from('companies')
      .update({ logo_url: publicUrl })
      .eq('id', company.id);
    if (updateError) throw new Error(updateError.message);
  }

  revalidatePath('/dashboard/employer');
  revalidatePath('/companies');
  return { url: publicUrl };
}
