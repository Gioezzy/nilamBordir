/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request){
  try{
    const supabase = await createClient()

    const { data: {user}, error: authError} = await supabase.auth.getUser()

    if(authError || !user){
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      category_id,
      file_url,
      file_name,
      file_metadata,
      custom_notes,
      customization,
    } = body;

    const { data: design, error: insertError } = await supabase
      .from('designs')
      .insert({
        user_id: user.id,
        category_id,
        file_url,
        file_name,
        file_metadata,
        custom_notes: JSON.stringify({
          notes: custom_notes,
          customization: customization,
        }),
        status: 'uploaded',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: design }, { status: 201 });
  }catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { id, status, admin_note, rejected_reason } = body;

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (admin_note) updateData.admin_note = admin_note;
    if (rejected_reason) updateData.rejected_reason = rejected_reason;

    const { data: design, error: updateError } = await supabase
      .from('designs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: design });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}