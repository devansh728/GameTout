import { createContext, useContext, useState, ReactNode } from "react";
import { ContentBlock, PostCreateRequest } from "@/lib/adminApi";

// ============================================
// TYPES
// ============================================
export interface PreviewData {
  metadata: PostCreateRequest;
  blocks: ContentBlock[];
}

interface PreviewContextType {
  previewData: PreviewData | null;
  setPreviewData: (data: PreviewData | null) => void;
  clearPreview: () => void;
}

// ============================================
// CONTEXT
// ============================================
const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================
interface PreviewProviderProps {
  children: ReactNode;
}

export const PreviewProvider = ({ children }: PreviewProviderProps) => {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  const clearPreview = () => {
    setPreviewData(null);
  };

  return (
    <PreviewContext.Provider value={{ previewData, setPreviewData, clearPreview }}>
      {children}
    </PreviewContext.Provider>
  );
};

// ============================================
// HOOK
// ============================================
export const usePreview = () => {
  const context = useContext(PreviewContext);
  if (context === undefined) {
    throw new Error("usePreview must be used within a PreviewProvider");
  }
  return context;
};

export default PreviewContext;
