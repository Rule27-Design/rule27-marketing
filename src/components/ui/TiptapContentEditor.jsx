// src/components/ui/TiptapContentEditor.jsx
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Button from './Button';
import Icon from '../AppIcon';
import { cn } from '../../utils/cn';

const TiptapContentEditor = ({ 
  value = null, 
  onChange, 
  label = 'Content',
  placeholder = 'Start writing your content...',
  className = '',
  minHeight = '300px'
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-accent underline',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: value?.html || value?.content || '',
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none focus:outline-none',
          'min-h-[300px] p-4 border-0'
        ),
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const html = editor.getHTML();
      const text = editor.getText();
      
      // Create structured content for JSONB storage
      const structuredContent = {
        type: 'tiptap',
        json: json, // Tiptap's native JSON format
        html: html, // HTML representation
        text: text, // Plain text
        wordCount: text.split(/\s+/).filter(word => word.length > 0).length,
        characterCount: text.length,
        lastModified: new Date().toISOString(),
        version: '1.0'
      };
      
      onChange(structuredContent);
    },
  });

  // Update editor when value changes externally
  useEffect(() => {
    if (editor && value) {
      let content = '';
      
      // Handle different content formats
      if (value.json) {
        // Tiptap JSON format
        if (JSON.stringify(editor.getJSON()) !== JSON.stringify(value.json)) {
          editor.commands.setContent(value.json);
        }
        return;
      } else if (value.html) {
        // HTML content
        content = value.html;
      } else if (value.content) {
        // Legacy content format
        content = value.content;
      } else if (typeof value === 'string') {
        // Plain string
        content = value;
      }
      
      if (content && editor.getHTML() !== content) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, value]);

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter link URL:');
    if (url && editor) {
      if (editor.state.selection.empty) {
        const text = window.prompt('Enter link text:');
        if (text) {
          editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
        }
      } else {
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
  };

  const insertTable = () => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  };

  const removeLink = () => {
    if (editor) {
      editor.chain().focus().unsetLink().run();
    }
  };

  if (!editor) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="animate-pulse">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Toolbar */}
      <div className="border border-gray-300 rounded-t-lg bg-gray-50 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 flex-wrap gap-1">
            {/* Text Formatting */}
            <div className="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn(
                  'h-8 w-8 p-0',
                  editor.isActive('bold') ? 'bg-accent text-white' : ''
                )}
                title="Bold (Ctrl+B)"
              >
                <Icon name="Bold" size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn(
                  'h-8 w-8 p-0',
                  editor.isActive('italic') ? 'bg-accent text-white' : ''
                )}
                title="Italic (Ctrl+I)"
              >
                <Icon name="Italic" size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={cn(
                  'h-8 w-8 p-0',
                  editor.isActive('strike') ? 'bg-accent text-white' : ''
                )}
                title="Strikethrough"
              >
                <Icon name="Strikethrough" size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                className={cn(
                  'h-8 w-8 p-0',
                  editor.isActive('highlight') ? 'bg-accent text-white' : ''
                )}
                title="Highlight"
              >
                <Icon name="Highlighter" size={14} />
              </Button>
            </div>

            {/* Headings */}
            <div className="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={cn(
                  'h-8 w-8 p-0 text-xs',
                  editor.isActive('paragraph') ? 'bg-accent text-white' : ''
                )}
                title="Paragraph"
              >
                P
              </Button>
              {[1, 2, 3].map((level) => (
                <Button
                  key={level}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                  className={cn(
                    'h-8 w-8 p-0 text-xs',
                    editor.isActive('heading', { level }) ? 'bg-accent text-white' : ''
                  )}
                  title={`Heading ${level}`}
                >
                  H{level}
                </Button>
              ))}
            </div>

            {/* Lists */}
            <div className="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn(
                  'h-8 w-8 p-0',
                  editor.isActive('bulletList') ? 'bg-accent text-white' : ''
                )}
                title="Bullet List"
              >
                <Icon name="List" size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn(
                  'h-8 w-8 p-0',
                  editor.isActive('orderedList') ? 'bg-accent text-white' : ''
                )}
                title="Numbered List"
              >
                <Icon name="ListOrdered" size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn(
                  'h-8 w-8 p-0',
                  editor.isActive('blockquote') ? 'bg-accent text-white' : ''
                )}
                title="Quote"
              >
                <Icon name="Quote" size={14} />
              </Button>
            </div>

            {/* Insert */}
            <div className="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-2">
              {editor.isActive('link') ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeLink}
                  className="h-8 w-8 p-0 bg-accent text-white"
                  title="Remove Link"
                >
                  <Icon name="LinkOff" size={14} />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addLink}
                  className="h-8 w-8 p-0"
                  title="Add Link"
                >
                  <Icon name="Link" size={14} />
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addImage}
                className="h-8 w-8 p-0"
                title="Add Image"
              >
                <Icon name="Image" size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={insertTable}
                className="h-8 w-8 p-0"
                title="Insert Table"
              >
                <Icon name="Table" size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="h-8 w-8 p-0"
                title="Horizontal Rule"
              >
                <Icon name="Minus" size={14} />
              </Button>
            </div>

            {/* Text Align */}
            <div className="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={cn(
                  'h-8 w-8 p-0',
                  editor.isActive({ textAlign: 'left' }) ? 'bg-accent text-white' : ''
                )}
                title="Align Left"
              >
                <Icon name="AlignLeft" size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={cn(
                  'h-8 w-8 p-0',
                  editor.isActive({ textAlign: 'center' }) ? 'bg-accent text-white' : ''
                )}
                title="Align Center"
              >
                <Icon name="AlignCenter" size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={cn(
                  'h-8 w-8 p-0',
                  editor.isActive({ textAlign: 'right' }) ? 'bg-accent text-white' : ''
                )}
                title="Align Right"
              >
                <Icon name="AlignRight" size={14} />
              </Button>
            </div>

            {/* Undo/Redo */}
            <div className="flex items-center space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="h-8 w-8 p-0"
                title="Undo (Ctrl+Z)"
              >
                <Icon name="Undo" size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="h-8 w-8 p-0"
                title="Redo (Ctrl+Y)"
              >
                <Icon name="Redo" size={14} />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>{value?.wordCount || 0} words</span>
            <span>•</span>
            <span>{value?.characterCount || 0} chars</span>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="border border-t-0 border-gray-300 rounded-b-lg bg-white">
        <EditorContent 
          editor={editor} 
          className="min-h-[300px]"
        />
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-500">
        <details className="cursor-pointer">
          <summary>Keyboard Shortcuts</summary>
          <div className="mt-2 space-y-1 pl-4 grid grid-cols-2 gap-2">
            <div><kbd className="bg-gray-100 px-1 rounded text-xs">Ctrl+B</kbd> Bold</div>
            <div><kbd className="bg-gray-100 px-1 rounded text-xs">Ctrl+I</kbd> Italic</div>
            <div><kbd className="bg-gray-100 px-1 rounded text-xs">Ctrl+K</kbd> Link</div>
            <div><kbd className="bg-gray-100 px-1 rounded text-xs">Ctrl+Shift+8</kbd> Bullet List</div>
            <div><kbd className="bg-gray-100 px-1 rounded text-xs">Ctrl+Shift+7</kbd> Numbered List</div>
            <div><kbd className="bg-gray-100 px-1 rounded text-xs">Ctrl+Alt+1-3</kbd> Headings</div>
            <div><kbd className="bg-gray-100 px-1 rounded text-xs">Ctrl+Z</kbd> Undo</div>
            <div><kbd className="bg-gray-100 px-1 rounded text-xs">Ctrl+Y</kbd> Redo</div>
          </div>
        </details>
      </div>
    </div>
  );
};

