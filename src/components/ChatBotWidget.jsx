import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, Bot, User, Loader, RefreshCw, Phone, Mail, Sparkles, Paperclip, AlertCircle } from 'lucide-react';

const ChatBotWidget = ({ 
  supabaseClient,
  position = 'bottom-right',
  primaryColor = '#E53E3E',
  companyName = 'Rule27 Design',
  autoOpen = false,
  customWelcome = null
}) => {
  // State Management
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [visitorId, setVisitorId] = useState(null);
  const [visitorProfileId, setVisitorProfileId] = useState(null);
  const [leadScore, setLeadScore] = useState(0);
  const [isHumanTakeover, setIsHumanTakeover] = useState(false);
  const [quickActions, setQuickActions] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [connectionError, setConnectionError] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize conversation on mount
  useEffect(() => {
    initializeChat();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    console.log('Starting Larry initialization...');
    try {
      setIsInitializing(true);
      setConnectionError(false);
      
      // Get or create visitor ID
      let vid = localStorage.getItem('rule27_visitor_id');
      if (!vid) {
        vid = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('rule27_visitor_id', vid);
      }
      setVisitorId(vid);

      // Try to connect to Supabase if available
      let supabaseConnected = false;
      if (supabaseClient) {
        try {
          // Test connection
          const { error: testError } = await supabaseClient
            .from('visitor_profiles')
            .select('id')
            .limit(1);
          
          if (!testError) {
            supabaseConnected = true;
            setDbConnected(true);
            console.log('Supabase connected successfully');
            
            // Try to create/update visitor profile
            try {
              const { data: profile } = await supabaseClient
                .from('visitor_profiles')
                .upsert({
                  visitor_id: vid,
                  last_seen: new Date().toISOString(),
                  pages_visited: [window.location.pathname]
                }, { 
                  onConflict: 'visitor_id'
                })
                .select()
                .single();
              
              if (profile) {
                setVisitorProfileId(profile.id);
              }
            } catch (profileError) {
              console.log('Profile creation skipped:', profileError.message);
            }
            
            // Try to create conversation
            try {
              const { data: conversation } = await supabaseClient
                .from('conversations')
                .insert({
                  visitor_id: vid,
                  visitor_profile_id: visitorProfileId,
                  started_at: new Date().toISOString(),
                  channel: 'website',
                  status: 'active',
                  page_url: window.location.href,
                  referrer_url: document.referrer || null
                })
                .select()
                .single();
              
              if (conversation) {
                setConversationId(conversation.id);
              }
            } catch (convError) {
              console.log('Conversation creation skipped:', convError.message);
              setConversationId(`offline_${Date.now()}`);
            }
          } else {
            console.log('Supabase test failed, running offline:', testError.message);
          }
        } catch (dbError) {
          console.log('Supabase unavailable, running offline:', dbError.message);
        }
      } else {
        console.log('No Supabase client provided, running offline');
      }
      
      // Set conversation ID if not set
      if (!conversationId) {
        setConversationId(`offline_${Date.now()}`);
      }

      // Always set welcome message
      const welcomeText = customWelcome || 
        "👋 Hey there! I'm Larry, your Rule27 AI assistant. I can help you explore our marketing and development services, or connect you with our team. What brings you here today?";
      
      setMessages([{
        id: 'welcome',
        text: welcomeText,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      }]);

      // Set initial quick actions
      setQuickActions([
        { icon: '💰', text: 'Pricing Info', value: 'pricing' },
        { icon: '🚀', text: 'Our Services', value: 'services' },
        { icon: '📊', text: 'Case Studies', value: 'case-studies' },
        { icon: '📅', text: 'Book a Call', value: 'consultation' }
      ]);

      // Track chat opened event
      window.dispatchEvent(new CustomEvent('chatbot:opened', { 
        detail: { conversationId: conversationId || `offline_${Date.now()}`, visitorId: vid } 
      }));

    } catch (error) {
      console.error('Chat initialization error:', error);
      // Even on error, show basic chat
      setConversationId(`error_${Date.now()}`);
      setMessages([{
        id: 'welcome',
        text: "👋 Hi! I'm Larry from Rule27. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      }]);
      setQuickActions([
        { icon: '💰', text: 'Pricing Info', value: 'pricing' },
        { icon: '🚀', text: 'Our Services', value: 'services' }
      ]);
    } finally {
      setIsInitializing(false);
      console.log('Larry initialization complete');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !uploadedFile) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: uploadedFile ? 'file' : 'text',
      file: uploadedFile
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue; // Store for use in API call
    setInputValue('');
    setUploadedFile(null);
    setIsTyping(true);
    setQuickActions([]);

    try {
      // Try to store in Supabase if connected
      if (dbConnected && supabaseClient && conversationId && !conversationId.startsWith('offline')) {
        try {
          await supabaseClient
            .from('messages')
            .insert({
              conversation_id: conversationId,
              sender: 'user',
              content: currentInput,
              message_type: uploadedFile ? 'file' : 'text',
              file_attachment: uploadedFile,
              timestamp: new Date().toISOString()
            });
        } catch (dbError) {
          console.log('Message storage skipped:', dbError.message);
        }
      }

      // Call backend API for bot response
      const response = await fetch('/.netlify/functions/chatbot-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          conversationId: conversationId || 'offline',
          visitorId: visitorId || 'anonymous',
          visitorProfileId,
          file: uploadedFile
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Debug: Check if using OpenAI or fallback
      if (data.powered_by === 'openai') {
        console.log('✅ Response powered by OpenAI');
      } else if (data.error_fallback) {
        console.log('⚠️ Using fallback response (OpenAI failed)');
      } else {
        console.log('ℹ️ Using standard response');
      }
      
      setIsTyping(false);
      
      // Create bot message
      const botMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
        type: data.type || 'text',
        confidence: data.confidence,
        intent: data.intent
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Try to store bot response in Supabase
      if (dbConnected && supabaseClient && conversationId && !conversationId.startsWith('offline')) {
        try {
          await supabaseClient
            .from('messages')
            .insert({
              conversation_id: conversationId,
              sender: 'bot',
              content: data.response,
              message_type: data.type || 'text',
              detected_intent: data.intent,
              confidence: data.confidence,
              quick_actions: data.quickActions,
              timestamp: new Date().toISOString()
            });
        } catch (dbError) {
          console.log('Bot message storage skipped:', dbError.message);
        }
      }
      
      // Update lead score
      if (data.leadScore) {
        setLeadScore(data.leadScore);
      }
      
      // Check for human takeover
      if (data.escalated) {
        setIsHumanTakeover(true);
        handleHumanTakeover();
      }
      
      // Set new quick actions if provided
      if (data.quickActions && data.quickActions.length > 0) {
        setQuickActions(data.quickActions);
      }

      // Track message event
      window.dispatchEvent(new CustomEvent('chatbot:message', { 
        detail: { intent: data.intent, conversationId } 
      }));
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      // Fallback response
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "I'm here to help! Our services start at $25K and we excel at both marketing AND development. For immediate assistance, call us at (555) RULE-27 or email hello@rule27design.com. What specific challenge are you facing?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      }]);
      
      setQuickActions([
        { icon: '📞', text: 'Call Us', value: 'call' },
        { icon: '📧', text: 'Email Us', value: 'email' },
        { icon: '🔄', text: 'Try Again', value: 'retry' }
      ]);
    }
  };

  const handleQuickAction = async (action) => {
    if (action.value === 'retry') {
      await initializeChat();
      return;
    }
    
    if (action.value === 'call') {
      window.location.href = 'tel:+15557853277';
      return;
    }
    
    if (action.value === 'email') {
      window.location.href = 'mailto:hello@rule27design.com';
      return;
    }
    
    setInputValue(action.text);
    handleSendMessage();
  };

  const handleHumanTakeover = () => {
    setMessages(prev => [...prev, {
      id: 'human-takeover',
      text: "🎉 Great news! I've connected you with one of our experts who can better assist you. They'll be with you in just a moment!",
      sender: 'system',
      timestamp: new Date(),
      type: 'announcement'
    }]);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type
      });
    }
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    if (!conversationId || conversationId.startsWith('error')) {
      initializeChat();
    }
  };

  // Message Component
  const Message = ({ message }) => {
    const isBot = message.sender === 'bot';
    const isSystem = message.sender === 'system';
    const isError = message.type === 'error';
    
    return (
      <div className={`flex ${isBot || isSystem ? 'justify-start' : 'justify-end'} mb-4 animate-fadeIn`}>
        <div className={`flex ${isBot || isSystem ? 'flex-row' : 'flex-row-reverse'} items-start max-w-[80%]`}>
          {/* Avatar */}
          <div className={`flex-shrink-0 ${isBot || isSystem ? 'mr-2' : 'ml-2'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isBot ? 'bg-gradient-to-br from-red-500 to-red-600' :
              isSystem ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
              isError ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
              'bg-gray-300'
            }`}>
              {isBot ? <span className="text-sm">🤖</span> :
               isSystem ? <Sparkles size={16} className="text-white" /> :
               isError ? <AlertCircle size={16} className="text-white" /> :
               <User size={16} className="text-gray-600" />}
            </div>
          </div>
          
          {/* Message Bubble */}
          <div className={`px-4 py-2.5 rounded-2xl ${
            isBot ? 'bg-gray-100 text-gray-800' :
            isSystem ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 border border-purple-200' :
            isError ? 'bg-yellow-50 text-yellow-900 border border-yellow-200' :
            `bg-gradient-to-br text-white`
          }`}
          style={!isBot && !isSystem && !isError ? {
            backgroundImage: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
          } : {}}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
            {message.file && (
              <div className="mt-2 p-2 bg-white/20 rounded flex items-center space-x-2">
                <Paperclip size={14} />
                <span className="text-xs">{message.file.name}</span>
              </div>
            )}
            {message.confidence && message.confidence < 0.6 && (
              <p className="text-xs mt-1 opacity-70">Confidence: {Math.round(message.confidence * 100)}%</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Main Render
  return (
    <>
      {/* Chat Button - Always visible when chat is closed - FIXED POSITIONING */}
      {!isOpen && (
        <button
          onClick={handleOpenChat}
          className="larry-chat-button"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: position === 'bottom-right' ? '24px' : 'auto',
            left: position === 'bottom-left' ? '24px' : 'auto',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            border: 'none',
            outline: 'none',
            transition: 'all 0.3s ease',
            animation: 'larry-pulse 3s ease-in-out infinite'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
          }}
        >
          <MessageCircle size={28} style={{ color: 'white' }} />
          <span 
            style={{ 
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: 'white',
              color: primaryColor,
              padding: '4px 8px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              whiteSpace: 'nowrap'
            }}
          >
            Larry
          </span>
          {leadScore > 50 && (
            <span 
              style={{
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                width: '12px',
                height: '12px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                animation: 'larry-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
              }}
            />
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="larry-chat-window"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: position === 'bottom-right' ? '24px' : 'auto',
            left: position === 'bottom-left' ? '24px' : 'auto',
            height: isMinimized ? '60px' : '600px',
            width: '380px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            zIndex: 9999
          }}
        >
          
          {/* Header */}
          <div 
            className={`flex items-center justify-between ${isMinimized ? 'p-3' : 'p-4'} border-b`}
            style={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
              </div>
              <div>
                <h3 className="text-white font-semibold">Larry</h3>
                {!isMinimized && (
                  <p className="text-white/80 text-xs">
                    {isHumanTakeover ? '🟢 Expert Connected' : 
                     dbConnected ? '🤖 AI Assistant | Rule27' : 
                     '🤖 AI Assistant | Offline Mode'}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white/80 hover:text-white transition-colors"
              >
                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Lead Score Indicator */}
              {leadScore > 0 && (
                <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Qualification Score</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                          style={{ width: `${leadScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{leadScore}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {isInitializing ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader className="w-8 h-8 text-red-500 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Larry is waking up...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <Message key={message.id} message={message} />
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start mb-4">
                        <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-2xl">
                          <div className="flex space-x-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              {quickActions.length > 0 && (
                <div className="px-4 py-2 border-t bg-gray-50">
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action)}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs 
                                 hover:border-red-300 hover:bg-red-50 transition-all duration-200
                                 flex items-center space-x-1"
                        disabled={isTyping}
                      >
                        <span>{action.icon}</span>
                        <span>{action.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t bg-white">
                {uploadedFile && (
                  <div className="mb-2 p-2 bg-gray-100 rounded flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Paperclip size={14} className="text-gray-500" />
                      <span className="text-xs text-gray-600">{uploadedFile.name}</span>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  />
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Attach file"
                  >
                    <Paperclip size={18} />
                  </button>
                  
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder={
                      isHumanTakeover ? "Chat with our expert..." : 
                      "Type your message..."
                    }
                    disabled={isInitializing}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm
                             focus:outline-none focus:border-red-300 transition-colors
                             disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={(!inputValue.trim() && !uploadedFile) || isInitializing}
                    className="p-2 rounded-full transition-all duration-200 disabled:opacity-50"
                    style={{
                      background: (inputValue.trim() || uploadedFile)
                        ? `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
                        : '#e5e7eb'
                    }}
                  >
                    <Send size={18} className={
                      (inputValue.trim() || uploadedFile) ? 'text-white' : 'text-gray-400'
                    } />
                  </button>
                </div>
                
                {/* Footer Actions */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuickAction({ text: 'I want to speak with a human', value: 'human' })}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Request human assistance"
                      disabled={isHumanTakeover}
                    >
                      <Phone size={18} />
                    </button>
                    
                    <button
                      onClick={() => handleQuickAction({ text: 'Email me instead', value: 'email' })}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Switch to email"
                    >
                      <Mail size={18} />
                    </button>
                  </div>
                  
                  <span className="text-xs text-gray-400">
                    Powered by Larry AI
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBotWidget;