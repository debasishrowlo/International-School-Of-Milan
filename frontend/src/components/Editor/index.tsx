// @ts-nocheck
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { EditorContent, useEditor, Editor as TEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './Editor.css';

const MenuBar = ({ editor }: { editor: TEditor }) => {
	if (!editor) {
		return null;
	}

	return (
		<div className='control-group'>
			<div className='button-group'>
				<button type='button' onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'is-active' : ''}>
					Paragraph
				</button>
				<button
					type='button'
					onClick={() => editor.chain().focus().toggleBold().run()}
					disabled={!editor.can().chain().focus().toggleBold().run()}
					className={editor.isActive('bold') ? 'is-active' : ''}
				>
					Bold
				</button>
				<button
					type='button'
					onClick={() => editor.chain().focus().toggleItalic().run()}
					disabled={!editor.can().chain().focus().toggleItalic().run()}
					className={editor.isActive('italic') ? 'is-active' : ''}
				>
					Italic
				</button>
				<button
					type='button'
					onClick={() => editor.chain().focus().toggleStrike().run()}
					disabled={!editor.can().chain().focus().toggleStrike().run()}
					className={editor.isActive('strike') ? 'is-active' : ''}
				>
					Strike
				</button>
				<button
					type='button'
					onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
					className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
				>
					H1
				</button>
				<button
					type='button'
					onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
					className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
				>
					H2
				</button>
				<button
					type='button'
					onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
					className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
				>
					H3
				</button>
				<button
					type='button'
					onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
					className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
				>
					H4
				</button>
				<button
					type='button'
					onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
					className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
				>
					H5
				</button>
				<button
					type='button'
					onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
					className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
				>
					H6
				</button>
				<button
					type='button'
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={editor.isActive('bulletList') ? 'is-active' : ''}
				>
					Bullet list
				</button>
				<button
					type='button'
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={editor.isActive('orderedList') ? 'is-active' : ''}
				>
					Ordered list
				</button>
				<button
					type='button'
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					className={editor.isActive('blockquote') ? 'is-active' : ''}
				>
					Blockquote
				</button>
			</div>
		</div>
	);
};

const extensions = [
	Color.configure({ types: [TextStyle.name, ListItem.name] }),
	TextStyle.configure({ types: [ListItem.name] }),
	StarterKit.configure({
		bulletList: {
			keepMarks: true,
			keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
		},
		orderedList: {
			keepMarks: true,
			keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
		},
	}),
];

const Editor = ({ content, setContent, autoFocus = false }: { content: string; setContent: (content: string) => void; autoFocus?: boolean }) => {
	const editor = useEditor({
		extensions,
		content,
		onUpdate: ({ editor }) => {
			setContent(editor.getHTML());
		},
		autofocus: autoFocus,
	});

	if (!editor) {
		return null;
	}

	return (
		<>
			<MenuBar editor={editor} />
			<EditorContent editor={editor} />
		</>
	);
};

export default Editor;
