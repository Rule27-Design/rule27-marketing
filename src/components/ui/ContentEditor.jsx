// src/components/ui/ContentEditor.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import Button from './Button';
import Icon from '../AppIcon';
import { cn } from '../../utils/cn';

const ContentEditor = ({ 
  value = null, 
  onChange, 
  label = 'Content',
  placeholder = 'Start writing your content...',
  className = '',
  minHeight = '300px'
}) => {
  // Convert JSONB content to editable format
  const [content, setContent] = useState('');
  const [mode, setMode] = useState('visual'); // 'visual' or 'markdown'
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    if (value) {
      try {
        // Handle different content formats
        if (typeof value === 'string') {
          setContent(value);
        } else if (value && typeof value === 'object') {
          if (value.blocks && Array.isArray(value.blocks)) {
            // Convert blocks back to readable content
            const textContent = value.blocks.map(block => {
              if (block && typeof block === 'object') {
                if (block.type === 'paragraph') {
                  return block.content || '';
                } else if (block.type === 'heading') {
                  return `${'#'.repeat(block.level || 1)} ${block.content || ''}`;
                } else if (block.type === 'list') {
                  return (block.items || []).map(item => `- ${item}`).join('\n');
                }
                return block.content || '';
              }
              return String(block || '');
            }).join('\n\n');
            setContent(textContent);
            setBlocks(value.blocks);
          } else if (value.content) {
            // Handle content object with content property
            if (typeof value.content === 'string') {
              setContent(value.content);
            } else {
              // If content is not a string, convert to JSON string for editing
              setContent(JSON.stringify(value.content, null, 2));
            }
          } else {
            // Try to convert the entire object to a readable format
            setContent(JSON.stringify(value, null, 2));
          }
        } else {
          // Fallback for any other type
          setContent(String(value || ''));
        }
      } catch (error) {
        console.error('Error parsing content:', error);
        setContent('');
      }
    } else {
      setContent('');
    }
  }, [value]);

  const handleContentChange = (newContent) => {
    // Ensure newContent is always a string
    const contentString = typeof newContent === 'string' ? newContent : String(newContent || '');
    setContent(contentString);
    
    // Convert content to structured format
    const structuredContent = {
      type: 'doc',
      content: contentString,
      blocks: parseContentToBlocks(contentString),
      wordCount: contentString.split(/\s+/).filter(word => word.length > 0).length,
      lastModified: new Date().toISOString()
    };
    
    onChange(structuredContent);
  };

  const parseContentToBlocks = (text) => {
    // Ensure text is a string
    if (!text || typeof text !== 'string') {
      return [];
    }
    
    const lines = text.split('\n').filter(line => line.trim());
    const blocks = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      // Check for headings
      if (trimmed.startsWith('#')) {
        const level = trimmed.match(/^#+/)?.[0]?.length || 1;
        const content = trimmed.replace(/^#+\s*/, '');
        blocks.push({
          type: 'heading',
          level: Math.min(level, 6),
          content: content
        });
      }
      // Check for lists
      else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        const content = trimmed.replace(/^[-*]\s*/, '');
        // Check if previous block is a list
        const lastBlock = blocks[blocks.length - 1];
        if (lastBlock && lastBlock.type === 'list') {
          lastBlock.items.push(content);
        } else {
          blocks.push({
            type: 'list',
            items: [content]
          });
        }
      }
      // Regular paragraph
      else if (trimmed) {
        blocks.push({
          type: 'paragraph',
          content: trimmed
        });
      }
    });
    
    return blocks;
  };

  const insertFormatting = (format) => {
    const textarea = document.getElementById('content-editor');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let insertion = '';
    let cursorOffset = 0;
    
    switch (format) {
      case 'bold':
        insertion = `**${selectedText}**`;
        cursorOffset = selectedText ? 0 : 2;
        break;
      case 'italic':
        insertion = `*${selectedText}*`;
        cursorOffset = selectedText ? 0 : 1;
        break;
      case 'heading':
        insertion = `## ${selectedText}`;
        cursorOffset = selectedText ? 0 : 3;
        break;
      case 'list':
        insertion = `- ${selectedText}`;
        cursorOffset = selectedText ? 0 : 2;
        break;
      case 'link':
        insertion = `[${selectedText || 'Link text'}](URL)`;
        cursorOffset = selectedText ? -4 : -4;
        break;
    }
    
    const newContent = content.substring(0, start) + insertion + content.substring(end);
    handleContentChange(newContent);
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + insertion.length + cursorOffset;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const formatButtons = [
    { icon: 'Bold', action: 'bold', title: 'Bold' },
    { icon: 'Italic', action: 'italic', title: 'Italic' },
    { icon: 'Heading', action: 'heading', title: 'Heading' },
    { icon: 'List', action: 'list', title: 'List' },
    { icon: 'Link', action: 'link', title: 'Link' }
  ];

  // Calculate word count safely
  const wordCount = typeof content === 'string' 
    ? content.split(/\s+/).filter(word => word.length > 0).length 
    : 0;

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
          <div className="flex items-center space-x-1">
            {formatButtons.map((button) => (
              <Button
                key={button.action}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting(button.action)}
                className="h-8 w-8 p-0"
                title={button.title}
              >
                <Icon name={button.icon} size={14} />
              </Button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {wordCount} words
            </span>
            <div className="flex bg-white rounded border">
              <button
                type="button"
                onClick={() => setMode('visual')}
                className={cn(
                  'px-2 py-1 text-xs',
                  mode === 'visual' ? 'bg-accent text-white' : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                Visual
              </button>
              <button
                type="button"
                onClick={() => setMode('markdown')}
                className={cn(
                  'px-2 py-1 text-xs',
                  mode === 'markdown' ? 'bg-accent text-white' : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                Markdown
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      {mode === 'visual' ? (
        <div className="border border-t-0 border-gray-300 rounded-b-lg">
          <textarea
            id="content-editor"
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 border-0 resize-none focus:ring-0 focus:outline-none rounded-b-lg"
            style={{ minHeight }}
          />
        </div>
      ) : (
        <div className="border border-t-0 border-gray-300 rounded-b-lg">
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Write in Markdown format..."
            className="w-full p-4 border-0 resize-none focus:ring-0 focus:outline-none rounded-b-lg font-mono text-sm"
            style={{ minHeight }}
          />
        </div>
      )}

      {/* Preview for blocks */}
      {blocks.length > 0 && mode === 'visual' && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-medium mb-2">Content Structure:</h4>
          <div className="text-xs text-gray-600 space-y-1">
            {blocks.map((block, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Icon 
                  name={
                    block.type === 'heading' ? 'Heading' :
                    block.type === 'list' ? 'List' :
                    'FileText'
                  } 
                  size={12} 
                />
                <span>
                  {block.type === 'heading' && `H${block.level}: ${block.content?.substring(0, 50)}...`}
                  {block.type === 'list' && `List: ${block.items?.length} items`}
                  {block.type === 'paragraph' && `Paragraph: ${block.content?.substring(0, 50)}...`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500">
        <details className="cursor-pointer">
          <summary>Formatting Help</summary>
          <div className="mt-2 space-y-1 pl-4">
            <div><strong>**bold**</strong> for bold text</div>
            <div><em>*italic*</em> for italic text</div>
            <div><strong>## Heading</strong> for headings</div>
            <div><strong>- Item</strong> for lists</div>
            <div><strong>[Link](URL)</strong> for links</div>
          </div>
        </details>
      </div>
    </div>
  );
};

// Content Display Component for viewing structured content - ALSO FIXED
export const ContentDisplay = ({ content, className = '' }) => {
  if (!content) return null;

  // Handle different content formats safely
  let blocks = [];
  
  try {
    if (typeof content === 'string') {
      // Plain text content
      return (
        <div className={cn('prose prose-sm max-w-none', className)}>
          {content.split('\n').map((line, index) => (
            <p key={index}>{line || '\u00A0'}</p>
          ))}
        </div>
      );
    } else if (content && typeof content === 'object') {
      if (content.blocks && Array.isArray(content.blocks)) {
        blocks = content.blocks;
      } else if (content.content) {
        // Handle content object with content property
        if (typeof content.content === 'string') {
          return (
            <div className={cn('prose prose-sm max-w-none', className)}>
              {content.content.split('\n').map((line, index) => (
                <p key={index}>{line || '\u00A0'}</p>
              ))}
            </div>
          );
        } else {
          // Try to render as JSON if it's an object
          return (
            <div className={cn('prose prose-sm max-w-none', className)}>
              <pre className="text-xs bg-gray-100 p-2 rounded">
                {JSON.stringify(content.content, null, 2)}
              </pre>
            </div>
          );
        }
      } else {
        // Try to render the object as JSON
        return (
          <div className={cn('prose prose-sm max-w-none', className)}>
            <pre className="text-xs bg-gray-100 p-2 rounded">
              {JSON.stringify(content, null, 2)}
            </pre>
          </div>
        );
      }
    } else {
      return <div className={className}>Content could not be displayed</div>;
    }
  } catch (error) {
    console.error('Error displaying content:', error);
    return (
      <div className={className}>
        <p className="text-red-500 text-sm">Error displaying content</p>
        <pre className="text-xs bg-gray-100 p-2 rounded mt-2">
          {String(content)}
        </pre>
      </div>
    );
  }

  return (
    <div className={cn('prose prose-sm max-w-none', className)}>
      {blocks.map((block, index) => {
        try {
          if (!block || typeof block !== 'object') {
            return <p key={index}>{String(block || '')}</p>;
          }

          switch (block.type) {
            case 'heading':
              const HeadingTag = `h${Math.min(block.level || 1, 6)}`;
              return React.createElement(
                HeadingTag,
                { key: index, className: 'font-heading-bold uppercase' },
                block.content || ''
              );
            
            case 'paragraph':
              return <p key={index}>{block.content || ''}</p>;
            
            case 'list':
              return (
                <ul key={index}>
                  {(block.items || []).map((item, itemIndex) => (
                    <li key={itemIndex}>{item || ''}</li>
                  ))}
                </ul>
              );
            
            default:
              return <p key={index}>{block.content || String(block)}</p>;
          }
        } catch (blockError) {
          console.error('Error rendering block:', blockError, block);
          return <p key={index} className="text-red-500 text-sm">Error rendering content block</p>;
        }
      })}
    </div>
  );
};

export default ContentEditor;