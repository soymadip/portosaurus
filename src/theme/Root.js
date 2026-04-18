import BrowserOnly from "@docusaurus/BrowserOnly";
import { PreviewProvider, ViewerWindow } from "./components/Preview/index.js";

/**
 * Custom Root component that wraps the entire Docusaurus app.
 * Provides the PreviewProvider context and ViewerWindow at the top level
 * so that all theme components have access to preview functionality.
 */
export default function Root({ children }) {
  return (
    <PreviewProvider>
      {children}
      <BrowserOnly>{() => <ViewerWindow />}</BrowserOnly>
    </PreviewProvider>
  );
}
