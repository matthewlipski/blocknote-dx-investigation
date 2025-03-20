import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";

// The BlockQuote block.
export const BlockQuote = createReactBlockSpec(
  {
    type: "blockQuote",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
    },
    content: "inline",
  },
  {
    render: (props) => {
      return (
        <blockquote ref={props.contentRef} />
      );
    },
    parse: (element) => {
      if (element.tagName === "BLOCKQUOTE") {
        return {}
      }

      return undefined;
    }
  }
);
