import React from "react";
import styles from "../styles.module.css";
import { LoadingState, ErrorState, OfflineState } from "./FeedbackStates";
import ImageRenderer from "../renderers/ImageRenderer";
import PdfRenderer from "../renderers/PdfRenderer";
import WebRenderer from "../renderers/WebRenderer";
import CodeRenderer from "../renderers/CodeRenderer";
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
  if (!isOnline && isExternal) {
    return jsxDEV_7x81h0kn(
      OfflineState,
      { onRetry: retryFetch },
      undefined,
      false,
      undefined,
      this,
    );
  }
  const errorMsg = fetchErrors?.[path];
  if (errorMsg) {
    return jsxDEV_7x81h0kn(
      ErrorState,
      { path, message: errorMsg, fileType, fileUrl, onRetry: retryFetch },
      undefined,
      false,
      undefined,
      this,
    );
  }
  if (textLoading && fileType === "text") {
    return jsxDEV_7x81h0kn(LoadingState, {}, undefined, false, undefined, this);
  }
  switch (fileType) {
    case "image":
      return jsxDEV_7x81h0kn(
        ImageRenderer,
        {
          fileUrl,
          label: currentFile.label,
          zoomLevel,
          onError: (msg) => setError(path, msg),
        },
        fileUrl,
        false,
        undefined,
        this,
      );
    case "pdf":
      return jsxDEV_7x81h0kn(
        PdfRenderer,
        { fileUrl, zoomLevel, onError: (msg) => setError(path, msg) },
        fileUrl,
        false,
        undefined,
        this,
      );
    case "web":
      return jsxDEV_7x81h0kn(
        WebRenderer,
        {
          fileUrl,
          label: currentFile.label,
          onError: (msg) => setError(path, msg),
        },
        fileUrl,
        false,
        undefined,
        this,
      );
    default: {
      if (!textContent)
        return jsxDEV_7x81h0kn(
          LoadingState,
          {},
          undefined,
          false,
          undefined,
          this,
        );
      return jsxDEV_7x81h0kn(
        CodeRenderer,
        { code: textContent, language: ext, zoomLevel },
        undefined,
        false,
        undefined,
        this,
      );
    }
  }
}