// Content Display Component for viewing Tiptap content
export const TiptapContentDisplay = ({ content, className = '' }) => {
  if (!content) return null;

  // Handle different content formats safely
  let displayContent = '';
  
  try {
    if (content.html) {
      // Tiptap HTML format (preferred)
      displayContent = content.html;
    } else if (content.text) {
      // Plain text fallback
      return (
        <div className={cn('prose prose-sm max-w-none whitespace-pre-wrap', className)}>
          {content.text}
        </div>
      );
    } else if (typeof content === 'string') {
      // Legacy string content
      displayContent = content;
    } else if (content.content) {
      // Legacy content object
      if (typeof content.content === 'string') {
        displayContent = content.content;
      } else {
        return (
          <div className={cn('prose prose-sm max-w-none', className)}>
            <pre className="text-xs bg-gray-100 p-2 rounded whitespace-pre-wrap">
              {JSON.stringify(content.content, null, 2)}
            </pre>
          </div>
        );
      }
    } else {
      return (
        <div className={className}>
          <p className="text-gray-500 italic">No content available</p>
        </div>
      );
    }
  } catch (error) {
    console.error('Error displaying content:', error);
    return (
      <div className={className}>
        <p className="text-red-500 text-sm">Error displaying content</p>
      </div>
    );
  }

  return (
    <div 
      className={cn('prose prose-sm max-w-none', className)}
      dangerouslySetInnerHTML={{ __html: displayContent }}
    />
  );
};

export default TiptapContentEditor;