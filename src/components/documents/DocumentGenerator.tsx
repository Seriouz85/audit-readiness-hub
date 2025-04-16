import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileOutput, 
  Download, 
  Loader2, 
  Send, 
  Bot, 
  RefreshCw,
  FileType,
  CheckCircle2
} from 'lucide-react';
import { cn } from "@/lib/utils";

// Custom CSS for handling text overflow
const customStyles = {
  wordBreak: 'break-word' as const,
  overflowWrap: 'break-word' as const,
  maxWidth: '100%'
};

type DocumentType = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  initialQuestions: string[];
};

type Message = {
  id: string;
  type: 'ai' | 'user' | 'system';
  content: string;
  thinking?: boolean;
};

type DocumentGeneratorProps = {
  apiKey: string;
};

const documentTypes: DocumentType[] = [
  {
    id: 'security-policy',
    name: 'Information Security Policy',
    description: 'Create a comprehensive security policy document that outlines organization-wide security practices',
    icon: <FileType className="h-6 w-6" />,
    initialQuestions: [
      'What is your organization type (e.g., healthcare, finance, tech startup)?',
      'What are your primary security concerns (e.g., data breaches, compliance, insider threats)?',
      'Do you have any specific compliance requirements (e.g., GDPR, HIPAA, ISO 27001)?'
    ]
  },
  {
    id: 'incident-response',
    name: 'Incident Response Plan',
    description: 'Generate a structured plan for responding to security incidents and breaches',
    icon: <FileType className="h-6 w-6" />,
    initialQuestions: [
      'What types of security incidents are most concerning for your organization?',
      'Who are the key stakeholders that should be involved in incident response?',
      'Do you have any existing incident classification system?'
    ]
  },
  {
    id: 'risk-assessment',
    name: 'Security Risk Assessment',
    description: 'Create a template for assessing and documenting security risks across your organization',
    icon: <FileType className="h-6 w-6" />,
    initialQuestions: [
      'What assets are most critical to protect in your organization?',
      'What threat actors are most concerning for your industry?',
      'Do you have any existing risk management framework?'
    ]
  },
  {
    id: 'system-security-plan',
    name: 'System Security Plan',
    description: 'Document the security controls and configurations for a specific system or application',
    icon: <FileType className="h-6 w-6" />,
    initialQuestions: [
      'What type of system are you documenting (e.g., cloud service, internal application, network)?',
      'What data classification levels will this system handle?',
      'What are the primary security controls already in place?'
    ]
  },
  {
    id: 'process',
    name: 'Security Process Documentation',
    description: 'Create detailed documentation for security processes with steps, roles, and responsibilities',
    icon: <FileType className="h-6 w-6" />,
    initialQuestions: [
      'What specific security process do you need documented (be as specific as possible)?',
      'Who are the key stakeholders involved in this specific process?',
      'What is the main objective of this security process?'
    ]
  },
  {
    id: 'action-plan',
    name: 'Security Action Plan',
    description: 'Generate a detailed security action plan with tasks, owners, and timelines',
    icon: <FileType className="h-6 w-6" />,
    initialQuestions: [
      'What security issue or initiative does this action plan address?',
      'What is the target completion timeframe?',
      'Who are the key stakeholders responsible for implementation?'
    ]
  }
];

