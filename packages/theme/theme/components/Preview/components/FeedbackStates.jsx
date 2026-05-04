import styles from "../styles.module.css";
export function LoadingState() {
  return jsxDEV_7x81h0kn(
    "div",
    {
      className: styles.loading,
      children: [
        jsxDEV_7x81h0kn(
          "div",
          {
            className: styles.loadingIcon,
            children: jsxDEV_7x81h0kn(
              "div",
              { className: styles.spinner },
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
            className: styles.loadingText,
            children: [
              jsxDEV_7x81h0kn(
                "p",
                { children: "Preparing preview..." },
                undefined,
                false,
                undefined,
                this,
              ),
              jsxDEV_7x81h0kn(
                "span",
                { children: "Fetching content from source" },
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
        ),
      ],
    },
    undefined,
    true,
    undefined,
    this,
  );
}
export function ErrorState({ path, message, fileType, fileUrl, onRetry }) {
  return jsxDEV_7x81h0kn(
    "div",
    {
      className: styles.errorState,
      children: [
        jsxDEV_7x81h0kn(
          "div",
          { className: styles.errorIcon, children: "⚠️" },
          undefined,
          false,
          undefined,
          this,
        ),
        jsxDEV_7x81h0kn(
          "p",
          {
            children: [
              "Could not load: ",
              jsxDEV_7x81h0kn(
                "code",
                { children: path?.split("/").pop() },
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
        ),
        jsxDEV_7x81h0kn(
          "p",
          { className: styles.errorMsg, children: message },
          undefined,
          false,
          undefined,
          this,
        ),
        jsxDEV_7x81h0kn(
          "div",
          {
            className: styles.errorActions,
            children: [
              jsxDEV_7x81h0kn(
                "button",
                {
                  onClick: onRetry,
                  className: styles.retryButton,
                  children: "Retry",
                },
                undefined,
                false,
                undefined,
                this,
              ),
              fileType === "web" &&
                jsxDEV_7x81h0kn(
                  "a",
                  {
                    href: fileUrl,
                    target: "_blank",
                    rel: "noopener",
                    className: styles.visitButton,
                    children: "Visit Website",
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
        ),
      ],
    },
    undefined,
    true,
    undefined,
    this,
  );
}
export function OfflineState({ onRetry }) {
  return jsxDEV_7x81h0kn(
    "div",
    {
      className: styles.errorState,
      children: [
        jsxDEV_7x81h0kn(
          "div",
          { className: styles.errorIcon, children: "\uD83D\uDCE1" },
          undefined,
          false,
          undefined,
          this,
        ),
        jsxDEV_7x81h0kn(
          "h3",
          { children: "No Connection" },
          undefined,
          false,
          undefined,
          this,
        ),
        jsxDEV_7x81h0kn(
          "p",
          { children: "This resource requires an active internet connection." },
          undefined,
          false,
          undefined,
          this,
        ),
        jsxDEV_7x81h0kn(
          "button",
          {
            onClick: onRetry,
            className: styles.retryButton,
            children: "Try Again",
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
