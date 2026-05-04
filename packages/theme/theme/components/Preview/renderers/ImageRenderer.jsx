import React, { useState } from "react";
import { LoadingState } from "../components/FeedbackStates";
import styles from "../styles.module.css";
export default function ImageRenderer({ fileUrl, label, zoomLevel, onError }) {
  const [loading, setLoading] = useState(true);
  return jsxDEV_7x81h0kn(
    "div",
    {
      className: styles.imageView,
      style: { "--zoom": zoomLevel, position: "relative" },
      children: [
        loading &&
          jsxDEV_7x81h0kn(
            "div",
            {
              style: {
                position: "absolute",
                inset: 0,
                zIndex: 5,
                display: "flex",
              },
              children: jsxDEV_7x81h0kn(
                LoadingState,
                {},
                undefined,
                false,
                undefined,
                this,
              ),
            },
            undefined,
            false,
            undefined,
            this,
          ),
        jsxDEV_7x81h0kn(
          "div",
          {
            className: styles.imageScrollArea,
            style: {
              opacity: loading ? 0 : 1,
              transition: "opacity 0.3s ease",
            },
            children: jsxDEV_7x81h0kn(
              "img",
              {
                src: fileUrl,
                alt: label || "",
                className: styles.image,
                onLoad: () => setLoading(false),
                onError: () => {
                  setLoading(false);
                  onError?.("Failed to load image.");
                },
              },
              undefined,
              false,
              undefined,
              this,
            ),
          },
          undefined,
          false,
          undefined,
          this,
        ),
      ],
    },
    undefined,
    true,
    undefined,
    this,
  );
}
