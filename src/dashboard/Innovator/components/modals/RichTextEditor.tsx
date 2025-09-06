import React, {useEffect} from "react";
import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import UnderlineExtension from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Link from "@tiptap/extension-link";
import {all, createLowlight} from 'lowlight';

import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Code,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link2,
    Undo,
    Redo,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Toggle} from "../ui/toggle";

const lowlight = createLowlight(all);

const editorStyles = `
  .ProseMirror {
    min-height: 200px;
    padding: 1rem;
    outline: none;
  }

  .ProseMirror h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 1.5rem 0;
    line-height: 1.3;
  }

  .ProseMirror h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 1.2rem 0;
    line-height: 1.3;
  }

  .ProseMirror h3 {
    font-size: 1.17rem;
    font-weight: 600;
    margin: 1rem 0;
    line-height: 1.3;
  }

  .ProseMirror p {
    margin: 0.75rem 0;
    line-height: 1.6;
  }

  .ProseMirror ul,
  .ProseMirror ol {
    padding: 0 1rem;
    margin: 0.5rem 0;
  }

  .ProseMirror code {
    background-color: rgba(97, 97, 97, 0.1);
    color: white;
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 0.9em;
  }

  .ProseMirror pre {
    background: #0d0d0d;
    color: #fff;
    font-family: 'JetBrainsMono', monospace;
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1rem 0;
  }

  .ProseMirror a {
    color: #2563eb;
    text-decoration: underline;
    font-weight: 500;
  }

  .ProseMirror blockquote {
    border-left: 3px solid rgba(13, 13, 13, 0.1);
    padding-left: 1rem;
    margin: 1rem 0;
    color: #555;
  }
`;

interface RichTextEditorProps {
    value?: string;
    onChange?: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({value = '', onChange}) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                heading: false
            }),
            Heading.configure({
                levels: [1, 2, 3],
            }),
            UnderlineExtension,
            TextAlign.configure({
                types: ["heading", "paragraph"],
                alignments: ['left', 'center', 'right']
            }),
            CodeBlockLowlight.configure({lowlight}),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 hover:text-blue-800',
                },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'focus:outline-none',
            },
        },
        onUpdate: ({editor}) => {
            const html = editor.getHTML()
            onChange?.(html)
        }
    });

    // update editor content when value prop changes
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value)
        }
    }, [value, editor]);

    useEffect(() => {
        return () => {
            editor?.destroy();
        };
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="rounded-lg border dashborder secondbg">
            <style>{editorStyles}</style>

            <div className="flex flex-wrap items-center gap-1 p-2 border-b dashborder">
                {/* Text Formatting */}
                <div className="flex items-center gap-1 border-r dashborder pr-2">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("bold")}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    >
                        <Bold className="h-4 w-4"/>
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("italic")}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    >
                        <Italic className="h-4 w-4"/>
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("underline")}
                        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                    >
                        <UnderlineIcon className="h-4 w-4"/>
                    </Toggle>
                </div>

                {/* Headings */}
                <div className="flex items-center gap-1 border-r dashborder px-2">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("heading", {level: 1})}
                        onPressedChange={() => editor.chain().focus().toggleHeading({level: 1}).run()}
                    >
                        <Heading1 className="h-4 w-4"/>
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("heading", {level: 2})}
                        onPressedChange={() => editor.chain().focus().toggleHeading({level: 2}).run()}
                    >
                        <Heading2 className="h-4 w-4"/>
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("heading", {level: 3})}
                        onPressedChange={() => editor.chain().focus().toggleHeading({level: 3}).run()}
                    >
                        <Heading3 className="h-4 w-4"/>
                    </Toggle>
                </div>

                {/* Lists */}
                <div className="flex items-center gap-1 border-r dashborder px-2">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("bulletList")}
                        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                    >
                        <List className="h-4 w-4"/>
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("orderedList")}
                        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                    >
                        <ListOrdered className="h-4 w-4"/>
                    </Toggle>
                </div>

                {/* Alignment */}
                <div className="flex items-center gap-1 border-r dashborder px-2">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({textAlign: "left"})}
                        onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
                    >
                        <AlignLeft className="h-4 w-4"/>
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({textAlign: "center"})}
                        onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
                    >
                        <AlignCenter className="h-4 w-4"/>
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({textAlign: "right"})}
                        onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
                    >
                        <AlignRight className="h-4 w-4"/>
                    </Toggle>
                </div>

                {/* Special Blocks */}
                <div className="flex items-center gap-1 border-r dashborder px-2">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("blockquote")}
                        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                    >
                        <Quote className="h-4 w-4"/>
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("codeBlock")}
                        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
                    >
                        <Code className="h-4 w-4"/>
                    </Toggle>
                </div>

                {/* Links */}
                <div className="flex items-center gap-1 px-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            const url = prompt("Enter URL");
                            if (url) {
                                editor.chain().focus().toggleLink({href: url}).run();
                            }
                        }}
                    >
                        <Link2 className="h-4 w-4"/>
                    </Button>
                </div>

                {/* Undo/Redo */}
                <div className="flex items-center gap-1 border-l dashborder pl-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => editor.chain().focus().undo().run()}
                    >
                        <Undo className="h-4 w-4"/>
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => editor.chain().focus().redo().run()}
                    >
                        <Redo className="h-4 w-4"/>
                    </Button>
                </div>
            </div>

            <EditorContent
                editor={editor}
                className=" min-h-[200px] max-w-none"
            />
        </div>
    );
};

export default RichTextEditor;