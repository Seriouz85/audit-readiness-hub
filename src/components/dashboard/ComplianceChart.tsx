import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LabelList } from "recharts";
import { RequirementStatus } from "@/types";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ComplianceChartProps {
  data: {
    fulfilled: number;
    partiallyFulfilled: number;
    notFulfilled: number;
    notApplicable: number;
  };
}

type ChartDataItem = {
  name: string;
  value: number;
  color: string;
  gradientStart?: string;
  gradientEnd?: string;
};

export function ComplianceChart({ data }: ComplianceChartProps) {
  const [animated, setAnimated] = useState(false);
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use requestAnimationFrame for smooth rotation
  useEffect(() => {
    let animationFrame: number;
    let startTime: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Create a subtle floating rotation effect (5 degree range)
      const newRotation = Math.sin(elapsed / 2000) * 5;
      setRotation(newRotation);
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    // Set animation to true after component mount with a slight delay
    const timer = setTimeout(() => setAnimated(true), 300);
    
    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(timer);
    };
  }, []);
  
  useEffect(() => {
    // Add mouse movement effect for enhanced 3D feeling
    if (!containerRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element
      
      // Calculate rotation values based on mouse position
      // The divisor controls sensitivity - higher number = less tilt
      const rotateX = (y - rect.height / 2) / 20;
      const rotateY = (rect.width / 2 - x) / 20;
      
      // Apply the rotation using CSS custom properties
      containerRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
      containerRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);
    };
    
    const handleMouseLeave = () => {
      if (!containerRef.current) return;
      // Reset rotation when mouse leaves
      containerRef.current.style.setProperty('--rotate-x', '0deg');
      containerRef.current.style.setProperty('--rotate-y', '0deg');
    };
    
    const element = containerRef.current;
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const chartData: ChartDataItem[] = [
    {
      name: "Fulfilled",
      value: data.fulfilled,
      color: "#10B981", // modern green
      gradientStart: "#34D399",
      gradientEnd: "#059669"
    },
    {
      name: "Partially Fulfilled",
      value: data.partiallyFulfilled,
      color: "#F59E0B", // modern amber
      gradientStart: "#FBBF24",
      gradientEnd: "#D97706"
    },
    {
      name: "Not Fulfilled",
      value: data.notFulfilled,
      color: "#EF4444", // modern red
      gradientStart: "#F87171",
      gradientEnd: "#DC2626"
    },
    {
      name: "Not Applicable",
      value: data.notApplicable,
      color: "#6B7280", // modern gray
      gradientStart: "#9CA3AF",
      gradientEnd: "#4B5563"
    },
  ].filter((item) => item.value > 0);

  const total = Object.values(data).reduce((acc, curr) => acc + curr, 0);
  const complianceScore = Math.round((data.fulfilled + data.partiallyFulfilled * 0.5) / (total - data.notApplicable) * 100) || 0;

  // Calculate percentage for each status
  const getPercentage = (value: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  // Function to create shadow effect gradients for 3D appearance
  const createGradientId = (index: number) => `gradient-${index}`;
  const createShadowGradientId = (index: number) => `shadow-gradient-${index}`;
  const createHoverGradientId = (index: number) => `hover-gradient-${index}`;
  
  return (
    <Card 
      className="h-full overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950"
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-400 dark:to-teal-400">
            Compliance Status
          </span>
          <motion.div 
            className="text-4xl md:text-5xl font-bold"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.5 
            }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500">
              {complianceScore}%
            </span>
          </motion.div>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative" ref={containerRef}>
        {total > 0 ? (
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div 
              className="w-full md:w-3/4 relative min-h-[400px]"
              style={{
                perspective: "1200px",
                transformStyle: "preserve-3d",
                transform: `rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg)) rotateZ(${rotation}deg)`,
                transition: "transform 0.1s ease-out"
              }}
            >
              {/* Ambient glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-teal-500/5 rounded-full blur-3xl" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-blue-500/10 rounded-full animate-pulse" 
                   style={{ animationDuration: '3s' }} />
              
              {/* Chart container with subtle reflective surface */}
              <div className="relative w-full h-full rounded-full overflow-visible">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    {/* Gradient definitions for 3D effects */}
                    <defs>
                      {/* Main gradients */}
                      {chartData.map((entry, index) => (
                        <linearGradient
                          key={`grad-${index}`}
                          id={createGradientId(index)}
                          x1="0%" y1="0%" x2="100%" y2="100%"
                        >
                          <stop offset="0%" stopColor={entry.gradientStart || entry.color} stopOpacity={1} />
                          <stop offset="100%" stopColor={entry.gradientEnd || entry.color} stopOpacity={0.8} />
                        </linearGradient>
                      ))}
                      
                      {/* Shadow gradients */}
                      {chartData.map((entry, index) => (
                        <linearGradient
                          key={`shadow-grad-${index}`}
                          id={createShadowGradientId(index)}
                          x1="0%" y1="0%" x2="100%" y2="100%"
                        >
                          <stop offset="0%" stopColor="#000000" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#000000" stopOpacity={0.1} />
                        </linearGradient>
                      ))}
                      
                      {/* Hover gradients */}
                      {chartData.map((entry, index) => (
                        <linearGradient
                          key={`hover-grad-${index}`}
                          id={createHoverGradientId(index)}
                          x1="0%" y1="0%" x2="100%" y2="100%"
                        >
                          <stop offset="0%" stopColor={entry.gradientStart || entry.color} stopOpacity={1} />
                          <stop offset="100%" stopColor={entry.gradientEnd || entry.color} stopOpacity={1} />
                        </linearGradient>
                      ))}
                      
                      {/* Glowing highlight gradient */}
                      <radialGradient
                        id="glow-gradient"
                        cx="50%" cy="50%" r="50%"
                        fx="50%" fy="50%"
                      >
                        <stop offset="0%" stopColor="white" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="white" stopOpacity={0} />
                      </radialGradient>
                    </defs>
                    
                    {/* Shadow effect (larger & darker) */}
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="53%"
                      innerRadius={animated ? 65 : 55}
                      outerRadius={animated ? 125 : 80}
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                      startAngle={90}
                      endAngle={animated ? -270 : 90}
                      animationDuration={1800}
                      animationBegin={0}
                      strokeWidth={0}
                      stroke="none"
                      opacity={0.3}
                      style={{ filter: 'blur(6px)' }}
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`shadow-${index}`} 
                          fill={`url(#${createShadowGradientId(index)})`}
                          opacity={0.2}
                        />
                      ))}
                    </Pie>
                    
                    {/* Main pie chart with dramatic lighting */}
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={animated ? 68 : 58}
                      outerRadius={animated ? 120 : 78}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                      startAngle={90}
                      endAngle={animated ? -270 : 90}
                      animationDuration={1800}
                      animationBegin={0}
                      strokeWidth={3}
                      stroke="#ffffff"
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#${createGradientId(index)})`}
                          opacity={animated ? 1 : 0.7}
                          style={{ 
                            cursor: 'pointer',
                            filter: 'drop-shadow(0px 10px 8px rgba(0, 0, 0, 0.15))',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e: any) => {
                            e.target.style.fill = `url(#${createHoverGradientId(index)})`;
                            e.target.style.filter = 'drop-shadow(0px 15px 15px rgba(0, 0, 0, 0.25))';
                            e.target.style.transform = 'translateZ(10px)';
                          }}
                          onMouseOut={(e: any) => {
                            e.target.style.fill = `url(#${createGradientId(index)})`;
                            e.target.style.filter = 'drop-shadow(0px 10px 8px rgba(0, 0, 0, 0.15))';
                            e.target.style.transform = 'translateZ(0px)';
                          }}
                        />
                      ))}
                      <LabelList 
                        dataKey="value" 
                        position="outside" 
                        style={{ 
                          fontSize: '12px', 
                          fill: '#64748b', 
                          fontWeight: 'bold',
                          filter: 'drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.2))',
                          textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
                        }} 
                        formatter={(value: number) => (getPercentage(value) >= 8 ? `${getPercentage(value)}%` : '')}
                      />
                    </Pie>
                    
                    {/* Highlight overlay for 3D effect */}
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={animated ? 68 : 58}
                      outerRadius={animated ? 120 : 78}
                      paddingAngle={5}
                      dataKey="value"
                      startAngle={90}
                      endAngle={animated ? -270 : 90}
                      animationDuration={1800}
                      animationBegin={100}
                      stroke="none"
                      fill="url(#glow-gradient)"
                      opacity={0.2}
                    />
                    
                    <Tooltip
                      formatter={(value, name) => [
                        `${value} requirement${value !== 1 ? "s" : ""} (${getPercentage(Number(value))}%)`,
                        name,
                      ]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "16px",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                        border: "none",
                        padding: "14px 18px",
                        fontWeight: 500,
                      }}
                      offset={20}
                      wrapperStyle={{ zIndex: 100, pointerEvents: "auto" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center score overlay with glassmorphism effect */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div 
                    className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-full h-40 w-40 flex items-center justify-center shadow-lg border border-white/50 dark:border-slate-700/50"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: animated ? 1 : 0, opacity: animated ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.6 }}
                    style={{ 
                      boxShadow: "inset 0 0 20px rgba(255, 255, 255, 0.5), 0 10px 30px rgba(0, 0, 0, 0.2)",
                      transform: `translateZ(20px) rotateX(calc(var(--rotate-x, 0deg) * -1.2)) rotateY(calc(var(--rotate-y, 0deg) * -1.2))`,
                      transformStyle: "preserve-3d"
                    }}
                  >
                    <div className="text-center p-3">
                      <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                        {complianceScore}%
                      </div>
                      <div className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-1">compliance score</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/4 space-y-3 p-2">
              {chartData.map((item, index) => (
                <motion.div 
                  key={item.name} 
                  className="flex items-center p-3 rounded-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:translate-x-1 cursor-pointer shadow-sm hover:shadow-md"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 100, 
                    damping: 12, 
                    delay: 0.3 + (index * 0.1) 
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="w-6 h-6 rounded-full mr-3 shadow-md" 
                    style={{ 
                      background: `linear-gradient(135deg, ${item.gradientStart || item.color}, ${item.gradientEnd || item.color})` 
                    }}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{item.value}</span>
                      <span className="text-xs text-muted-foreground">
                        ({getPercentage(item.value)}%)
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
