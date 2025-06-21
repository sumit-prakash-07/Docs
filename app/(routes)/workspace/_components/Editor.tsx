"use client";

import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
// @ts-ignore
import Header from "@editorjs/header";
// @ts-ignore
import List from "@editorjs/list";
// @ts-ignore
import Checklist from "@editorjs/checklist";
// @ts-ignore
import Paragraph from "@editorjs/paragraph";
// @ts-ignore
import Warning from "@editorjs/warning";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { FILE } from "../../dashboard/_components/FileList";

const rawDocument = {
  time: Date.now(),
  blocks: [
    {
      data: {
        text: "Document Name",
        level: 2,
      },
      id: "123",
      type: "header",
    },
  ],
  version: "2.8.1",
};

interface EditorProps {
  onSaveTrigger: boolean;
  fileId: any;
  fileData: FILE | null;
}

function Editor({ onSaveTrigger, fileId, fileData }: EditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const updateDocument = useMutation(api.files.updateDocument);
  const holderId = "editorjs-container";

  // Initialize EditorJS
  useEffect(() => {
    if (!fileData) return;

    if (editorRef.current) {
      editorRef.current.destroy();
      editorRef.current = null;
    }

    const editor = new EditorJS({
      holder: holderId,
      tools: {
        header: {
          class: Header,
          shortcut: "CMD+SHIFT+H",
          config: {
            placeholder: "Enter a Header",
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: "unordered",
          },
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        paragraph: Paragraph,
        warning: Warning,
      },
      data: fileData?.document ? JSON.parse(fileData.document) : rawDocument,
    });

    editorRef.current = editor;

    return () => {
      editor.isReady
        .then(() => editor.destroy())
        .catch((err) => console.error("Error destroying editor", err));
    };
  }, [fileData]);

  // Handle Save
  useEffect(() => {
    if (!onSaveTrigger || !editorRef.current) return;

    const saveDocument = async () => {
      try {
        const saved = await editorRef.current!.save();
        await updateDocument({
          _id: fileId,
          document: JSON.stringify(saved),
        });
        toast("Document updated successfully!");
      } catch (err) {
        console.error("Saving failed", err);
        toast("Failed to save document");
      }
    };

    saveDocument();
  }, [onSaveTrigger]);

  return (
    <div className="ml-20">
      <div id={holderId} className="min-h-screen" />
    </div>
  );
}

export default Editor;
