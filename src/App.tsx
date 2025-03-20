import {
  BlockNoteSchema,
  defaultBlockSpecs,
  filterSuggestionItems,
  insertOrUpdateBlock,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
  FormattingToolbarController,
  FormattingToolbar,
  blockTypeSelectItems, BlockTypeSelectItem,
} from "@blocknote/react";
import { RiAlertFill } from "react-icons/ri";

import { BlockQuote } from "./BlockQuote.tsx";
import "./App.css";

// Our schema with block specs, which contain the configs and implementations for blocks
// that we want our editor to use.
const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    // Adds the Alert block.
    blockQuote: BlockQuote,
  },
});

// Slash menu item to insert an Alert block
const insertBlockQuote = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Block Quote",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "blockQuote",
    });
  },
  aliases: [
    "blockQuote",
    "quote",
    "citation",
    "bq"
  ],
  group: "Basic blocks",
  icon: <div>"..."</div>,
});

export default function App() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to this demo!",
      },
      {
        type: "blockQuote",
        content: "This is an example block quote",
      },
      {
        type: "paragraph",
        content: "Press the '/' key to open the Slash Menu and add another",
      },
      {
        type: "paragraph",
      },
    ],
  });

  // Renders the editor instance.
  return (
    <BlockNoteView editor={editor} formattingToolbar={false} slashMenu={false} onChange={() => {
      editor.blocksToMarkdownLossy(editor.document).then((markdown) => console.log(markdown));
      editor.blocksToHTMLLossy(editor.document).then((html) => console.log(html));
      editor.blocksToFullHTML(editor.document).then((html) => console.log(html));
    }}>
      {/* Replaces the default Slash Menu. */}
      <SuggestionMenuController
        triggerCharacter={"/"}
        getItems={async (query) =>
          // Gets all default slash menu items and `insertAlert` item.
          filterSuggestionItems(
            getDefaultReactSlashMenuItems(editor).toSpliced(8, 0, insertBlockQuote(editor)),
            query
          )
        }
      />
      <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar
            blockTypeSelectItems={[
              ...blockTypeSelectItems(editor.dictionary),
              {
                name: "Block Quote",
                type: "blockQuote",
                icon: RiAlertFill,
                isSelected: (block) => block.type === "blockQuote",
              } satisfies BlockTypeSelectItem,
            ]}
          />
        )}
      />
    </BlockNoteView>
  );
}