const DocumentGenerator = ({ apiKey }: DocumentGeneratorProps) => {
  const [selectedType, setSelectedType] = React.useState<string>('');
  const [isTypeSelected, setIsTypeSelected] = React.useState(false);
  const [currentQuestion, setCurrentQuestion] = React.useState<string>('');
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [userInput, setUserInput] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState('');
  const [documentVersion, setDocumentVersion] = React.useState(0);
  const [autoGenerateEnabled, setAutoGenerateEnabled] = React.useState(true);
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const selectedDocType = documentTypes.find(t => t.id === selectedType);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTypeSelection = () => {
    if (!selectedType) return;
    
    setIsTypeSelected(true);
    setMessages([
      {
        id: '1',
        type: 'system',
        content: `Starting ${selectedDocType?.name} generation process...`
      },
      {
        id: '2',
        type: 'ai',
        content: "Hello! I'll help you create your document. Let's start with the first question:"
      },
      {
        id: '3',
        type: 'ai',
        content: selectedDocType?.initialQuestions[0] || ''
      }
    ]);
    setCurrentQuestion(selectedDocType?.initialQuestions[0] || '');
  };

  const testApiConnection = async () => {
    try {
      console.log('Testing API connection...');
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      const testBody = {
        contents: [{
          parts: [{
            text: "Hello, this is a test message. Please respond with 'OK' if you receive this."
          }]
        }]
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testBody)
      });

      console.log('Test response status:', response.status);
      const responseText = await response.text();
      console.log('Test response:', responseText);

      if (!response.ok) {
        try {
          const errorJson = JSON.parse(responseText);
          console.error('API Error:', errorJson);
          throw new Error(errorJson.error?.message || 'API request failed');
        } catch (e) {
          throw new Error(`API request failed with status ${response.status}: ${responseText}`);
        }
      }

      return true;
    } catch (error) {
      console.error('API test failed:', error);
      return false;
    }
  };

  // Add API test on component mount
  React.useEffect(() => {
    testApiConnection().then(isConnected => {
      if (!isConnected) {
        setMessages([{
          id: '1',
          type: 'system',
          content: 'Warning: Unable to connect to AI service. Please check your API key and internet connection.'
        }]);
      }
    });
  }, [apiKey]);

  // New function to determine if we should auto-generate the document
  const shouldAutoGenerateDocument = (messageHistory: Message[]) => {
    // Get only user messages
    const userMessages = messageHistory.filter(m => m.type === 'user');
    
    // Auto-generate after first user response if enabled
    return autoGenerateEnabled && userMessages.length > 0;
  };

  // Modified handleUserInput to trigger document generation
  const handleUserInput = async () => {
    if (!userInput.trim()) return;

    // Test API connection before proceeding
    const isConnected = await testApiConnection();
    if (!isConnected) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'system',
        content: 'Error: Unable to connect to AI service. Please check your API key and internet connection.'
      }]);
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userInput
    };

    // Update messages with user input
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setUserInput('');

    // Simulate AI thinking
    const thinkingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: '',
      thinking: true
    };

    setMessages(prev => [...prev, thinkingMessage]);

    try {
      console.log('Making API request to Gemini...');
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      console.log('Request URL:', apiUrl.replace(apiKey, '[REDACTED]'));
      
      let promptText = `You are an expert in IT security and information security documentation. 
            
You are helping create a "${selectedDocType?.name}" document.

Previous question: "${currentQuestion}"
User's answer: "${userInput}"

Based on this answer and the document type, ask only ONE follow-up question that would provide the most crucial information needed for the document. If you have enough information already, instead provide a short summary of what you'll include in the document and ask if there's anything specific they want to add.

Be concise, professional, and focused. Remember that the goal is to create a high-quality security document with minimal back-and-forth.`;

      // Add specific instructions for process documentation
      if (selectedDocType?.id === 'process') {
        promptText = `You are an expert in IT security and information security documentation. 
            
You are helping create a Security Process Documentation specifically for the process the user has mentioned.

Previous question: "${currentQuestion}"
User's answer: "${userInput}"

IMPORTANT: Focus ONLY on the specific security process mentioned by the user. Do not substitute with a different process or create a generic document. The document should be tailored exactly to the process the user has specified.

Based on this answer, ask only ONE follow-up question that would provide the most crucial information needed for documenting this specific process. If you have enough information already, instead provide a short summary of what you'll include in the process document and ask if there's anything specific they want to add.

Be concise, professional, and focused. Remember that the goal is to create a high-quality security process document with minimal back-and-forth.`;
      }
      
      const requestBody = {
        contents: [{
          parts: [{
            text: promptText
          }]
        }]
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
        },
        mode: 'cors',
        body: JSON.stringify(requestBody)
      });

      console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.error?.message || 'API request failed');
        } catch (e) {
          throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('API Response:', data);

      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                         data.candidates?.[0]?.content?.text ||
                         data.text;
      
      if (!aiResponse) {
        throw new Error('No valid response from AI');
      }

      // Remove thinking message and add AI response
      setMessages(prev => [
        ...prev.filter(m => !m.thinking),
        {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          content: aiResponse
        }
      ]);

      setCurrentQuestion(aiResponse);

      // Determine if we should auto-generate the document
      if (shouldAutoGenerateDocument(updatedMessages)) {
        // Add small delay to ensure AI response is processed first
        setTimeout(() => {
          if (!isGenerating) {
            generateFinalDocument();
          }
        }, 500);
      }
    } catch (error) {
      console.error('Detailed error:', error);
      let errorMessage = 'An unexpected error occurred';
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        errorMessage = 'Network error: Please check your internet connection and ensure the API key is correct';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setMessages(prev => [
        ...prev.filter(m => !m.thinking),
        {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          content: `Error: ${errorMessage}. Please try again.`
        }
      ]);
    }
  };

  // Modified document generator function to update version number
  const generateFinalDocument = async () => {
    setIsGenerating(true);
    try {
      const conversationContext = messages
        .filter(m => !m.thinking)
        .map(m => `${m.type === 'user' ? 'User' : 'AI'}: ${m.content}`)
        .join('\n');

      console.log('Generating final document...');
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      console.log('Request URL:', apiUrl.replace(apiKey, '[REDACTED]'));
      
      let promptText = `You are an expert in IT security and information security documentation. Create a professional "${selectedDocType?.name}" based on the conversation below.

CONVERSATION:
${conversationContext}

IMPORTANT GUIDELINES:
1. Format as a professional document with version 1.0, clear headers, and logical document flow
2. Use clear, professional, and simple language
3. Include all standard sections expected in this type of security document, even if not explicitly discussed
4. For any missing information, use placeholder text marked as "TBA-[TOPIC]" rather than omitting sections
5. Be thorough but concise - include all necessary information without unnecessary length
6. Focus on creating a strong template that meets industry best practices for IT/information security
7. Include an executive summary at the beginning
8. Include document metadata (version, date, owner, etc.) at the top
9. End with appendices as appropriate for this document type

Create the complete document now, formatted for immediate use by the organization.`;

      // Add specific instructions for process documentation
      if (selectedDocType?.id === 'process') {
        promptText = `You are an expert in IT security and information security documentation. Create a professional Security Process Documentation based on the conversation below.

CONVERSATION:
${conversationContext}

IMPORTANT GUIDELINES:
1. Format as a professional document with version 1.0, clear headers, and logical document flow
2. Use clear, professional, and simple language
3. Focus EXCLUSIVELY on documenting the SPECIFIC security process mentioned by the user - do not create a generic process or substitute a different one
4. Structure the document as a proper process document with: Overview, Scope, Process Owner, Process Steps, Inputs/Outputs, Roles & Responsibilities, etc.
5. Include all standard sections expected in a security process document, even if not explicitly discussed
6. For any missing information, use placeholder text marked as "TBA-[TOPIC]" rather than omitting sections
7. Be thorough but concise - include all necessary information without unnecessary length
8. Include an executive summary at the beginning
9. Include document metadata (version, date, owner, etc.) at the top
10. Include flow diagrams instructions where appropriate

Create the complete security process document now, formatted for immediate use by the organization.`;
      }
      
      const requestBody = {
        contents: [{
          parts: [{
            text: promptText
          }]
        }]
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
        },
        mode: 'cors',
        body: JSON.stringify(requestBody)
      });

      console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.error?.message || 'API request failed');
        } catch (e) {
          throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('API Response:', data);

      const documentContent = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                             data.candidates?.[0]?.content?.text ||
                             data.text || 
                             '';
      
      if (!documentContent) {
        throw new Error('No valid document content received from AI');
      }

      setGeneratedContent(documentContent);
      setDocumentVersion(prev => prev + 1);
      
      // Only show the success message if it's a manual generation
      if (!autoGenerateEnabled) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            type: 'system',
            content: 'Document successfully generated! You can now download it.'
          }
        ]);
      }

    } catch (error) {
      console.error('Detailed error:', error);
      let errorMessage = 'An unexpected error occurred';
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        errorMessage = 'Network error: Please check your internet connection and ensure the API key is correct';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setGeneratedContent(`Error: ${errorMessage}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadDocument = () => {
    if (!generatedContent || !selectedDocType) return;
    
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDocType.name.toLowerCase().replace(/\s+/g, '-')}.docx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const resetGenerator = () => {
    setIsTypeSelected(false);
    setSelectedType('');
    setMessages([]);
    setUserInput('');
    setGeneratedContent('');
    setDocumentVersion(0);
    setAutoGenerateEnabled(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">AI Document Generator</h1>
          <p className="text-muted-foreground">Create professional documents with AI assistance</p>
        </div>
        <div className="flex gap-2">
          {autoGenerateEnabled ? (
            <Button 
              variant="outline" 
              onClick={() => setAutoGenerateEnabled(false)}
              className="flex items-center gap-1"
            >
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Auto-Generate ON</span>
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setAutoGenerateEnabled(true)}
              className="flex items-center gap-1"
            >
              <div className="h-4 w-4 border border-muted-foreground rounded-full" />
              <span>Auto-Generate OFF</span>
            </Button>
          )}
          {generatedContent && (
            <>
              <Button variant="outline" onClick={resetGenerator}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Start New
              </Button>
              <Button onClick={downloadDocument}>
                <Download className="mr-2 h-4 w-4" />
                Download DOCX
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {!isTypeSelected ? (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Select Document Type</CardTitle>
              <CardDescription>Choose the type of document you want to create</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                {documentTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "default" : "outline"}
                    className={cn(
                      "h-auto flex flex-col items-start space-y-2 p-3 text-left",
                      selectedType === type.id && "border-2 border-primary"
                    )}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div className="flex items-center gap-2">
                      {type.icon}
                      <span className="font-semibold text-sm">{type.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {type.description}
                    </p>
                  </Button>
                ))}
              </div>
              <Button 
                className="mt-6 w-full" 
                onClick={handleTypeSelection}
                disabled={!selectedType}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Apply Selection
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>Chat with AI to create your document</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1 pr-4 mb-4 h-[calc(100%-60px)]">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3 p-4 rounded-lg",
                          message.type === 'user' ? "bg-muted ml-4" : "bg-primary/5 mr-4"
                        )}
                      >
                        {message.type === 'ai' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                        {message.type === 'user' && <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">U</div>}
                        <div className="flex-1 break-words">
                          {message.thinking ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-muted-foreground">Thinking...</span>
                            </div>
                          ) : (
                            <p className="text-sm whitespace-pre-wrap" style={customStyles}>{message.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <div className="flex gap-2 flex-shrink-0">
                  <Input
                    placeholder="Type your response..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUserInput()}
                  />
                  <Button onClick={handleUserInput}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle>Document Preview</CardTitle>
                <CardDescription>
                  {documentVersion > 0 
                    ? `Real-time preview (version ${documentVersion})` 
                    : "Complete the conversation to generate your document"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  {generatedContent ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none p-2">
                      <div className="whitespace-pre-wrap font-mono text-sm break-words overflow-wrap-anywhere" style={customStyles}>
                        {generatedContent}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-4">
                      <FileOutput className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">
                          {autoGenerateEnabled 
                            ? "Answer the first question to see your document preview" 
                            : "Complete the conversation with the AI assistant to generate your document"}
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={generateFinalDocument}
                          disabled={messages.length < 4 || isGenerating}
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <FileOutput className="mr-2 h-4 w-4" />
                              Generate Document
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentGenerator; 