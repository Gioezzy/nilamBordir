/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";

export interface UpdateDesignStatusInput {
  designId: string;
  status: 'uploaded' | 'reviewed' | 'approved' | 'rejected';
  adminNote?: string;
  rejectedReason?: string;
}

/**
 * Update design status by admin
 */
export async function updateDesignStatus(input: UpdateDesignStatusInput) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return { error: 'Forbidden - Admin only' };
  }

  if (input.status === 'rejected' && !input.rejectedReason?.trim()) {
    return { error: 'Alasan penolakan wajib diisi untuk status rejected' };
  }

  const updateData: any = {
    status: input.status,
    updated_at: new Date().toISOString(),
  };

  if (input.adminNote) {
    updateData.admin_note = input.adminNote;
  }

  if (input.status === 'rejected' && input.rejectedReason) {
    updateData.rejected_reason = input.rejectedReason;
  }

  if (input.status !== 'rejected') {
    updateData.rejected_reason = null;
  }

  const { data, error } = await supabase
    .from('designs')
    .update(updateData)
    .eq('id', input.designId)
    .select()
    .single();

  if (error) {
    console.error('Error updating design:', error);
    return { error: 'Gagal mengupdate status design' };
  }

  revalidatePath('/admin/design');
  revalidatePath(`/admin/design/${input.designId}`);

  return {
    success: true,
    message: 'Status design berhasil diupdate',
    data,
  };
}

/**
 * Get design by ID
 */
export async function getDesignById(designId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized', data: null };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return { error: 'Forbidden', data: null };
  }

  const { data, error } = await supabase
    .from('designs')
    .select(
      `
      *,
      profiles(full_name, phone, email),
      categories(name, slug)
    `
    )
    .eq('id', designId)
    .single();

  if (error) {
    console.error('Error fetching design:', error);
    return { error: 'Design tidak ditemukan', data: null };
  }

  return { error: null, data };
}

/**
 * Get all designs (for admin)
 */
export async function getAllDesigns(filters?: {
  status?: string;
  categoryId?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized', data: [], total: 0 };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return { error: 'Forbidden', data: [], total: 0 };
  }

  let query = supabase
    .from('designs')
    .select(
      `
      *,
      profiles(full_name, phone),
      categories(name, slug)
    `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(
      filters.offset,
      filters.offset + (filters.limit || 10) - 1
    );
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching designs:', error);
    return { error: 'Gagal mengambil data designs', data: [], total: 0 };
  }

  return { error: null, data: data || [], total: count || 0 };
}

/**
 * Delete design 
 */
export async function deleteDesign(designId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return { error: 'Forbidden - Admin only' };
  }

  const { data: orderItems } = await supabase
    .from('order_items')
    .select('id')
    .eq('design_id', designId)
    .limit(1);

  if (orderItems && orderItems.length > 0) {
    return {
      error: 'Design tidak dapat dihapus karena sudah terkait dengan pesanan',
    };
  }

  const { error } = await supabase.from('designs').delete().eq('id', designId);

  if (error) {
    console.error('Error deleting design:', error);
    return { error: 'Gagal menghapus design' };
  }

  revalidatePath('/admin/design');

  return { success: true, message: 'Design berhasil dihapus' };
}


/**
 * Get design statistics
 */
export async function getDesignStatistics() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: 'Unauthorized',
      data: { total: 0, uploaded: 0, reviewed: 0, approved: 0, rejected: 0 },
    };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return {
      error: 'Forbidden',
      data: { total: 0, uploaded: 0, reviewed: 0, approved: 0, rejected: 0 },
    };
  }

  const { data: designs } = await supabase.from('designs').select('status');

  if (!designs) {
    return {
      error: null,
      data: { total: 0, uploaded: 0, reviewed: 0, approved: 0, rejected: 0 },
    };
  }

  const stats = {
    total: designs.length,
    uploaded: designs.filter((d) => d.status === 'uploaded').length,
    reviewed: designs.filter((d) => d.status === 'reviewed').length,
    approved: designs.filter((d) => d.status === 'approved').length,
    rejected: designs.filter((d) => d.status === 'rejected').length,
  };

  return { error: null, data: stats };
}