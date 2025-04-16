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
    id: 'process',
    name: 'Process Documentation',
    description: 'Create detailed process documentation with steps, roles, and responsibilities',
    icon: <FileType className="h-6 w-6" />,
    initialQuestions: [
      'What is the main objective of this process?',
      'Who are the key stakeholders involved?',
      'What are the main steps in this process?'
    ]
  },
  {
    id: 'project-plan',
    name: 'Project Plan with Deliverables',
    description: 'Generate a comprehensive project plan with timelines and deliverables',
    icon: <FileType className="h-6 w-6" />,
    initialQuestions: [
      'What are the project objectives?',
      'What is the expected timeline?',
      'What are the key deliverables?'
    ]
  },
  {
    id: 'flow-chart',
    name: 'Process Flow Chart Documentation',
    description: 'Create documentation for process flow charts with detailed explanations',
    icon: <FileType className="h-6 w-6" />,
    initialQuestions: [
      'What process needs to be mapped?',
      'What are the main decision points?',
      'What are the expected outcomes?'
    ]
  },
  {
    id: 'action-plan',
    name: 'Action Plan',
    description: 'Generate a detailed action plan with tasks, owners, and timelines',
    icon: <FileType className="h-6 w-6" />,
    initialQuestions: [
      'What is the main goal of this action plan?',
      'What is the target completion date?',
      'Who are the key stakeholders?'
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

    setMessages(prev => [...prev, newMessage]);
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
      
      const requestBody = {
        contents: [{
          parts: [{
            text: `You are an expert document creation assistant. Based on the document type "${selectedDocType?.name}" and the previous context, generate a follow-up question or suggest next steps. Be concise but thorough. Current question: "${currentQuestion}", User's answer: "${userInput}"`
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
      
      const requestBody = {
        contents: [{
          parts: [{
            text: `You are an expert document creator. Based on the following conversation, generate a professional ${selectedDocType?.name} document in a clear, structured format. Include all necessary sections, details, and formatting:\n\n${conversationContext}`
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
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'system',
          content: 'Document successfully generated! You can now download it.'
        }
      ]);

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
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">AI Document Generator</h1>
          <p className="text-muted-foreground">Create professional documents with AI assistance</p>
        </div>
        {generatedContent && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetGenerator}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Start New
            </Button>
            <Button onClick={downloadDocument}>
              <Download className="mr-2 h-4 w-4" />
              Download DOCX
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {!isTypeSelected ? (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Select Document Type</CardTitle>
              <CardDescription>Choose the type of document you want to create</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {documentTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "default" : "outline"}
                    className={cn(
                      "h-auto flex flex-col items-start space-y-2 p-4",
                      selectedType === type.id && "border-2 border-primary"
                    )}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div className="flex items-center gap-2">
                      {type.icon}
                      <span className="font-semibold">{type.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground text-left">
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
              <CardHeader>
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>Chat with AI to create your document</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 pr-4 mb-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3 p-4 rounded-lg",
                          message.type === 'user' ? "bg-muted ml-4" : "bg-primary/5 mr-4"
                        )}
                      >
                        {message.type === 'ai' && <Bot className="h-6 w-6 text-primary" />}
                        {message.type === 'user' && <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">U</div>}
                        <div className="flex-1">
                          {message.thinking ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-muted-foreground">Thinking...</span>
                            </div>
                          ) : (
                            <p className="text-sm">{message.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <div className="flex gap-2">
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
              <CardHeader>
                <CardTitle>Document Preview</CardTitle>
                <CardDescription>Real-time preview of your document</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ScrollArea className="h-full">
                  {generatedContent ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap font-mono text-sm">
                        {generatedContent}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-4">
                      <FileOutput className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">
                          Complete the conversation with the AI assistant to generate your document
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