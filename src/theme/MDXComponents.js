import MDXComponents from "@theme-original/MDXComponents";
import Details from "@theme/Details";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

import Preview, { SourcePreview } from "@site/src/components/Preview";
import Tooltip from "@site/src/components/Tooltip";
import NoteCards, { TopicList } from "@site/src/components/NoteIndex";

export default {
  ...MDXComponents,
  Preview,
  SourcePreview,
  TopicList,
  NoteCards,
  Details,
  Tabs,
  TabItem,
  Tooltip,
};
