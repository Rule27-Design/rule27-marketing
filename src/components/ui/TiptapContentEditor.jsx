// src/components/ui/TiptapContentEditor.jsx - FIXED VERSION with better content handling
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
  minHeight = '300px'
}) => {
  const [isReady, setIsReady] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  // Helper function to extract content from various formats
  const extractContent = (contentValue) => {
    console.log('📝 TiptapEditor - Extracting content from:', contentValue);
    
    if (!contentValue) {
      console.log('📝 TiptapEditor - No content value provided');
      return '';
    }

    // If it's a string, return it directly
    if (typeof contentValue === 'string') {
      console.log('📝 TiptapEditor - Content is string:', contentValue.substring(0, 100) + '...');
      return contentValue;
    }

    // If it's an object, try different properties
    if (typeof contentValue === 'object') {
      console.log('📝 TiptapEditor - Content is object, keys:', Object.keys(contentValue));
      
      // Tiptap format (preferred)
      if (contentValue.html) {
        console.log('📝 TiptapEditor - Using .html property');
        return contentValue.html;
      }
      
      // Legacy content format
      if (contentValue.content) {
        if (typeof contentValue.content === 'string') {
          console.log('📝 TiptapEditor - Using .content string property');
          return contentValue.content;
        }
        // If content.content is HTML
        if (contentValue.content.html) {
          console.log('📝 TiptapEditor - Using .content.html property');
          return contentValue.content.html;
        }
      }
      
      // If it's a Tiptap document format
      if (contentValue.type === 'doc' && contentValue.content) {
        console.log('📝 TiptapEditor - Content appears to be Tiptap doc format');
        // This might be a Tiptap JSON document - convert to HTML
        try {
          // For now, we'll try to use it as-is and let Tiptap handle it
          return contentValue;
        } catch (error) {
          console.error('📝 TiptapEditor - Error with Tiptap doc format:', error);
        }
      }

      // Text property
      if (contentValue.text) {
        console.log('📝 TiptapEditor - Using .text property');
        return contentValue.text;
      }

      // If nothing else works, try to convert to JSON string for debugging
      console.log('📝 TiptapEditor - No recognizable content format, showing debug info');
      return `<!-- DEBUG: ${JSON.stringify(contentValue, null, 2)} -->`;
    }

    console.log('📝 TiptapEditor - Unrecognized content format:', typeof contentValue);
    return '';
  };

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
      console.log('📝 TiptapEditor - Editor created, setting ready state');
      setIsReady(true);
      
      // Set initial content after editor is ready
      if (value) {
        setTimeout(() => {
          try {
            const content = extractContent(value);
            console.log('📝 TiptapEditor - Setting initial content:', content ? 'Content found' : 'No content');
            
            if (content && editor) {
              editor.commands.setContent(content);
              console.log('📝 TiptapEditor - Initial content set successfully');
            }
          } catch (error) {
            console.error('📝 TiptapEditor - Error setting initial content:', error);
            setDebugInfo(`Error loading content: ${error.message}`);
          }
        }, 100);
      }
    },
    onUpdate: ({ editor }) => {
      if (!editor) return;
      
      try {
        const html = editor.getHTML();
        const text = editor.getText();
        
        console.log('📝 TiptapEditor - Content updated, word count:', text.split(/\s+/).filter(word => word.length > 0).length);
        
        // Create structured content for JSONB storage
        const structuredContent = {
          type: 'tiptap',
          html: html,
          text: text,
          wordCount: text.split(/\s+/).filter(word => word.length > 0).length,
          characterCount: text.length,
          lastModified: new Date().toISOString(),
          version: '1.0'
        };
        
        onChange?.(structuredContent);
      } catch (error) {
        console.error('📝 TiptapEditor - Error updating content:', error);
        setDebugInfo(`Error updating content: ${error.message}`);
      }
    },
  });

  // Update editor when value changes externally
  useEffect(() => {
    if (!editor || !isReady) {
      console.log('📝 TiptapEditor - Skipping update: editor ready?', !!editor, 'isReady?', isReady);
      return;
    }
    
    console.log('📝 TiptapEditor - External value changed, updating editor');
    
    try {
      if (value) {
        const content = extractContent(value);
        const currentContent = editor.getHTML();
        
        // Only update if content is different to avoid cursor jumping
        if (content && content !== currentContent && content !== '<!-- DEBUG:') {
          console.log('📝 TiptapEditor - Content changed, updating editor');
          editor.commands.setContent(content);
        }
      } else {
        // Clear editor if no value
        if (editor.getText()) {
          console.log('📝 TiptapEditor - Clearing editor content');
          editor.commands.clearContent();
        }
      }
    } catch (error) {
      console.error('📝 TiptapEditor - Error updating editor content:', error);
      setDebugInfo(`Error updating editor: ${error.message}`);
    }
  }, [editor, value, isReady]);

  // Show loading state while editor initializes
  if (!editor || !isReady) {
    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
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
      console.error('📝 TiptapEditor - Error adding link:', error);
    }
  };

  const removeLink = () => {
    if (!editor) return;
    
    try {
      editor.chain().focus().unsetLink().run();
    } catch (error) {
      console.error('📝 TiptapEditor - Error removing link:', error);
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
      console.error('📝 TiptapEditor - Error adding image:', error);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Debug Info */}
      {debugInfo && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800 font-medium">Editor Debug Info:</p>
              <p className="text-xs text-red-700 mt-1">{debugInfo}</p>
              <p className="text-xs text-red-600 mt-1">
                Content format: {typeof value} | Has value: {!!value ? 'Yes' : 'No'}
              </p>
            </div>
            <button 
              onClick={() => setDebugInfo('')}
              className="text-red-400 hover:text-red-600"
            >
              <Icon name="X" size={14} />
            </button>
          </div>
        </div>
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

      {/* Content Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <details className="text-xs text-gray-500">
          <summary className="cursor-pointer">Debug: Content Info</summary>
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
            <div><strong>Value type:</strong> {typeof value}</div>
            <div><strong>Has value:</strong> {!!value ? 'Yes' : 'No'}</div>
            <div><strong>Value keys:</strong> {value && typeof value === 'object' ? Object.keys(value).join(', ') : 'N/A'}</div>
            <div><strong>Editor ready:</strong> {isReady ? 'Yes' : 'No'}</div>
            <div><strong>Current HTML length:</strong> {editor?.getHTML()?.length || 0}</div>
          </div>
        </details>
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

// Content Display Component for viewing Tiptap content - ALSO FIXED
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