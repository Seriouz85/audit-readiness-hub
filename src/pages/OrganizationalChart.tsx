import React, { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactFlow, Controls, Background, MiniMap, Node, Edge, Position, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import mock data and types (adjust path if necessary, ideally use shared state/API later)
// import { mockOrganizations, Organization } from './Organizations'; // Assuming Organizations.tsx exports these

// --- Helper to create nodes and edges ---

// Simple layout logic (adjust as needed for better visualization)
/*
const getLayoutedElements = (orgs: Organization[]) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let yPos = 0;
  const xPosIncrement = 250;
  const yPosIncrement = 150;

  const orgMap = new Map(orgs.map(org => [org.id, org]));
  const childrenMap = new Map<string, string[]>();

  orgs.forEach(org => {
    if (org.parentId && orgMap.has(org.parentId)) {
      const children = childrenMap.get(org.parentId) || [];
      children.push(org.id);
      childrenMap.set(org.parentId, children);
    }
  });

  // Function to recursively position nodes
  const positionNode = (orgId: string, x: number, level: number): number => {
    const org = orgMap.get(orgId);
    if (!org) return x;

    const nodeExists = nodes.some(n => n.id === orgId);
    if (!nodeExists) {
        nodes.push({
            id: orgId,
            data: { label: `${org.name} (${org.type})` },
            position: { x: x, y: level * yPosIncrement },
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
            style: { 
                background: 'hsl(var(--card))', 
                color: 'hsl(var(--card-foreground))', 
                border: '1px solid hsl(var(--border))', 
                padding: '10px', 
                borderRadius: '4px', 
                width: 180, 
                textAlign: 'center' 
            },
        });
    }
    
    let currentX = x;
    const children = childrenMap.get(orgId) || [];
    children.forEach((childId, index) => {
      if (orgMap.has(childId)) {
        edges.push({ 
            id: `e-${orgId}-${childId}`,
            source: orgId,
            target: childId,
            type: 'smoothstep',
            animated: false, // Set to true for animated edges
            style: { stroke: 'hsl(var(--primary))' }
        });
        // Position children horizontally, shifting right
        currentX = positionNode(childId, currentX, level + 1);
        if (index < children.length - 1) {
            currentX += xPosIncrement; // Add space between sibling nodes
        }
      }
    });
    return currentX;
  };

  // Start positioning from parent nodes
  let currentX = 0;
  orgs.filter(org => !org.parentId || !orgMap.has(org.parentId)).forEach((rootOrg, index) => {
     currentX = positionNode(rootOrg.id, currentX, 0);
     if (index < orgs.filter(org => !org.parentId || !orgMap.has(org.parentId)).length - 1) {
         currentX += xPosIncrement * 1.5; // Add more space between separate trees
     }
  });

  return { nodes, edges };
};
*/

// --- Temporary Simple Nodes/Edges ---
const initialNodes: Node[] = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 100, y: 100 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 300, y: 200 } },
];

const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

// --- Component ---
const OrganizationalChart: React.FC = () => {

  // const { nodes, edges } = useMemo(() => getLayoutedElements(mockOrganizations), [mockOrganizations]);
  const nodes = initialNodes;
  const edges = initialEdges;

  return (
    <ReactFlowProvider>
      <div className="container mx-auto p-4 flex flex-col h-[calc(100vh-10rem)]"> {/* Adjust height as needed */}
        <h1 className="text-2xl font-bold mb-4">Organizational Chart (Simplified Test)</h1>

        <Tabs defaultValue="generated" className="w-full flex flex-col flex-grow">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="generated">Generate from Registered Organizations</TabsTrigger>
            <TabsTrigger value="manual">Manual Chart</TabsTrigger>
          </TabsList>
          <TabsContent value="generated" className="flex-grow border rounded-lg bg-card overflow-hidden"> {/* Ensure content fills space */}
             {/* React Flow Chart */}
              <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                className="bg-background" // Use theme background
              >
                <Background />
                <Controls />
                <MiniMap nodeStrokeWidth={3} zoomable pannable />
              </ReactFlow>
          </TabsContent>
          <TabsContent value="manual">
            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm min-h-[300px]">
              <p>Manual chart creation tool/placeholder will go here.</p>
              {/* Manual chart tool or message will go here */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ReactFlowProvider>
  );
};

export default OrganizationalChart; 