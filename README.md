This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Organization Chart Application - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [File Structure](#file-structure)
3. [Type Definitions](#type-definitions)
4. [Main Application (page.tsx)](#main-application-pagetsx)
5. [Add Entity Modal (add-entity-modal.tsx)](#add-entity-modal-add-entity-modaltsx)
6. [Edit Entity Modal (edit-entity-modal.tsx)](#edit-entity-modal-edit-entity-modaltsx)
7. [Organization Chart Component (organization-chart.tsx)](#organization-chart-component-organization-charttsx)
8. [Dependencies & Libraries](#dependencies--libraries)
9. [Architecture Patterns](#architecture-patterns)
10. [Usage Guide](#usage-guide)

---

## Project Overview

This is a React-based organization chart application built with Next.js and TypeScript. It allows users to visualize, create, and manage organizational hierarchies through an interactive interface. The application uses Mermaid.js for chart visualization and includes drag-and-drop functionality, zoom/pan controls, and comprehensive CRUD operations.

### Key Features
- **Hierarchical Visualization**: Display organizations → teams → circles → people
- **Interactive Chart**: Zoom, pan, and click-to-edit functionality
- **CRUD Operations**: Create, read, update entities through modal interfaces
- **Real-time Updates**: Chart updates immediately when data changes
- **Responsive Design**: Works across different screen sizes

---

## File Structure

```
/components/
├── add-entity-modal.tsx     # Modal for creating new entities
├── edit-entity-modal.tsx    # Modal for editing existing entities
└── organization-chart.tsx   # Main chart visualization component
/app/
└── page.tsx                 # Main application page and state management
```

---

## Type Definitions

The application uses four main entity types with specific relationships:

### Organization
```typescript
interface Organization {
  id: string          // Unique identifier
  name: string        // Organization name
  description: string // Purpose/description
  location: string    // Physical location
  established: string // Year established
  employees: number   // Total employee count
}
```

### Team
```typescript
interface Team {
  id: string            // Unique identifier
  name: string          // Team name
  description: string   // Team purpose
  lead: string          // Team leader name
  focus: string         // Primary focus area
  organizationId: string // Parent organization reference
}
```

### Circle
```typescript
interface Circle {
  id: string              // Unique identifier
  name: string            // Circle name
  purpose: string         // Circle purpose
  responsibilities: string[] // Array of responsibilities
  teamId: string          // Parent team reference
}
```

### Person
```typescript
interface Person {
  id: string        // Unique identifier
  name: string      // Full name
  role: string      // Job title/role
  email: string     // Email address
  department: string // Department name
  circleId: string  // Parent circle reference
}
```

### EntityType Union
```typescript
type EntityType = "organization" | "team" | "circle" | "person"
```

---

## Main Application (page.tsx)

### Purpose
The main application file serves as the root component and central state manager. It coordinates all interactions between child components and maintains the application's data state.

### Key Responsibilities
1. **State Management**: Maintains all organizational data in a single state object
2. **Modal Control**: Manages the opening/closing of add and edit modals
3. **Data Operations**: Handles create and update operations for all entity types
4. **UI Layout**: Renders the main application structure with header, stats, and chart

### State Structure
```typescript
const [data, setData] = useState({
  organizations: Organization[],
  teams: Team[],
  circles: Circle[],
  people: Person[]
})
```

### Core Functions

#### `handleAddEntity(type: EntityType, entityData: any)`
**Purpose**: Creates new entities and adds them to the appropriate array in state.

**Why it's needed**: Provides a centralized way to add new entities while ensuring proper ID generation and state updates.

**Implementation Details**:
- Generates unique IDs using timestamp: `${type}-${Date.now()}`
- Uses dynamic property access to update the correct array
- Maintains immutability by spreading previous state

```typescript
const handleAddEntity = (type: EntityType, entityData: any) => {
  const id = `${type}-${Date.now()}`
  const newEntity = { ...entityData, id }
  
  setData((prev) => ({
    ...prev,
    [`${type}s`]: [...(prev[`${type}s` as keyof typeof prev] as any[]), newEntity],
  }))
}
```

#### `handleEditEntity(type: EntityType, entityData: any)`
**Purpose**: Updates existing entities in the state.

**Why it's needed**: Allows users to modify entity properties while maintaining data integrity and triggering re-renders.

**Implementation Details**:
- Handles the special case of "person" → "people" pluralization
- Uses map to find and replace the specific entity
- Preserves all other entities unchanged

```typescript
const handleEditEntity = (type: EntityType, entityData: any) => {
  setData((prev) => {
    const pluralType = type === "person" ? "people" : (`${type}s` as keyof typeof prev);
    const currentArray = (prev[pluralType] as any[]) || [];

    return {
      ...prev,
      [pluralType]: currentArray.map((item) =>
        item.id === entityData.id ? entityData : item
      ),
    };
  });
};
```

#### `openEditModal(type: EntityType, entity: any)`
**Purpose**: Prepares and opens the edit modal with selected entity data.

**Why it's needed**: Provides a clean interface for editing entities by setting up the modal state properly.

### UI Components

#### Header Section
- Displays application title and description
- Contains the main "Add Entity" button
- Uses Tailwind CSS for styling

#### Stats Overview
- Shows count of each entity type using Card components
- Uses Lucide React icons for visual enhancement
- Provides quick overview of organization size

#### Main Chart Container
- Wraps the OrganizationChart component
- Uses Card component for consistent styling
- Handles overflow for large charts

---

## Add Entity Modal (add-entity-modal.tsx)

### Purpose
Provides a modal interface for creating new entities with dynamic forms based on entity type selection.

### Key Features
1. **Dynamic Form Generation**: Different form fields based on selected entity type
2. **Relationship Management**: Dropdown selectors for parent relationships
3. **Form Validation**: Basic input validation and data processing
4. **Responsive Design**: Modal layout that works on different screen sizes

### Props Interface
```typescript
interface AddEntityModalProps {
  isOpen: boolean                           // Controls modal visibility
  onClose: () => void                      // Function to close modal
  onAdd: (type: EntityType, data: any) => void // Function to add new entity
  data: any                                // Current application data for dropdowns
}
```

### State Management
```typescript
const [entityType, setEntityType] = useState<EntityType>("organization")
const [formData, setFormData] = useState<any>({})
```

**Why separate state is needed**:
- `entityType`: Controls which form fields are displayed
- `formData`: Stores form input values before submission

### Form Generation Logic

#### `renderForm()` Function
**Purpose**: Dynamically renders form fields based on selected entity type.

**Why it's needed**: Each entity type has different required fields and relationships, requiring different form structures.

**Implementation Pattern**:
```typescript
const renderForm = () => {
  switch (entityType) {
    case "organization": return <OrganizationForm />
    case "team": return <TeamForm />
    case "circle": return <CircleForm />
    case "person": return <PersonForm />
  }
}
```

### Entity-Specific Forms

#### Organization Form
**Fields**: name, description, location, established, employees
**Special Handling**: 
- Employee count uses `type="number"` input
- parseInt conversion for numeric values

#### Team Form
**Fields**: organizationId (dropdown), name, description, lead, focus
**Relationship**: Must select parent organization
**Dropdown Population**: Maps through `data.organizations`

#### Circle Form
**Fields**: teamId (dropdown), name, purpose, responsibilities
**Relationship**: Must select parent team
**Special Handling**: 
- Responsibilities field accepts comma-separated values
- Converts string to array on change: `e.target.value.split(",").map(r => r.trim())`

#### Person Form
**Fields**: name, role, email, department, circleId (dropdown)
**Relationship**: Must select parent circle

### Form Submission Process

#### `handleSubmit(e: React.FormEvent)`
**Purpose**: Processes form submission and creates new entity.

**Steps**:
1. Prevents default form submission
2. Calls parent's `onAdd` function with entity type and form data
3. Resets form data
4. Closes modal

**Why this pattern**: Separates data processing (parent) from UI logic (modal).

---

## Edit Entity Modal (edit-entity-modal.tsx)

### Purpose
Provides a modal interface for editing existing entities with pre-populated form fields.

### Key Differences from Add Modal
1. **Data Pre-population**: Form fields are pre-filled with existing entity data
2. **No Type Selection**: Entity type is fixed (passed as prop)
3. **Update Operation**: Calls `onEdit` instead of `onAdd`

### Props Interface
```typescript
interface EditEntityModalProps {
  isOpen: boolean                              // Controls modal visibility
  onClose: () => void                         // Function to close modal
  onEdit: (type: EntityType, data: any) => void // Function to update entity
  entityType: EntityType                      // Fixed entity type
  entity: any                                 // Current entity data
  data: any                                   // Application data for dropdowns
}
```

### Data Pre-population

#### `useEffect` Hook
**Purpose**: Populates form with existing entity data when modal opens.

```typescript
useEffect(() => {
  if (entity) {
    setFormData({ ...entity })
  }
}, [entity])
```

**Why it's needed**: Ensures users see current values and can modify them incrementally.

### Form Handling Differences

#### Responsibilities Field (Circle Entity)
**Special Logic**: Converts array back to comma-separated string for editing
```typescript
value={formData.responsibilities?.join(", ") || ""}
```

**Why needed**: UI text area expects string, but data model uses array.

### Update Process
1. User modifies pre-populated fields
2. Form submission calls `onEdit` with updated data
3. Parent component updates state and re-renders chart
4. Modal closes automatically

---

## Organization Chart Component (organization-chart.tsx)

### Purpose
Renders an interactive organizational chart using Mermaid.js with zoom, pan, and click-to-edit functionality.

### Key Features
1. **Mermaid Integration**: Generates flowchart from organizational data
2. **Interactive Controls**: Zoom, pan, and node click interactions
3. **Dynamic Updates**: Re-renders when data changes
4. **Visual Hierarchy**: Clear representation of organizational structure

### Props Interface
```typescript
interface OrganizationChartProps {
  data: {
    organizations: Organization[];
    teams: Team[];
    circles: Circle[];
    people: Person[];
  };
  onEditEntity: (type: EntityType, entity: any) => void;
}
```

### State Management with Refs
**Why refs instead of state**: These values need to persist across renders without causing re-renders themselves.

```typescript
const containerRef = useRef<HTMLDivElement>(null)    // Chart container element
const svgRef = useRef<SVGSVGElement | null>(null)    // SVG element reference
const zoomLevel = useRef(1)                          // Current zoom level
const panOffset = useRef({ x: 0, y: 0 })           // Pan position
const isDragging = useRef(false)                     // Drag state
const lastPanPoint = useRef({ x: 0, y: 0 })        // Last mouse position
```

### Mermaid Integration

#### `initializeMermaid()`
**Purpose**: Configures Mermaid with application-specific settings.

```typescript
mermaid.initialize({
  startOnLoad: false,        // Manual initialization
  theme: "default",          // Visual theme
  flowchart: {
    useMaxWidth: false,      // Allow custom sizing
    htmlLabels: true,        // Enable HTML in labels
    curve: "basis",          // Connection line style
  },
  securityLevel: "loose",    // Allow HTML content
});
```

#### `renderChart()`
**Purpose**: Generates and renders the Mermaid chart.

**Process**:
1. Generate Mermaid definition string
2. Create unique chart ID
3. Clear previous chart
4. Render new chart using `mermaid.render()`
5. Insert SVG into DOM
6. Setup interactivity

### Chart Definition Generation

#### `generateMermaidDefinition(data)`
**Purpose**: Converts application data into Mermaid flowchart syntax.

**Structure**:
```
flowchart TD
    org1["🏢 Organization Name"]
    org1 --> team1["👥 Team Name"]
    team1 --> circle1["🎯 Circle Name"]
    circle1 --> person1["👤 Person Name"]
```

**Implementation Logic**:
1. Start with flowchart declaration
2. Loop through organizations
3. For each org, find and connect teams
4. For each team, find and connect circles
5. For each circle, find and connect people
6. Add CSS class definitions

#### Text Sanitization
```typescript
const sanitizeText = (text: string | undefined | null, fallback: string = "") => {
  return text && text.trim() ? text : fallback;
}
```
**Why needed**: Prevents empty or undefined values from breaking chart rendering.

### Interactive Features

#### Zoom Functionality
```typescript
const handleZoom = (e: WheelEvent) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? 0.9 : 1.1;
  const newZoom = Math.max(0.1, Math.min(3, zoomLevel.current * delta));
  
  if (newZoom !== zoomLevel.current) {
    zoomLevel.current = newZoom;
    updateTransform();
  }
}
```

**Features**:
- Mouse wheel controls zoom
- Zoom limits: 0.1x to 3x
- Smooth zoom increments

#### Pan Functionality
**Event Handlers**:
- `mousedown`: Start panning
- `mousemove`: Update pan position
- `mouseup`/`mouseleave`: End panning

**Implementation**:
```typescript
const handlePanMove = (e: MouseEvent) => {
  if (!isDragging.current) return;
  
  const deltaX = e.clientX - lastPanPoint.current.x;
  const deltaY = e.clientY - lastPanPoint.current.y;
  
  panOffset.current.x += deltaX;
  panOffset.current.y += deltaY;
  
  lastPanPoint.current = { x: e.clientX, y: e.clientY };
  updateTransform();
}
```

#### Transform Application
```typescript
const updateTransform = () => {
  if (!svgRef.current) return;
  
  const g = svgRef.current.querySelector("g");
  if (g) {
    g.style.transform = `translate(${panOffset.current.x}px, ${panOffset.current.y}px) scale(${zoomLevel.current})`;
    g.style.transformOrigin = "center";
  }
}
```

**Why this approach**: CSS transforms are hardware-accelerated and provide smooth interactions.

### Node Interaction System

#### Node Click Detection
**Challenge**: Mermaid generates complex SVG structures with dynamic IDs.

**Solution**: Multi-step entity resolution:
1. Extract clean node ID from Mermaid-generated ID
2. Search through all entity collections
3. Find matching entity by ID comparison
4. Return entity type and data

#### `findEntityFromNode(nodeElement)`
**Purpose**: Maps clicked SVG node back to application data.

**Process**:
```typescript
const findEntityFromNode = (nodeElement: SVGElement) => {
  const nodeId = extractNodeId(nodeElement.id);
  
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
```

#### Visual Feedback
- Hover effects: Brightness increase
- Click feedback: Temporary brightness boost
- Cursor changes: pointer on hover, grab/grabbing for pan

### CSS Class Definitions
```typescript
const generateClassDefinitions = () => {
  return `
    classDef organization fill:#E3F2FD,stroke:#1976D2,stroke-width:3px,color:#000,cursor:pointer,rx:10,ry:10
    classDef team fill:#E8F5E9,stroke:#388E3C,stroke-width:2px,color:#000,cursor:pointer,rx:10,ry:10
    classDef circle fill:#F3E5F5,stroke:#7B1FA2,stroke-width:2px,color:#000,cursor:pointer,rx:10,ry:10
    classDef person fill:#FFF3E0,stroke:#F57C00,stroke-width:2px,color:#000,cursor:pointer,rx:10,ry:10
  `;
};
```

**Purpose**: Provides visual distinction between entity types with consistent color coding and styling.

---

## Dependencies & Libraries

### Core Dependencies
- **React 18+**: Component framework
- **Next.js**: React framework with SSR capabilities
- **TypeScript**: Type safety and better development experience

### UI Libraries
- **@/components/ui/***: shadcn/ui component library
  - Provides consistent, accessible UI components
  - Based on Radix UI primitives
  - Tailwind CSS integration

### Visualization
- **Mermaid.js**: Chart rendering library
  - Declarative syntax for diagrams
  - SVG output for scalability
  - Built-in themes and styling

### Icons
- **Lucide React**: Icon library
  - Consistent icon set
  - Tree-shakeable imports
  - SVG-based for scalability

### Styling
- **Tailwind CSS**: Utility-first CSS framework
  - Rapid UI development
  - Consistent design system
  - Responsive design utilities

---

## Architecture Patterns

### State Management Pattern
**Centralized State**: All data managed in main component
- Single source of truth
- Predictable data flow
- Easy debugging and testing

### Component Communication
**Props Down, Events Up**: 
- Data flows down through props
- Events bubble up through callbacks
- Clear separation of concerns

### Modal Pattern
**Controlled Components**: 
- Parent controls modal visibility
- Modal handles its own form state
- Data submission goes back to parent

### Ref-based Interactions
**Direct DOM Manipulation**: 
- Refs for performance-critical operations
- Avoid re-renders for interaction state
- Direct SVG manipulation for smooth animations

---

## Usage Guide

### Adding New Entities
1. Click "Add Entity" button
2. Select entity type from dropdown
3. Fill required fields
4. For dependent entities (teams, circles, people), select parent from dropdown
5. Submit form

### Editing Entities
1. Click on any node in the chart
2. Modal opens with current values
3. Modify desired fields
4. Save changes

### Chart Navigation
- **Zoom**: Mouse wheel or trackpad scroll
- **Pan**: Click and drag on empty chart area
- **Reset**: Reload page (future: reset button)

### Data Relationships
- Organizations contain Teams
- Teams contain Circles  
- Circles contain People
- Each entity must have a valid parent (except Organizations)