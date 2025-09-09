import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AllouiIcon } from '../icons';

const COURT_WIDTH = 800;
const COURT_HEIGHT = 600;
const PLAYER_RADIUS = 20;
const CONE_RADIUS = 12;

const DrillBuilder = () => {
  const [selectedTool, setSelectedTool] = useState('player');
  const [drillElements, setDrillElements] = useState([]);
  const [draggedElement, setDraggedElement] = useState(null);
  const [drillName, setDrillName] = useState('');
  const [drillDescription, setDrillDescription] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playStep, setPlayStep] = useState(0);
  const svgRef = useRef(null);
  const intervalRef = useRef(null);

  const tools = [
    { id: 'player', name: 'Player', icon: 'user', color: '#FF6B35' },
    { id: 'ball', name: 'Basketball', icon: 'basketball', color: '#FF8800' },
    { id: 'cone', name: 'Cone', icon: 'triangle', color: '#FFD23F' },
    { id: 'line', name: 'Movement Line', icon: 'arrow-right', color: '#06D6A0' },
    { id: 'station', name: 'Drill Station', icon: 'target', color: '#4CC9F0' }
  ];

  const drillTemplates = [
    {
      name: 'Layup Lines',
      description: 'Basic layup drill with proper footwork',
      elements: [
        { type: 'player', x: 100, y: 300, number: 1, team: 'offense' },
        { type: 'player', x: 150, y: 320, number: 2, team: 'offense' },
        { type: 'ball', x: 100, y: 300 },
        { type: 'cone', x: 200, y: 250 },
        { type: 'cone', x: 300, y: 200 }
      ]
    },
    {
      name: 'Defensive Slides',
      description: 'Lateral movement and defensive positioning',
      elements: [
        { type: 'player', x: 200, y: 300, number: 1, team: 'defense' },
        { type: 'cone', x: 150, y: 300 },
        { type: 'cone', x: 250, y: 300 },
        { type: 'cone', x: 350, y: 300 }
      ]
    }
  ];

  const getSVGCoordinates = useCallback((event) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const scaleX = COURT_WIDTH / rect.width;
    const scaleY = COURT_HEIGHT / rect.height;
    
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }, []);

  const addElement = useCallback((x, y) => {
    if (selectedTool === 'line') return; // Lines handled differently
    
    const newElement = {
      id: Date.now(),
      type: selectedTool,
      x,
      y,
      ...(selectedTool === 'player' && { 
        number: drillElements.filter(el => el.type === 'player').length + 1,
        team: 'offense'
      })
    };
    
    setDrillElements(prev => [...prev, newElement]);
  }, [selectedTool, drillElements]);

  const handleSVGClick = useCallback((event) => {
    const { x, y } = getSVGCoordinates(event);
    addElement(x, y);
  }, [getSVGCoordinates, addElement]);

  const handleElementMouseDown = useCallback((event, element) => {
    event.stopPropagation();
    setDraggedElement({
      ...element,
      offsetX: 0,
      offsetY: 0
    });
  }, []);

  const handleMouseMove = useCallback((event) => {
    if (!draggedElement) return;
    
    const { x, y } = getSVGCoordinates(event);
    setDrillElements(prev => 
      prev.map(el => 
        el.id === draggedElement.id 
          ? { ...el, x: x - draggedElement.offsetX, y: y - draggedElement.offsetY }
          : el
      )
    );
  }, [draggedElement, getSVGCoordinates]);

  const handleMouseUp = useCallback(() => {
    setDraggedElement(null);
  }, []);

  const deleteElement = useCallback((elementId) => {
    setDrillElements(prev => prev.filter(el => el.id !== elementId));
  }, []);

  const clearDrill = useCallback(() => {
    setDrillElements([]);
    setDrillName('');
    setDrillDescription('');
  }, []);

  const loadTemplate = useCallback((template) => {
    setDrillElements(template.elements.map(el => ({
      ...el,
      id: Date.now() + Math.random()
    })));
    setDrillName(template.name);
    setDrillDescription(template.description);
  }, []);

  const playDrill = useCallback(() => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
      setPlayStep(0);
    } else {
      setIsPlaying(true);
      setPlayStep(0);
      intervalRef.current = setInterval(() => {
        setPlayStep(prev => (prev + 1) % 4);
      }, 1000);
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const renderElement = (element) => {
    const animationOffset = isPlaying ? Math.sin(playStep * 0.5) * 5 : 0;
    
    switch (element.type) {
      case 'player':
        return (
          <g key={element.id}>
            <circle
              cx={element.x + animationOffset}
              cy={element.y}
              r={PLAYER_RADIUS}
              fill={element.team === 'offense' ? '#FF6B35' : '#4CC9F0'}
              stroke="#ffffff"
              strokeWidth="2"
              onMouseDown={(e) => handleElementMouseDown(e, element)}
              style={{ cursor: 'move' }}
            />
            <text
              x={element.x + animationOffset}
              y={element.y + 5}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="14"
              fontWeight="bold"
              pointerEvents="none"
            >
              {element.number}
            </text>
          </g>
        );
      
      case 'ball':
        return (
          <circle
            key={element.id}
            cx={element.x + animationOffset}
            cy={element.y}
            r="8"
            fill="#FF8800"
            stroke="#000000"
            strokeWidth="1"
            onMouseDown={(e) => handleElementMouseDown(e, element)}
            style={{ cursor: 'move' }}
          />
        );
      
      case 'cone':
        return (
          <polygon
            key={element.id}
            points={`${element.x},${element.y - CONE_RADIUS} ${element.x - CONE_RADIUS},${element.y + CONE_RADIUS} ${element.x + CONE_RADIUS},${element.y + CONE_RADIUS}`}
            fill="#FFD23F"
            stroke="#FF6B35"
            strokeWidth="2"
            onMouseDown={(e) => handleElementMouseDown(e, element)}
            style={{ cursor: 'move' }}
          />
        );
      
      case 'station':
        return (
          <g key={element.id}>
            <circle
              cx={element.x}
              cy={element.y}
              r="15"
              fill="none"
              stroke="#4CC9F0"
              strokeWidth="3"
              strokeDasharray="5,5"
              onMouseDown={(e) => handleElementMouseDown(e, element)}
              style={{ cursor: 'move' }}
            />
            <circle
              cx={element.x}
              cy={element.y}
              r="5"
              fill="#4CC9F0"
            />
          </g>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-alloui-primary to-alloui-court-blue text-white p-6">
        <h2 className="text-2xl font-bold flex items-center">
          <AllouiIcon name="strategy" size="lg" className="mr-3 text-alloui-gold" />
          Interactive Drill Builder
        </h2>
        <p className="text-alloui-gold/90 mt-2">
          Design custom basketball drills with drag-and-drop simplicity
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 p-6">
        {/* Tools Panel */}
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-alloui-primary mb-3 flex items-center">
              <AllouiIcon name="settings" size="sm" className="mr-2 text-alloui-gold" />
              Tools
            </h3>
            <div className="space-y-2">
              {tools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    selectedTool === tool.id
                      ? 'bg-alloui-gold text-alloui-primary shadow-md'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <AllouiIcon name={tool.icon} size="sm" className="mr-3" />
                  {tool.name}
                </button>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div>
            <h3 className="font-bold text-alloui-primary mb-3 flex items-center">
              <AllouiIcon name="template" size="sm" className="mr-2 text-alloui-gold" />
              Templates
            </h3>
            <div className="space-y-2">
              {drillTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => loadTemplate(template)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="font-medium text-alloui-primary">{template.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{template.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={playDrill}
              className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors ${
                isPlaying
                  ? 'bg-team-red text-white'
                  : 'bg-success-green text-white hover:bg-success-green/90'
              }`}
            >
              <AllouiIcon name={isPlaying ? 'pause' : 'play'} size="sm" className="mr-2" />
              {isPlaying ? 'Stop' : 'Play'} Drill
            </button>
            
            <button
              onClick={clearDrill}
              className="w-full flex items-center justify-center p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <AllouiIcon name="trash" size="sm" className="mr-2" />
              Clear All
            </button>
          </div>
        </div>

        {/* Court Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="aspect-[4/3] bg-basketball-court rounded-lg overflow-hidden relative">
              <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox={`0 0 ${COURT_WIDTH} ${COURT_HEIGHT}`}
                className="cursor-crosshair"
                onClick={handleSVGClick}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Court Background */}
                <rect width={COURT_WIDTH} height={COURT_HEIGHT} fill="#8B4513" />
                
                {/* Court Lines */}
                <g stroke="#ffffff" strokeWidth="3" fill="none">
                  {/* Outer boundaries */}
                  <rect x="50" y="50" width={COURT_WIDTH - 100} height={COURT_HEIGHT - 100} />
                  
                  {/* Center line */}
                  <line x1={COURT_WIDTH / 2} y1="50" x2={COURT_WIDTH / 2} y2={COURT_HEIGHT - 50} />
                  
                  {/* Center circle */}
                  <circle cx={COURT_WIDTH / 2} cy={COURT_HEIGHT / 2} r="60" />
                  
                  {/* Free throw areas */}
                  <rect x="50" y="200" width="150" height="200" />
                  <rect x={COURT_WIDTH - 200} y="200" width="150" height="200" />
                  
                  {/* Hoops */}
                  <circle cx="50" cy={COURT_HEIGHT / 2} r="8" fill="#FF6B35" />
                  <circle cx={COURT_WIDTH - 50} cy={COURT_HEIGHT / 2} r="8" fill="#FF6B35" />
                </g>
                
                {/* Drill Elements */}
                {drillElements.map(renderElement)}
              </svg>
            </div>
            
            {selectedTool && (
              <div className="mt-3 text-center text-sm text-gray-600">
                Click on the court to add: <span className="font-medium text-alloui-primary">{tools.find(t => t.id === selectedTool)?.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Drill Details */}
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-alloui-primary mb-3 flex items-center">
              <AllouiIcon name="info" size="sm" className="mr-2 text-alloui-gold" />
              Drill Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drill Name
                </label>
                <input
                  type="text"
                  value={drillName}
                  onChange={(e) => setDrillName(e.target.value)}
                  placeholder="Enter drill name..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-alloui-gold focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={drillDescription}
                  onChange={(e) => setDrillDescription(e.target.value)}
                  placeholder="Describe the drill objectives and setup..."
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-alloui-gold focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Elements List */}
          <div>
            <h3 className="font-bold text-alloui-primary mb-3 flex items-center">
              <AllouiIcon name="list" size="sm" className="mr-2 text-alloui-gold" />
              Elements ({drillElements.length})
            </h3>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {drillElements.map((element, index) => (
                <div
                  key={element.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center text-sm">
                    <AllouiIcon 
                      name={tools.find(t => t.id === element.type)?.icon || 'circle'} 
                      size="xs" 
                      className="mr-2 text-alloui-primary" 
                    />
                    <span className="font-medium">
                      {tools.find(t => t.id === element.type)?.name}
                      {element.number && ` ${element.number}`}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteElement(element.id)}
                    className="text-team-red hover:text-team-red/80 transition-colors"
                  >
                    <AllouiIcon name="trash" size="xs" />
                  </button>
                </div>
              ))}
              
              {drillElements.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  No elements added yet.<br />
                  Click on the court to start building your drill.
                </div>
              )}
            </div>
          </div>

          {/* Save Drill */}
          <div>
            <button
              disabled={!drillName || drillElements.length === 0}
              className="w-full flex items-center justify-center p-3 bg-alloui-primary hover:bg-alloui-primary/90 disabled:bg-gray-300 text-white rounded-lg transition-colors"
            >
              <AllouiIcon name="save" size="sm" className="mr-2" />
              Save Drill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrillBuilder;