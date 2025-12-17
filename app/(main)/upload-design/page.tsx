import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DesignUploadForm from '@/components/forms/design-upload-form';
import FadeIn from '@/components/animations/fade-in';

export const metadata = {
  title: 'Upload Design Custom - Nilam Bordir',
  description: 'Upload design bordir custom anda',
};

export default async function UploadDesignPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/upload-design');
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="bg-primary/5 border-b border-primary/10 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <FadeIn>
            <span className="inline-block px-3 py-1 mb-4 rounded-full bg-secondary/10 text-secondary text-sm font-medium tracking-wide border border-secondary/20">
              Custom Order
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Upload Design Custom
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Wujudkan ide kreatif Anda menjadi bordir berkualitas. Isi form di
              bawah ini dengan detail spesifikasi yang diinginkan.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <FadeIn delay={0.2}>
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 sm:p-8">
              <DesignUploadForm categories={categories || []} />
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
