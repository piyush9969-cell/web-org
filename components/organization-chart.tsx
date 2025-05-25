"use client";

import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";
import type {
  Organization,
  Team,
  Circle,
  Person,
  EntityType,
} from "@/app/page";

interface OrganizationChartProps {
  data: {
    organizations: Organization[];
    teams: Team[];
    circles: Circle[];
    people: Person[];
  };
  onEditEntity: (type: EntityType, entity: any) => void;
}

export default function OrganizationChart({
  data,
  onEditEntity,
}: OrganizationChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomLevel = useRef(1);
  const panOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPanPoint = useRef({ x: 0, y: 0 });

  useEffect(() => {
    initializeMermaid();
  }, []);

  useEffect(() => {
    if (containerRef.current && data) {
      renderChart();
    }
  }, [data]);

  const initializeMermaid = () => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: "basis",
      },
      securityLevel: "loose",
    });
  };

  const renderChart = async () => {
    if (!containerRef.current) return;

    try {
      const chartDefinition = generateMermaidDefinition(data);
      const chartId = `organizationChart-${Date.now()}`;

      containerRef.current.innerHTML = "";

      const { svg } = await mermaid.render(chartId, chartDefinition);
      containerRef.current.innerHTML = svg;

      setTimeout(() => {
        setupInteractivity();
      }, 100);
    } catch (error) {
      console.error("Error rendering Mermaid chart:", error);
      containerRef.current.innerHTML =
        '<p class="text-red-500 p-4">Error rendering chart</p>';
    }
  };

  const generateMermaidDefinition = (data: OrganizationChartProps["data"]) => {
    let definition = "flowchart TD\n";

    // Add organizations and their hierarchies
    data.organizations.forEach((org) => {
      const location = sanitizeText(org.location);
      const subtitle = location ? `<br/><small>${location}</small>` : "";
      definition += `    ${org.id}["🏢 ${org.name}${subtitle}"]:::organization\n`;

      // Add teams under organizations
      const orgTeams = data.teams.filter(
        (team) => team.organizationId === org.id
      );
      orgTeams.forEach((team) => {
        const lead = sanitizeText(team.lead);
        const teamSubtitle = lead ? `<br/><small>Lead: ${lead}</small>` : "";
        definition += `    ${org.id} --> ${team.id}["👥 ${team.name}${teamSubtitle}"]:::team\n`;

        // Add circles under teams
        const teamCircles = data.circles.filter(
          (circle) => circle.teamId === team.id
        );
        teamCircles.forEach((circle) => {
          const purpose = sanitizeText(circle.purpose);
          const circleSubtitle = purpose
            ? `<br/><small>${purpose}</small>`
            : "";
          definition += `    ${team.id} --> ${circle.id}["🎯 ${circle.name}${circleSubtitle}"]:::circle\n`;

          // Add people under circles
          const circlePeople = data.people.filter(
            (person) => person.circleId === circle.id
          );
          circlePeople.forEach((person) => {
            const role = sanitizeText(person.role);
            const personSubtitle = role ? `<br/><small>${role}</small>` : "";
            definition += `    ${circle.id} --> ${person.id}["👤 ${person.name}${personSubtitle}"]:::person\n`;
          });
        });
      });
    });

    // Add styling
    definition += generateClassDefinitions();

    return definition;
  };

  const sanitizeText = (
    text: string | undefined | null,
    fallback: string = ""
  ) => {
    return text && text.trim() ? text : fallback;
  };

  const generateClassDefinitions = () => {
    return `
    classDef organization fill:#E3F2FD,stroke:#1976D2,stroke-width:3px,color:#000,cursor:pointer,rx:10,ry:10
    classDef team fill:#E8F5E9,stroke:#388E3C,stroke-width:2px,color:#000,cursor:pointer,rx:10,ry:10
    classDef circle fill:#F3E5F5,stroke:#7B1FA2,stroke-width:2px,color:#000,cursor:pointer,rx:10,ry:10
    classDef person fill:#FFF3E0,stroke:#F57C00,stroke-width:2px,color:#000,cursor:pointer,rx:10,ry:10
  `;
  };

  const setupInteractivity = () => {
    if (!containerRef.current) return;

    const svgElement = containerRef.current.querySelector(
      "svg"
    ) as SVGSVGElement;
    if (!svgElement) return;

    svgRef.current = svgElement;
    setupSVGProperties(svgElement);
    setupZoomAndPan(svgElement);
    setupNodeInteractivity(svgElement);
  };

  const setupSVGProperties = (svgElement: SVGSVGElement) => {
    svgElement.style.width = "100%";
    svgElement.style.height = "100%";
    svgElement.style.cursor = "grab";
  };

  const setupZoomAndPan = (svgElement: SVGSVGElement) => {
    // Zoom functionality
    svgElement.addEventListener("wheel", handleZoom, { passive: false });

    // Pan functionality
    svgElement.addEventListener("mousedown", handlePanStart);
    svgElement.addEventListener("mousemove", handlePanMove);
    svgElement.addEventListener("mouseup", handlePanEnd);
    svgElement.addEventListener("mouseleave", handlePanEnd);

    // Reset zoom and pan
    resetZoomAndPan();
  };

  const handleZoom = (e: WheelEvent) => {
    e.preventDefault();

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(3, zoomLevel.current * delta));

    if (newZoom !== zoomLevel.current) {
      zoomLevel.current = newZoom;
      updateTransform();
    }
  };

  const handlePanStart = (e: MouseEvent) => {
    if (e.target instanceof SVGElement && !e.target.closest(".node")) {
      isDragging.current = true;
      lastPanPoint.current = { x: e.clientX, y: e.clientY };
      if (svgRef.current) {
        svgRef.current.style.cursor = "grabbing";
      }
    }
  };

  const handlePanMove = (e: MouseEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - lastPanPoint.current.x;
    const deltaY = e.clientY - lastPanPoint.current.y;

    panOffset.current.x += deltaX;
    panOffset.current.y += deltaY;

    lastPanPoint.current = { x: e.clientX, y: e.clientY };
    updateTransform();
  };

  const handlePanEnd = () => {
    isDragging.current = false;
    if (svgRef.current) {
      svgRef.current.style.cursor = "grab";
    }
  };

  const updateTransform = () => {
    if (!svgRef.current) return;

    const g = svgRef.current.querySelector("g");
    if (g) {
      g.style.transform = `translate(${panOffset.current.x}px, ${panOffset.current.y}px) scale(${zoomLevel.current})`;
      g.style.transformOrigin = "center";
    }
  };

  const resetZoomAndPan = () => {
    zoomLevel.current = 1;
    panOffset.current = { x: 0, y: 0 };
    updateTransform();
  };

  const setupNodeInteractivity = (svgElement: SVGSVGElement) => {
    const nodes = svgElement.querySelectorAll(".node");

    nodes.forEach((node) => {
      const nodeElement = node as SVGElement;
      setupNodeEventListeners(nodeElement);
    });
  };

  const setupNodeEventListeners = (nodeElement: SVGElement) => {
    // Click handler for editing
    nodeElement.addEventListener("click", (e) => {
      if (!isDragging.current) {
        handleNodeClick(e, nodeElement);
      }
    });

    // Hover effects
    nodeElement.addEventListener("mouseenter", () => {
      if (!isDragging.current) {
        nodeElement.style.filter = "brightness(1.05)";
        nodeElement.style.transition = "all 0.2s ease";
      }
    });

    nodeElement.addEventListener("mouseleave", () => {
      nodeElement.style.filter = "";
      nodeElement.style.transform = "";
    });

    // Ensure clickability
    nodeElement.style.pointerEvents = "all";
    nodeElement.style.cursor = "pointer";
  };

  const handleNodeClick = (e: MouseEvent, nodeElement: SVGElement) => {
    e.preventDefault();
    e.stopPropagation();

    // Visual feedback
    nodeElement.style.filter = "brightness(1.2)";

    setTimeout(() => {
      nodeElement.style.filter = "";
      handleNodeEdit(nodeElement);
    }, 150);
  };

  const handleNodeEdit = (nodeElement: SVGElement) => {
    const entity = findEntityFromNode(nodeElement);

    if (entity.found) {
      onEditEntity(entity.type, entity.data);
    } else {
      console.error("Could not find entity for node ID:", nodeElement.id);
    }
  };

  const findEntityFromNode = (nodeElement: SVGElement) => {
    const nodeId = extractNodeId(nodeElement.id);

    // Search through all entity types
    const searchFunctions = [
      () => findInCollection(data.organizations, nodeId, "organization"),
      () => findInCollection(data.teams, nodeId, "team"),
      () => findInCollection(data.circles, nodeId, "circle"),
      () => findInCollection(data.people, nodeId, "person"),
    ];

    for (const searchFn of searchFunctions) {
      const result = searchFn();
      if (result.found) return result;
    }

    return { found: false, type: "person" as EntityType, data: null };
  };

  const extractNodeId = (fullNodeId: string) => {
    // Remove common Mermaid prefixes
    return fullNodeId.includes("flowchart-")
      ? fullNodeId.replace(/^.*?flowchart-/, "").replace(/-\d+$/, "")
      : fullNodeId;
  };

  const findInCollection = (
    collection: any[],
    nodeId: string,
    type: EntityType
  ) => {
    const entity = collection.find(
      (item) => nodeId.includes(item.id) || item.id.includes(nodeId)
    );

    return {
      found: !!entity,
      type,
      data: entity,
    };
  };


  return (
    <div className="w-full h-full bg-white relative">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">
          Organization Structure
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Scroll to zoom • Drag to pan • Click nodes to edit
        </p>
      </div>

      <div
        ref={containerRef}
        className="w-full h-[700px] overflow-hidden p-4 relative"
        style={{ minHeight: "700px" }}
      />

     
    </div>
  );
}
