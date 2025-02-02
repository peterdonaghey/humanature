import {RichTextEditor, Link} from "@mantine/tiptap";
import {useEditor} from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import {Color} from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";

const content = "<p>Your content here</p>";

export function Editor({
  content,
  onChange,
}: {
  content: string;
  onChange: (content: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextStyle.configure(),
      Color.configure(),
      TextAlign.configure({
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
    ],
    content,
    onUpdate: ({editor}) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        spellcheck: "false",
      },
    },
    enableCoreExtensions: true,
    enableInputRules: true,
    enablePasteRules: true,
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="flex justify-center items-center w-fit">
      <RichTextEditor
        editor={editor}
        className="min-h-[300px] w-[900px] "
        classNames={{
          content: "prose-colors",
        }}
      >
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.ColorPicker
              colors={[
                "#25262b",
                "#868e96",
                "#fa5252",
                "#e64980",
                "#be4bdb",
                "#7950f2",
                "#4c6ef5",
                "#228be6",
                "#15aabf",
                "#12b886",
                "#40c057",
                "#82c91e",
                "#fab005",
                "#fd7e14",
              ]}
            />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Color color="#F03E3E" />
            <RichTextEditor.Color color="#7048E8" />
            <RichTextEditor.Color color="#1098AD" />
            <RichTextEditor.Color color="#37B24D" />
            <RichTextEditor.Color color="#F59F00" />
            <RichTextEditor.UnsetColor />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
    </div>
  );
}
