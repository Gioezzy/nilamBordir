'use client';

import DesignPreviewViewer from '@/components/design/design-preview-viewer';

interface AdminDesignPreviewWrapperProps {
  customNotes?: string | object | null;
  fileUrl?: string;
  categorySlug?: string;
  className?: string;
}

export default function AdminDesignPreviewWrapper({ 
  customNotes, 
  fileUrl, 
  categorySlug,
  className 
}: AdminDesignPreviewWrapperProps) {
  
  let customization = null;
  
  if (customNotes) {
    try {
      const parsedNotes = typeof customNotes === 'string' 
        ? JSON.parse(customNotes) 
        : customNotes;
        
      customization = parsedNotes.customization || parsedNotes;
    } catch (e) {
      console.error('Error parsing admin design notes:', e);
    }
  }

  if (!customization && !fileUrl) return null;

  return (
    <div className={`bg-card rounded-2xl border border-border/50 p-6 shadow-sm ${className}`}>
        <h3 className="text-lg font-bold font-heading mb-6">Preview Custom Design</h3>
        <DesignPreviewViewer
            categorySlug={categorySlug || ''}
            customization={customization}
            fileUrl={fileUrl}
        />
    </div>
  );
}
