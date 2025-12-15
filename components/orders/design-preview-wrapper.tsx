'use client';

import DesignPreviewViewer from '@/components/design/design-preview-viewer';
import { AdminOrderItem } from '@/lib/types';

export default function DesignPreviewWrapper({ item }: { item: AdminOrderItem }) {
  if (!item.designs) return null;

  try {
    const parsedNotes = JSON.parse(
      item.designs.custom_notes as unknown as string
    );
    const customization = parsedNotes.customization || parsedNotes;

    return (
      <DesignPreviewViewer
        categorySlug={item.designs.categories?.slug || ''}
        customization={customization}
        fileUrl={item.designs.file_url}
      />
    );
  } catch (e) {
    console.error('Error parsing design notes:', e);
    return <p className="text-red-500 text-xs">Error loading preview</p>;
  }
}
