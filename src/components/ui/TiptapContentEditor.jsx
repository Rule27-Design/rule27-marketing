// src/components/ui/TiptapContentEditor.jsx - Complete version with JSON format support
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Button from './Button';
import Icon from '../AppIcon';
import { cn } from '../../utils/cn';

const TiptapContentEditor = ({ 
  value = null, 
  onChange, 
  label = 'Content',
  placeholder = 'Start writing your content...',
  className = '',
  minHeight = '300px',
  required = false,
  error = null
}) => {
  const [isReady, setIsReady] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none focus:outline-none',
          'min-h-[300px] p-4 border-0'
        ),
        style: `min-height: ${minHeight}`,
      },
    },
    onCreate: ({ editor }) => {
      setIsReady(true);
      // Set initial content after editor is ready
      if (value) {
        setTimeout(() => {
          try {
            console.log('🎯 TipTap Editor - Setting initial value:', value);
            
            // Handle different content formats
            if (value.type === 'doc' && Array.isArray(value.content)) {
              // Direct TipTap JSON (Case Studies format)
              console.log('🎯 Using direct TipTap JSON (Case Studies format)');
              editor.commands.setContent(value);
            } else if (value.json && typeof value.json === 'object') {
              // TipTap JSON format (Articles format)
              console.log('🎯 Using TipTap JSON format (Articles)');
              editor.commands.setContent(value.json);
            } else if (value.html) {
              // HTML format
              console.log('🎯 Using HTML format');
              editor.commands.setContent(value.html);
            } else if (value.content) {
              // Legacy format
              console.log('🎯 Using legacy content format');
              const content = typeof value.content === 'string' ? value.content : '';
              editor.commands.setContent(content);
            } else if (typeof value === 'string') {
              // Plain string
              console.log('🎯 Using plain string format');
              editor.commands.setContent(value);
            } else {
              console.log('🎯 Unknown format, using empty content');
              editor.commands.setContent('');
            }
          } catch (error) {
            console.error('❌ Error setting initial content:', error);
          }
        }, 100);
      }
    },
    onUpdate: ({ editor }) => {
      if (!editor) return;
      
      try {
        const html = editor.getHTML();
        const text = editor.getText();
        const json = editor.getJSON();
        const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
        
        // Check if we're in Case Studies mode (value is raw JSON) or Articles mode
        const isRawJsonMode = value && value.type === 'doc' && !value.html;
        
        if (isRawJsonMode) {
          // Case Studies mode - just send the raw JSON
          console.log('📝 Sending raw TipTap JSON (Case Studies mode)');
          onChange?.(json);
        } else {
          // Articles mode - send structured content
          console.log('📝 Sending structured content (Articles mode)');
          const structuredContent = {
            type: 'tiptap',
            html: html,
            json: json,
            text: text,
            wordCount: wordCount,
            characterCount: text.length,
            lastModified: new Date().toISOString(),
            version: '2.0'
          };
          onChange?.(structuredContent);
        }
      } catch (error) {
        console.error('❌ Error updating content:', error);
      }
    },
  });

  // Update editor when value changes externally
  useEffect(() => {
    if (!editor || !isReady) return;
    
    // Only update if the content has actually changed
    try {
      console.log('🔄 TipTap Editor - External value changed:', value);
      
      if (value) {
        // Get current content to avoid unnecessary updates
        const currentJSON = editor.getJSON();
        
        // Determine what content to set
        let newContent = null;
        let contentType = 'none';
        
        if (value.type === 'doc' && Array.isArray(value.content)) {
          // Direct TipTap JSON (Case Studies format)
          newContent = value;
          contentType = 'direct-json';
        } else if (value.json && typeof value.json === 'object') {
          newContent = value.json;
          contentType = 'json';
        } else if (value.html) {
          newContent = value.html;
          contentType = 'html';
        } else if (value.content) {
          newContent = typeof value.content === 'string' ? value.content : '';
          contentType = 'legacy';
        } else if (typeof value === 'string') {
          newContent = value;
          contentType = 'string';
        }
        
        console.log(`🔄 Content type detected: ${contentType}`);
        
        // Only update if content is different
        if (newContent) {
          const shouldUpdate = (contentType === 'json' || contentType === 'direct-json')
            ? JSON.stringify(currentJSON) !== JSON.stringify(newContent)
            : true; // For HTML/string, always update as comparison is complex
          
          if (shouldUpdate) {
            console.log('🔄 Updating editor content');
            editor.commands.setContent(newContent);
          } else {
            console.log('🔄 Content unchanged, skipping update');
          }
        }
      } else {
        // Clear editor if value is null/undefined
        const currentText = editor.getText();
        if (currentText && currentText.trim()) {
          editor.commands.clearContent();
        }
      }
    } catch (error) {
      console.error('❌ Error updating editor content:', error);
    }
  }, [editor, value, isReady]);

  // Show loading state while editor initializes
  if (!editor || !isReady) {
    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="border rounded-lg p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-2"></div>
            <div className="text-sm text-gray-600">Loading editor...</div>
          </div>
        </div>
      </div>
    );
  }

  const addLink = () => {
    if (!editor) return;
    
    try {
      const url = window.prompt('Enter link URL:');
      if (url) {
        if (editor.state.selection.empty) {
          const text = window.prompt('Enter link text:');
          if (text) {
            editor.chain().focus().insertContent(`<a href="${url}" class="text-accent underline">${text}</a>`).run();
          }
        } else {
          editor.chain().focus().setLink({ href: url }).run();
        }
      }
    } catch (error) {
      console.error('Error adding link:', error);
    }
  };

  const removeLink = () => {
    if (!editor) return;
    
    try {
      editor.chain().focus().unsetLink().run();
    } catch (error) {
      console.error('Error removing link:', error);
    }
  };

  const addImage = () => {
    if (!editor) return;
    
    try {
      const url = window.prompt('Enter image URL:');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } catch (error) {
      console.error('Error adding image:', error);
    }
  };

  // Calculate word count for display
  const getWordCount = () => {
    if (!editor) return 0;
    const text = editor.getText();
    return text.split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCharCount = () => {
    if (!editor) return 0;
    return editor.getText().length;
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Toolbar */}
      <div className={cn(
        "border border-gray-300 rounded-t-lg bg-gray-50 px-3 py-2",
        error && "border-red-500"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 flex-wrap gap-1">
            {/* Text Formatting */}
            <div className="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain()?.focus()?.toggleBold()?.run()}
                className={cn(
                  'h-8 w-8 p-0',
                  editor?.isActive('bold') ? 'bg-accent text-white' : ''
                )}
                title="Bold (Ctrl+B)"
              >
                <Icon name="Bold" size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain()?.focus()?.toggleItalic()?.run()}
                className={cn(
                  'h-8 w-8 p-0',
                  editor?.isActive('italic') ? 'bg-accent text-white' : ''
                )}
                title="Italic (Ctrl+I)"
              >
                <Icon name="Italic" size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain()?.focus()?.toggleStrike()?.run()}
                className={cn(
                  'h-8 w-8 p-0',
                  editor?.isActive('strike') ? 'bg-accent text-white' : ''
                )}
                title="Strikethrough"
              >
                <Icon name="Strikethrough" size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain()?.focus()?.toggleCode()?.run()}
                className={cn(
                  'h-8 w-8 p-0',
                  editor?.isActive('code') ? 'bg-accent text-white' : ''
                )}
                title="Code"
              >
                <Icon name="Code" size={14} />
              </Button>
            </div>

            {/* Headings */}
            <div className="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain()?.focus()?.setParagraph()?.run()}
                className={cn(
                  'h-8 w-8 p-0 text-xs',
                  editor?.isActive('paragraph') ? 'bg-accent text-white' : ''
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
                  onClick={() => editor?.chain()?.focus()?.toggleHeading({ level })?.run()}
                  className={cn(
                    'h-8 w-8 p-0 text-xs',
                    editor?.isActive('heading', { level }) ? 'bg-accent text-white' : ''
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
                onClick={() => editor?.chain()?.focus()?.toggleBulletList()?.run()}
                className={cn(
                  'h-8 w-8 p-0',
                  editor?.isActive('bulletList') ? 'bg-accent text-white' : ''
                )}
                title="Bullet List"
              >
                <Icon name="List" size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain()?.focus()?.toggleOrderedList()?.run()}
                className={cn(
                  'h-8 w-8 p-0',
                  editor?.isActive('orderedList') ? 'bg-accent text-white' : ''
                )}
                title="Numbered List"
              >
                <Icon name="ListOrdered" size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain()?.focus()?.toggleBlockquote()?.run()}
                className={cn(
                  'h-8 w-8 p-0',
                  editor?.isActive('blockquote') ? 'bg-accent text-white' : ''
                )}
                title="Quote"
              >
                <Icon name="Quote" size={14} />
              </Button>
            </div>

            {/* Insert */}
            <div className="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-2">
              {editor?.isActive('link') ? (
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
                onClick={() => editor?.chain()?.focus()?.setHorizontalRule()?.run()}
                className="h-8 w-8 p-0"
                title="Horizontal Rule"
              >
                <Icon name="Minus" size={14} />
              </Button>
            </div>

            {/* Undo/Redo */}
            <div className="flex items-center space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain()?.focus()?.undo()?.run()}
                disabled={!editor?.can()?.undo()}
                className="h-8 w-8 p-0"
                title="Undo (Ctrl+Z)"
              >
                <Icon name="Undo" size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain()?.focus()?.redo()?.run()}
                disabled={!editor?.can()?.redo()}
                className="h-8 w-8 p-0"
                title="Redo (Ctrl+Y)"
              >
                <Icon name="Redo" size={14} />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>{getWordCount()} words</span>
            <span>•</span>
            <span>{getCharCount()} chars</span>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className={cn(
        "border border-t-0 border-gray-300 rounded-b-lg bg-white",
        error && "border-red-500"
      )}>
        <EditorContent 
          editor={editor} 
          className="min-h-[300px]"
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500">
        <details className="cursor-pointer">
          <summary>Keyboard Shortcuts</summary>
          <div className="mt-2 space-y-1 pl-4 grid grid-cols-2 gap-2">
            <div><kbd className="bg-gray-100 px-1 rounded text-xs">Ctrl+B</kbd> Bold</div>
            <div><kbd className="bg-gray-100 px-1 rounded text-xs">Ctrl+I</kbd> Italic</div>
            <div><kbd className="bg-gray-100 px-1 rounded text-xs">Ctrl+Shift+8</kbd> Bullet List</div>
            <div><kbd className="bg-gray-100 px-1 rounded text-xs">Ctrl+Shift+7</kbd> Numbered List</div>
            <div><kbd className="bg-gray-100 px-1 rounded text-xs">Ctrl+Alt+1-3</kbd> Headings</div>
            <div><kbd className="bg-gray-100 px-1 rounded text-xs">Ctrl+Z</kbd> Undo</div>
            <div><kbd className="bg-gray-100 px-1 rounded text-xs">Ctrl+Y</kbd> Redo</div>
            <div><kbd className="bg-gray-100 px-1 rounded text-xs">Ctrl+K</kbd> Link</div>
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
    // Priority order: HTML > text > JSON fallback
    if (content.html) {
      // Tiptap HTML format (preferred for display)
      displayContent = content.html;
    } else if (content.text && content.text !== 'Debug: {' && !content.text.startsWith('Debug:')) {
      // Plain text fallback (but not debug text)
      return (
        <div className={cn('prose prose-sm max-w-none whitespace-pre-wrap', className)}>
          {content.text}
        </div>
      );
    } else if (typeof content === 'string') {
      // Legacy string content
      displayContent = content;
    } else if (content.content && typeof content.content === 'string') {
      // Legacy content object with string content
      displayContent = content.content;
    } else if (content.json && typeof content.json === 'object') {
      // TipTap JSON format - convert to HTML-like display
      const renderNode = (node) => {
        if (node.type === 'text') {
          return node.text;
        }
        if (node.type === 'paragraph') {
          return `<p>${node.content?.map(renderNode).join('') || ''}</p>`;
        }
        if (node.type === 'doc') {
          return node.content?.map(renderNode).join('') || '';
        }
        return '';
      };
      displayContent = renderNode(content.json);
    } else if (content.type === 'doc' && Array.isArray(content.content)) {
      // Direct TipTap JSON format (Case Studies) - convert to HTML-like display
      const renderNode = (node) => {
        if (node.type === 'text') {
          return node.text;
        }
        if (node.type === 'paragraph') {
          return `<p>${node.content?.map(renderNode).join('') || ''}</p>`;
        }
        if (node.type === 'doc') {
          return node.content?.map(renderNode).join('') || '';
        }
        return '';
      };
      displayContent = renderNode(content);
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