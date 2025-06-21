// app/workspace/[fileId]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import WorkspaceHeader from '@/app/(routes)/workspace/_components/WorkspaceHeader'
import Editor from "@/app/(routes)/workspace/_components/Editor";
import Canvas from "@/app/(routes)/workspace/_components/Canvas";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FILE } from "@/app/(routes)/dashboard/_components/FileList";
interface Props {
  params: Promise<{ fileId: any }>;
}

export default function WorkspacePage({ params }: Props) {
  const {fileId} = use(params)
  const convex = useConvex();
  const [triggerSave, setTriggerSave] = useState(false);
  const [fileData, setFileData] = useState<FILE | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await convex.query(api.files.getFileById, { _id: fileId });
      setFileData(res);
    };
    if (fileId) fetch();
  }, [fileId]);

  return (
    <div className="flex flex-col h-[100dvh]">
      {/* Header (fixed height) */}
      <div className="shrink-0">
        <WorkspaceHeader onSave={() => setTriggerSave(!triggerSave)} />
      </div>

      {/* Main workspace (fills remaining space) */}
      <div className="flex flex-grow overflow-hidden">
        {/* Editor */}
        <div className="w-full md:w-1/2 h-full overflow-hidden">
          <Editor
            onSaveTrigger={triggerSave}
            fileId={fileId}
            fileData={fileData}
          />
        </div>

        {/* Canvas */}
        <div className="w-full md:w-1/2 h-full overflow-hidden border-l">
          <Canvas
            onSaveTrigger={triggerSave}
            fileId={fileId}
            fileData={fileData}
          />
        </div>
      </div>
    </div>
  );
}
