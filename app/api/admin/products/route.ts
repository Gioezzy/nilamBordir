import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request){
  try{
    const supabase = await createClient()

    const {data: {user}, error:authError} = await supabase.auth.getUser()

    if(authError || !user){
      return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const { data: profile} = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if(!profile || profile.role !== 'admin'){
      return NextResponse.json({error: 'Forbidden - Admin only'}, {status: 403})
    }

    const body = await request.json()
    const {
      name,
      slug,
      sku,
      description,
      price,
      category_id,
      lead_time_days,
      is_active,
      sample_images
    } = body

    const { data: product, error: insertError} = await supabase
      .from('products')
      .insert({
        name,
        slug,
        sku,
        description,
        price,
        category_id,
        lead_time_days,
        is_active,
        sample_images,
        created_by: user.id
      })
      .select()
      .single()

    if(insertError){
      console.error('Inser error:', insertError)
      return NextResponse.json({ error: insertError.message}, {status: 400})
    }

    return NextResponse.json({success: true, data: product}, {status: 201})
  } catch (error){
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error'}, {status: 500})
  }
}