import React from "react";
import styles from "../styles.module.css";
import { LoadingState, ErrorState, OfflineState } from "./FeedbackStates";
import ImageRenderer from "../renderers/ImageRenderer";
import PdfRenderer from "../renderers/PdfRenderer";
import WebRenderer from "../renderers/WebRenderer";
import CodeRenderer from "../renderers/CodeRenderer";

/**
 * Component that routes to the appropriate renderer based on file type.
 * Also handles shared loading, error, and offline states.
 */
export default function PreviewContent({
  currentFile,
  fileType,
  fileUrl,
  isOnline,
  fetchErrors,
  textLoading,
  textContent,
  zoomLevel,
  ext,
  retryFetch,
  setError,
}) {
  const path = currentFile?.path;
  const isExternal = path?.startsWith("http") || path?.startsWith("//");

  // 1. Offline guard for external resources
  if (!isOnline && isExternal) {
    return <OfflineState onRetry={retryFetch} />;
  }

  // 2. Error state
  const errorMsg = fetchErrors?.[path];
  if (errorMsg) {
    return (
      <ErrorState
        path={path}
        message={errorMsg}
        fileType={fileType}
        fileUrl={fileUrl}
        onRetry={retryFetch}
      />
    );
  }

  // 3. Loading state (for text files only — specialized renderers handle their own loading)
  if (textLoading && fileType === "text") {
    return <LoadingState />;
  }

  // 4. Feature-specific renderers
  switch (fileType) {
    case "image":
      return (
        <ImageRenderer
          key={fileUrl}
          fileUrl={fileUrl}
          label={currentFile.label}
          zoomLevel={zoomLevel}
          onError={(msg) => setError(path, msg)}
        />
      );
    case "pdf":
      return (
        <PdfRenderer
          key={fileUrl}
          fileUrl={fileUrl}
          zoomLevel={zoomLevel}
          onError={(msg) => setError(path, msg)}
        />
      );
    case "web":
      return (
        <WebRenderer
          key={fileUrl}
          fileUrl={fileUrl}
          label={currentFile.label}
          onError={(msg) => setError(path, msg)}
        />
      );
    default: {
      // Text / code
      if (!textContent) return <LoadingState />;
      return (
        <CodeRenderer code={textContent} language={ext} zoomLevel={zoomLevel} />
      );
    }
  }
}
