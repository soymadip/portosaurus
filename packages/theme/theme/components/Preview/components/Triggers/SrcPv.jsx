import React, { useMemo } from "react";
import Pv, { normalizeSources } from "./Pv";
import styles from "../../styles.module.css";
export default function SrcPv(props) {
  const { prefixText = "Source file: " } = props;
  const srcList = useMemo(() => normalizeSources(props), [props]);
  if (srcList.length === 0) return null;
  return jsxDEV_7x81h0kn(
    "div",
    {
      className: styles.sourceFooter,
      children: [
        jsxDEV_7x81h0kn(
          "span",
          { className: styles.sourceFooterLabel, children: prefixText },
          undefined,
          false,
          undefined,
          this,
        ),
        srcList.map((src, idx) =>
          jsxDEV_7x81h0kn(
            React.Fragment,
            {
              children: [
                jsxDEV_7x81h0kn(
                  Pv,
                  {
                    ...props,
                    sources: srcList,
                    activeIdx: idx,
                    children: src.label,
                  },
                  undefined,
                  false,
                  undefined,
                  this,
                ),
                idx < srcList.length - 1 ? ", " : "",
              ],
            },
            idx,
            true,
            undefined,
            this,
          ),
        ),
      ],
    },
    undefined,
    true,
    undefined,
    this,
  );
}
