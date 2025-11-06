'use server';

import { createClient } from '../supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export async function loginAction(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if ( error.message.includes('Email not confirmed')){
      return {error: 'Email belum diverifikasi, Silahkan cek inbox Anda'}
    }
    return { error: error.message}
  }

  redirect('/');
}

export async function registerAction(formData: FormData) {
  const supabase = await createClient();

  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${(await headers()).get('origin')}/auth/callback`,
    },
  });

  if (error) {
    console.error('Auth signup error:', error)
    return { error: error.message };
  }

  if(!data.user){
    return {error: 'Registrasi gagal. Silahkan coba lagi.'}
  }

  // const { createClient: createServiceClient } = await import ('@supabase/supabase-js')
  // const supabaseAdmin = createServiceClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.SUPABASE_SERVICE_ROLE_KEY!,
  //   {
  //     auth: {
  //       autoRefreshToken: false,
  //       persistSession: false
  //     }
  //   }
  // )

  // const { error: profileError } = await supabaseAdmin
  //   .from('profiles')
  //   .insert({
  //     id: data.user.id,
  //     full_name: fullName,
  //     role: 'customer'
  //   })

  // if (profileError){
  //   console.error('Profile creation error:', profileError)

  //   await supabaseAdmin.auth.admin.deleteUser(data.user.id)

  //   return { error: 'Gagal membuat profil. Silahkan coba lagi.'}
  // }

  if (data.session){
    return {
      success: true,
      message: 'Registrasi berhasil!, Mengalihkan...',
      autoLogin: true
    }
  } else {
    return{
      success: true,
      message: 'Registrasi berhasil! Silahkan cek email anda untuk verifikasi'
    }
  }
}

export async function signInWithGoogleAction() {
  const supabase = await createClient();
  const origin = (await headers()).get('origin');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function forgotPasswordAction(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const origin = (await headers()).get('origin');

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: true,
    message: 'Link reset password telah dikirim ke email Anda.',
  };
}

export async function resetPasswordAction(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/login?reset=success');
}

export async function logoutAction() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  redirect('/');
}
