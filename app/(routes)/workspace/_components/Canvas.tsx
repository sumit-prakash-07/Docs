"use client";

import React, { useEffect, useRef, useState } from "react";
import { Tldraw, createTLStore, defaultShapeUtils } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FILE } from "../../dashboard/_components/FileList";

interface Props {
  onSaveTrigger: boolean;
  fileId: any;
  fileData: FILE | null;
}

export default function Canvas({ onSaveTrigger, fileId, fileData }: Props) {
  const store = useRef(createTLStore({ shapeUtils: defaultShapeUtils }));
  const [mounted, setMounted] = useState(false);
  const updateWhiteboard = useMutation(api.files.updateWhiteboard);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (fileData?.whiteboard) {
      try {
        const json = JSON.parse(fileData.whiteboard);
        store.current.loadSnapshot(json);
      } catch (err) {
        console.error("Invalid whiteboard JSON", err);
      }
    }
  }, [fileData]);

  useEffect(() => {
    if (onSaveTrigger && store.current) {
      const snapshot = store.current.getSnapshot();
      updateWhiteboard({
        _id: fileId,
        whiteboard: JSON.stringify(snapshot),
      }).then(() => {
        console.log("Tldraw canvas saved");
      });
    }
  }, [onSaveTrigger]);

  return (
    <div className="h-full w-full overflow-hidden">
      {mounted && (
        <Tldraw
          store={store.current}
          autoFocus
          inferDarkMode
         
        />
      )}
    </div>
  );
}
