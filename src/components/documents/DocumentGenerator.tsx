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
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

// Custom CSS for handling text overflow
const customStyles = {
  wordBreak: 'break-word' as const,
  overflowWrap: 'break-word' as const,
  maxWidth: '100%'
};

// Markdown styles for document preview
const markdownStyles = {
  h1: "text-2xl font-bold mt-6 mb-4 pb-1 border-b",
  h2: "text-xl font-bold mt-5 mb-3",
  h3: "text-lg font-bold mt-4 mb-2",
  h4: "text-base font-semibold mt-3 mb-2",
  h5: "text-sm font-semibold mt-2 mb-1",
  h6: "text-sm font-medium mt-2 mb-1",
  p: "my-3",
  ul: "list-disc pl-6 my-3",
  ol: "list-decimal pl-6 my-3",
  li: "my-1",
  blockquote: "border-l-4 border-gray-200 dark:border-gray-700 pl-4 py-2 my-3 text-gray-600 dark:text-gray-300 italic",
  table: "min-w-full divide-y divide-gray-200 dark:divide-gray-700 my-4 border border-gray-200 dark:border-gray-700",
  th: "px-3 py-2 text-left text-xs font-medium uppercase tracking-wider bg-gray-100 dark:bg-gray-800",
  td: "px-3 py-2 whitespace-normal text-sm",
  tr: "even:bg-gray-50 dark:even:bg-gray-900",
  pre: "bg-gray-100 dark:bg-gray-800 p-3 rounded my-3 overflow-auto",
  code: "bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm",
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
      'What specific security process do you need documented? Type the EXACT name of the process (e.g., "Identity and Access Management", "Vulnerability Management", etc.)',
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
        // Extract process name from the conversation if this is the first question
        let processName = userInput;
        if (currentQuestion.includes("What specific security process")) {
          processName = userInput.trim();
          // Store the process name in a variable for future use
          sessionStorage.setItem('documentProcessName', processName);
        } else {
          // Retrieve the process name if it was stored previously
          const storedProcessName = sessionStorage.getItem('documentProcessName');
          if (storedProcessName) {
            processName = storedProcessName;
          }
        }

        promptText = `You are an expert in IT security and information security documentation.

PROCESS NAME: "${processName}"

You are creating documentation SPECIFICALLY for the "${processName}" process, and ONLY this process.

Previous question: "${currentQuestion}"
User's answer: "${userInput}"

CRITICAL INSTRUCTIONS:
1. You are documenting the "${processName}" process ONLY
2. Do NOT switch to any other process type
3. Do NOT create documentation for "Incident Response" or any other process unless the user EXPLICITLY requested "${processName}" as "Incident Response"
4. Stay focused ONLY on "${processName}" throughout the entire conversation

Based on this answer, ask only ONE follow-up question that would provide crucial information needed for documenting the "${processName}" process. If you have enough information already, provide a short summary of what you'll include in the "${processName}" process document and ask if there's anything specific they want to add.

Be concise, professional, and focused.`;
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
10. Format your response using Markdown syntax:
   - Use # for main headings, ## for subheadings, etc.
   - Use **bold** for emphasis
   - Use - or * for bullet points
   - Use tables where appropriate with |---|---| syntax
   - Format code or commands with \`backticks\`
   - Use horizontal rules (---) to separate major sections

CRITICAL: Output ONLY the final document content. Do NOT include any hypothetical user responses, explanations of what you're doing, or anything outside the actual document content. Start directly with the document title as a # level 1 heading.

Create the complete document now, formatted for immediate use by the organization.`;

      // Add specific instructions for process documentation
      if (selectedDocType?.id === 'process') {
        // Extract process name from the conversation
        let processName = "specified security process";
        
        // First check if we have it in session storage
        const storedProcessName = sessionStorage.getItem('documentProcessName');
        if (storedProcessName) {
          processName = storedProcessName;
        } else {
          // Try to extract from first user message that answers the first question
          const firstQuestion = documentTypes.find(t => t.id === 'process')?.initialQuestions[0] || '';
          const firstAnswer = messages.find(m => 
            m.type === 'user' && 
            messages[messages.indexOf(m) - 1]?.content?.includes(firstQuestion)
          );
          
          if (firstAnswer) {
            processName = firstAnswer.content.trim();
            sessionStorage.setItem('documentProcessName', processName);
          }
        }

        promptText = `You are an expert in IT security and information security documentation.

PROCESS NAME: "${processName}"

You must create a professional Security Process Documentation SPECIFICALLY for the "${processName}" process based on the conversation below.

CONVERSATION:
${conversationContext}

CRITICAL INSTRUCTIONS:
1. You are documenting the "${processName}" process ONLY
2. The document title MUST be "${processName} Process"
3. Every section MUST relate specifically to "${processName}"
4. Do NOT create documentation for "Incident Response" or any other process unless "${processName}" is literally "Incident Response"
5. If the process is "IAM" or "Identity and Access Management", focus ONLY on identity and access management procedures
6. Stay focused ONLY on "${processName}" throughout the entire document

DOCUMENT STRUCTURE:
1. Document title: "${processName} Process"
2. Document metadata (version 1.0, date, owner, etc.)
3. Executive summary of the "${processName}" process
4. Scope and objectives specific to "${processName}"
5. "${processName}" process owner and stakeholders
6. Detailed "${processName}" process steps
7. Roles and responsibilities within the "${processName}" process
8. Inputs and outputs of the "${processName}" process
9. "${processName}" metrics and measurements
10. Related "${processName}" policies and references
11. Appendices as needed for "${processName}"

FORMAT GUIDELINES:
1. Use clear, professional, and simple language
2. For any missing information, use placeholder text marked as "TBA-[TOPIC]" rather than omitting sections
3. Be thorough but concise - include all necessary information without unnecessary length
4. Include flow diagrams instructions where appropriate

CRITICAL: Output ONLY the final document content. Start directly with the document title and metadata. Do NOT switch to a different process type.

Create the complete "${processName}" process document now, formatted for immediate use by the organization.`;
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

  // New enhanced downloadDocument function using docx library
  const downloadDocument = () => {
    if (!generatedContent || !selectedDocType) return;
    
    // Convert markdown to docx using docx library
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: convertMarkdownToDocx(generatedContent)
        },
      ],
    });

    // Create and save the file
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${selectedDocType.name.toLowerCase().replace(/\s+/g, '-')}.docx`);
    });
  };

  // Helper function to convert markdown to docx elements
  const convertMarkdownToDocx = (markdown: string): any[] => {
    const lines = markdown.split('\n');
    const docxElements: any[] = [];
    let inList = false;
    let listItems: Paragraph[] = [];
    let inCodeBlock = false;
    let codeContent = '';

    lines.forEach(line => {
      // Heading handling
      if (line.startsWith('# ')) {
        docxElements.push(new Paragraph({
          text: line.substring(2),
          heading: HeadingLevel.HEADING_1,
          thematicBreak: true
        }));
      } else if (line.startsWith('## ')) {
        docxElements.push(new Paragraph({
          text: line.substring(3),
          heading: HeadingLevel.HEADING_2
        }));
      } else if (line.startsWith('### ')) {
        docxElements.push(new Paragraph({
          text: line.substring(4),
          heading: HeadingLevel.HEADING_3
        }));
      } else if (line.startsWith('#### ')) {
        docxElements.push(new Paragraph({
          text: line.substring(5),
          heading: HeadingLevel.HEADING_4
        }));
      } 
      // List handling
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        listItems.push(new Paragraph({
          text: line.substring(2),
          bullet: { level: 0 }
        }));
      } 
      // Handle code blocks
      else if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeContent = '';
        } else {
          inCodeBlock = false;
          docxElements.push(new Paragraph({
            text: codeContent,
            style: "Code",
            shading: {
              type: "solid",
              color: "F2F2F2",
            },
          }));
        }
      }
      // If we're in a code block, collect content
      else if (inCodeBlock) {
        codeContent += line + '\n';
      }
      // Normal paragraph
      else if (line.trim() !== '') {
        // Process bold text within paragraphs
        let text = line;
        let segments = [];
        let lastIndex = 0;
        
        // Simple regex to find **bold** text
        const boldRegex = /\*\*(.*?)\*\*/g;
        let match;
        
        while ((match = boldRegex.exec(text)) !== null) {
          // Add text before the bold
          if (match.index > lastIndex) {
            segments.push(new TextRun(text.substring(lastIndex, match.index)));
          }
          
          // Add the bold text
          segments.push(new TextRun({
            text: match[1],
            bold: true,
          }));
          
          lastIndex = match.index + match[0].length;
        }
        
        // Add remaining text
        if (lastIndex < text.length) {
          segments.push(new TextRun(text.substring(lastIndex)));
        }
        
        // If we parsed any bold segments, use them, otherwise use the whole line
        if (segments.length > 0) {
          docxElements.push(new Paragraph({ children: segments }));
        } else {
          docxElements.push(new Paragraph({ text: line }));
        }
      } 
      // Empty line
      else {
        docxElements.push(new Paragraph({}));
      }
      
      // If we finished a list, add all items
      if (inList && (line.trim() === '' || !(line.startsWith('- ') || line.startsWith('* ')))) {
        docxElements.push(...listItems);
        inList = false;
      }
    });
    
    return docxElements;
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
                    <div className="prose prose-sm dark:prose-invert max-w-none p-4 pb-12">
                      <ReactMarkdown 
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        components={{
                          h1: ({node, ...props}) => <h1 className={markdownStyles.h1} {...props} />,
                          h2: ({node, ...props}) => <h2 className={markdownStyles.h2} {...props} />,
                          h3: ({node, ...props}) => <h3 className={markdownStyles.h3} {...props} />,
                          h4: ({node, ...props}) => <h4 className={markdownStyles.h4} {...props} />,
                          h5: ({node, ...props}) => <h5 className={markdownStyles.h5} {...props} />,
                          h6: ({node, ...props}) => <h6 className={markdownStyles.h6} {...props} />,
                          p: ({node, ...props}) => <p className={markdownStyles.p} {...props} />,
                          ul: ({node, ...props}) => <ul className={markdownStyles.ul} {...props} />,
                          ol: ({node, ...props}) => <ol className={markdownStyles.ol} {...props} />,
                          li: ({node, ...props}) => <li className={markdownStyles.li} {...props} />,
                          blockquote: ({node, ...props}) => <blockquote className={markdownStyles.blockquote} {...props} />,
                          table: ({node, ...props}) => <table className={markdownStyles.table} {...props} />,
                          th: ({node, ...props}) => <th className={markdownStyles.th} {...props} />,
                          td: ({node, ...props}) => <td className={markdownStyles.td} {...props} />,
                          tr: ({node, ...props}) => <tr className={markdownStyles.tr} {...props} />,
                          pre: ({node, ...props}) => <pre className={markdownStyles.pre} {...props} />,
                          code: ({node, ...props}) => <code className={markdownStyles.code} {...props} />,
                        }}
                      >
                        {generatedContent}
                      </ReactMarkdown>
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