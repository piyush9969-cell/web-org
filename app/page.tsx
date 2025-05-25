"use client"

import { useEffect, useState } from "react"
import { Plus, Users, Building, Target, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import OrganizationChart from "@/components/organization-chart"
import AddEntityModal from "@/components/add-entity-modal"
import EditEntityModal from "@/components/edit-entity-modal"

export interface Person {
  id: string
  name: string
  role: string
  email: string
  department: string
  circleId: string
}

export interface Circle {
  id: string
  name: string
  purpose: string
  responsibilities: string[]
  teamId: string
}

export interface Team {
  id: string
  name: string
  description: string
  lead: string
  focus: string
  organizationId: string
}

export interface Organization {
  id: string
  name: string
  description: string
  location: string
  established: string
  employees: number
}

export type EntityType = "organization" | "team" | "circle" | "person"

const exampleData = [
  { id: "org1", name: "Org A", type: "organization" },
  { id: "team1", name: "Team Alpha", type: "team", parentId: "org1" },
  { id: "team2", name: "Team Second", type: "team", parentId: "org1" },
  { id: "circle1", name: "Circle X", type: "circle", parentId: "team1" },
  { id: "circle2", name: "Circle y", type: "circle", parentId: "team2" },
  { id: "person1", name: "Jane Doe", type: "person", parentId: "circle1" },
  { id: "person2", name: "John Smith", type: "person", parentId: "circle2" },
  { id: "person3", name: "Alice Johnson", type: "person", parentId: "circle1" },
  

];


const initialData = {
  organizations: [
    {
      id: "org-1",
      name: "DU1 - Digital Innovation",
      description: "Leading digital transformation initiatives",
      location: "San Francisco, CA",
      established: "2020",
      employees: 150,
    },
    {
      id: "org-2",
      name: "DU2 - Product Development",
      description: "Core product development and engineering",
      location: "Austin, TX",
      established: "2019",
      employees: 200,
    },
  ],
  teams: [
    {
      id: "team-1",
      name: "Team Alpha",
      description: "Frontend development and user experience",
      lead: "Sarah Johnson",
      focus: "User Interface",
      organizationId: "org-1",
    },
    {
      id: "team-2",
      name: "Team Beta",
      description: "Backend infrastructure and APIs",
      lead: "Mike Chen",
      focus: "Backend Systems",
      organizationId: "org-1",
    },
    {
      id: "team-3",
      name: "Team Gamma",
      description: "Data analytics and machine learning",
      lead: "Dr. Emily Rodriguez",
      focus: "Data Science",
      organizationId: "org-2",
    },
  ],
  circles: [
    {
      id: "circle-1",
      name: "UI/UX Circle",
      purpose: "Design and user experience optimization",
      responsibilities: ["User Research", "Interface Design", "Prototyping"],
      teamId: "team-1",
    },
    {
      id: "circle-2",
      name: "Frontend Circle",
      purpose: "Frontend development and implementation",
      responsibilities: ["React Development", "Component Library", "Performance"],
      teamId: "team-1",
    },
    {
      id: "circle-3",
      name: "API Circle",
      purpose: "Backend API development and maintenance",
      responsibilities: ["REST APIs", "GraphQL", "Database Design"],
      teamId: "team-2",
    },
  ],
  people: [
    {
      id: "person-1",
      name: "Alex Thompson",
      role: "Senior UX Designer",
      email: "alex.thompson@company.com",
      department: "Design",
      circleId: "circle-1",
    },
    {
      id: "person-2",
      name: "Jordan Kim",
      role: "Frontend Developer",
      email: "jordan.kim@company.com",
      department: "Engineering",
      circleId: "circle-2",
    },
    {
      id: "person-3",
      name: "Sam Wilson",
      role: "Backend Engineer",
      email: "sam.wilson@company.com",
      department: "Engineering",
      circleId: "circle-3",
    },
    {
      id: "person-4",
      name: "Casey Davis",
      role: "Product Designer",
      email: "casey.davis@company.com",
      department: "Design",
      circleId: "circle-1",
    },
  ],
}

export default function HomePage() {
  const [data, setData] = useState(initialData)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingEntity, setEditingEntity] = useState<{
    type: EntityType
    entity: any
  } | null>(null)

  console.log(data)
  useEffect(() => {
    console.log("Updated Data in HomePage:", data);
  }, [data]);

  const handleAddEntity = (type: EntityType, entityData: any) => {
    const id = `${type}-${Date.now()}`
    const newEntity = { ...entityData, id }

    setData((prev) => {
      
      const pluralType =
        type === "person" ? "people" : (`${type}s` as keyof typeof prev);
      const currentArray = (prev[pluralType] as any[]) || [];

      return {
        ...prev,
        [pluralType]: [...currentArray, newEntity],
      }
    })
  }

const handleEditEntity = (type: EntityType, entityData: any) => {
  console.log("Editing Entity:", type, entityData); // Debugging
  setData((prev) => {
   
    const pluralType =
      type === "person" ? "people" : (`${type}s` as keyof typeof prev);
    const currentArray = (prev[pluralType] as any[]) || [];

    return {
      ...prev,
      [pluralType]: currentArray.map((item) =>
        item.id === entityData.id ? entityData : item
      ),
    };
  });
};

//   entityId: string,
//   newParentId: string,
//   entityType: EntityType
// ) => {
//   console.log("yooo")
//   if (entityType === "person") {
//     console.log(
//       `Moving person with ID: ${entityId} to circle with ID: ${newParentId}`
//     );
//     setData((prev) => ({
//       ...prev,
//       people: prev.people.map((person) =>
//         person.id === entityId ? { ...person, circleId: newParentId } : person
//       ),
//     }));
//   } else if (entityType === "circle") {
//     console.log(
//       `Moving circle with ID: ${entityId} to team with ID: ${newParentId}`
//     );
//     setData((prev) => ({
//       ...prev,
//       circles: prev.circles.map((circle) =>
//         circle.id === entityId ? { ...circle, teamId: newParentId } : circle
//       ),
//     }));
//   } else if (entityType === "team") {
//     console.log(
//       `Moving team with ID: ${entityId} to organization with ID: ${newParentId}`
//     );
//     setData((prev) => ({
//       ...prev,
//       teams: prev.teams.map((team) =>
//         team.id === entityId ? { ...team, organizationId: newParentId } : team
//       ),
//     }));
//   }
// };

  const openEditModal = (type: EntityType, entity: any) => {
    setEditingEntity({ type, entity })
    setIsEditModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Organization Chart
              </h1>
              <p className="text-gray-600 mt-1">
                Visualize and manage your organizational structure
              </p>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Entity
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Organizations
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.organizations.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teams</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.teams.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Circles</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.circles.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">People</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.people.length}</div>
            </CardContent>
          </Card>
        </div>
        <Card className="relative overflow-auto w-full h-full">
          <OrganizationChart
            data={data}
            onEditEntity={openEditModal}
          />
        </Card>
      </div>

      {/* Modals */}
      <AddEntityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEntity}
        data={data}
      />

      {editingEntity && (
        <EditEntityModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingEntity(null);
          }}
          onEdit={handleEditEntity}
          entityType={editingEntity.type}
          entity={editingEntity.entity}
          data={data}
        />
      )}
    </div>
  );
}
