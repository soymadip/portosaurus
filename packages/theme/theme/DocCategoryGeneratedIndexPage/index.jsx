import DocCategoryGeneratedIndexPage from "@theme-original/DocCategoryGeneratedIndexPage";
import NoteCards from "@porto/theme/components/NoteIndex/index.js";
export default function DocCategoryGeneratedIndexPageWrapper(props) {
  if (props.categoryGeneratedIndex?.title === "Notes") {
    return jsxDEV_7x81h0kn(NoteCards, {}, undefined, false, undefined, this);
  }
  return jsxDEV_7x81h0kn(
    DocCategoryGeneratedIndexPage,
    { ...props },
    undefined,
    false,
    undefined,
    this,
  );
}
