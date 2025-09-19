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

      // Create or update visitor profile
      const { data: existingProfile } = await supabaseClient
        .from('visitor_profiles')
        .select('*')
        .eq('visitor_id', vid)
        .single();

      let visitorProfile;
      
      if (existingProfile) {
        // Update existing profile
        const { data: updatedProfile } = await supabaseClient
          .from('visitor_profiles')
          .update({
            last_seen: new Date().toISOString(),
            total_visits: (existingProfile.total_visits || 0) + 1,
            pages_visited: [...(existingProfile.pages_visited || []), window.location.pathname]
          })
          .eq('visitor_id', vid)
          .select()
          .single();
        
        visitorProfile = updatedProfile;
      } else {
        // Create new visitor profile
        const { data: newProfile } = await supabaseClient
          .from('visitor_profiles')
          .insert({
            visitor_id: vid,
            first_seen: new Date().toISOString(),
            last_seen: new Date().toISOString(),
            total_visits: 1,
            pages_visited: [window.location.pathname]
          })
          .select()
          .single();
        
        visitorProfile = newProfile;
      }

      if (visitorProfile) {
        setVisitorProfileId(visitorProfile.id);
      }

      // Create new conversation
      const { data: conversation, error: convError } = await supabaseClient
        .from('conversations')
        .insert({
          visitor_id: vid,
          visitor_profile_id: visitorProfile?.id,
          started_at: new Date().toISOString(),
          channel: 'website',
          status: 'active',
          page_url: window.location.href,
          referrer_url: document.referrer || null,
          user_agent: navigator.userAgent
        })
        .select()
        .single();

      if (convError) {
        console.error('Error creating conversation:', convError);
        setConnectionError(true);
      } else if (conversation) {
        setConversationId(conversation.id);
        
        // Create conversation context
        await supabaseClient
          .from('conversation_context')
          .insert({
            conversation_id: conversation.id,
            conversation_stage: 'greeting',
            current_topic: 'initial_contact'
          });

        // Add welcome message
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
        await supabaseClient
          .from('chatbot_analytics')
          .insert({
            conversation_id: conversation.id,
            event_type: 'chat_opened',
            event_data: { page: window.location.pathname }
          });

        // Dispatch custom event for analytics
        window.dispatchEvent(new CustomEvent('chatbot:opened', { 
          detail: { conversationId: conversation.id, visitorId: vid } 
        }));
      }
    } catch (error) {
      console.error('Chat initialization error:', error);
      setConnectionError(true);
    } finally {
      setIsInitializing(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !uploadedFile) return;
    if (!conversationId) {
      setConnectionError(true);
      return;
    }

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: uploadedFile ? 'file' : 'text',
      file: uploadedFile
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setUploadedFile(null);
    setIsTyping(true);
    setQuickActions([]);

    try {
      // Store user message in database
      await supabaseClient
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender: 'user',
          content: inputValue,
          message_type: uploadedFile ? 'file' : 'text',
          file_attachment: uploadedFile,
          timestamp: new Date().toISOString()
        });

      // Call backend API for bot response
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          conversationId,
          visitorId,
          visitorProfileId,
          file: uploadedFile
        })
      });

      if (!response.ok) {
        throw new Error('API response not ok');
      }

      const data = await response.json();
      
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
      
      // Store bot message in database
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
      
      // Update lead score
      if (data.leadScore) {
        setLeadScore(data.leadScore);
        
        // Update conversation with lead score
        await supabaseClient
          .from('conversations')
          .update({ lead_score: data.leadScore })
          .eq('id', conversationId);
      }
      
      // Check for human takeover
      if (data.escalated) {
        setIsHumanTakeover(true);
        handleHumanTakeover();
        
        // Create escalation record
        await supabaseClient
          .from('escalations')
          .insert({
            conversation_id: conversationId,
            escalation_reason: data.escalationReason || 'High value lead',
            lead_score: data.leadScore,
            status: 'pending'
          });
      }
      
      // Set new quick actions if provided
      if (data.quickActions && data.quickActions.length > 0) {
        setQuickActions(data.quickActions);
      }

      // Track message event
      await supabaseClient
        .from('chatbot_analytics')
        .insert({
          conversation_id: conversationId,
          event_type: 'message_sent',
          event_data: { 
            intent: data.intent,
            confidence: data.confidence
          },
          intent: data.intent,
          confidence: data.confidence,
          lead_score: data.leadScore
        });

      // Dispatch custom event for analytics
      window.dispatchEvent(new CustomEvent('chatbot:message', { 
        detail: { intent: data.intent, conversationId } 
      }));
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      // Log error to database
      await supabaseClient
        .from('chatbot_errors')
        .insert({
          conversation_id: conversationId,
          error_type: 'message_send_error',
          error_message: error.message,
          user_message: inputValue
        });
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now. Would you like me to have someone from our team reach out to you directly?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'error'
      }]);
      
      setQuickActions([
        { icon: '📞', text: 'Yes, call me', value: 'request_call' },
        { icon: '📧', text: 'Email me instead', value: 'request_email' },
        { icon: '🔄', text: 'Try again', value: 'retry' }
      ]);
    }
  };

  const handleQuickAction = async (action) => {
    if (action.value === 'retry') {
      await initializeChat();
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
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
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
    if (connectionError || !conversationId) {
      initializeChat(); // Retry initialization if there was an error
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
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={handleOpenChat}
          className={`fixed ${position === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6'} 
                     group w-16 h-16 rounded-full shadow-lg flex items-center justify-center 
                     transform transition-all duration-300 hover:scale-110 z-50
                     animate-pulse-slow relative`}
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
          }}
        >
          <MessageCircle size={28} className="text-white" />
          {/* Larry notification badge */}
          <span className="absolute -top-2 -right-2 px-2 py-1 bg-white text-xs font-bold rounded-full shadow-lg"
                style={{ color: primaryColor }}>
            Larry
          </span>
          {leadScore > 50 && (
            <span className="absolute -top-1 -left-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed ${position === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6'} 
                        ${isMinimized ? 'h-[60px]' : 'h-[600px]'} w-[380px] bg-white rounded-2xl 
                        shadow-2xl flex flex-col overflow-hidden transition-all duration-300 z-50`}>
          
          {/* Header */}
          <div className={`flex items-center justify-between ${isMinimized ? 'p-3' : 'p-4'} border-b`}
               style={{
                 background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
               }}>
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
                    {isHumanTakeover ? '🟢 Expert Connected' : '🤖 AI Assistant | Rule27'}
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
              {/* Connection Error Banner */}
              {connectionError && (
                <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle size={14} className="text-yellow-600" />
                      <span className="text-xs text-yellow-700">Connection issue</span>
                    </div>
                    <button
                      onClick={initializeChat}
                      className="text-xs text-yellow-600 hover:text-yellow-700 flex items-center space-x-1"
                    >
                      <RefreshCw size={12} />
                      <span>Retry</span>
                    </button>
                  </div>
                </div>
              )}

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
                        disabled={isTyping || connectionError}
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
                    disabled={connectionError}
                  >
                    <Paperclip size={18} />
                  </button>
                  
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder={
                      connectionError ? "Connection issue..." : 
                      isHumanTakeover ? "Chat with our expert..." : 
                      "Type your message..."
                    }
                    disabled={connectionError || isInitializing}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm
                             focus:outline-none focus:border-red-300 transition-colors
                             disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={(!inputValue.trim() && !uploadedFile) || connectionError || isInitializing}
                    className="p-2 rounded-full transition-all duration-200 disabled:opacity-50"
                    style={{
                      background: (inputValue.trim() || uploadedFile) && !connectionError
                        ? `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
                        : '#e5e7eb'
                    }}
                  >
                    <Send size={18} className={
                      (inputValue.trim() || uploadedFile) && !connectionError ? 'text-white' : 'text-gray-400'
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
                      disabled={connectionError || isHumanTakeover}
                    >
                      <Phone size={18} />
                    </button>
                    
                    <button
                      onClick={() => handleQuickAction({ text: 'Email me instead', value: 'email' })}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Switch to email"
                      disabled={connectionError}
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

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default ChatBotWidget;