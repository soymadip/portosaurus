import DocCategoryGeneratedIndexPage from "@theme-original/DocCategoryGeneratedIndexPage";
import NoteCards from "@porto/theme/components/NoteIndex/index.js";

export default function DocCategoryGeneratedIndexPageWrapper(props) {
  if (props.categoryGeneratedIndex?.title === "Notes") {
    return <NoteCards />;
  }
  return <DocCategoryGeneratedIndexPage {...props} />;
}
