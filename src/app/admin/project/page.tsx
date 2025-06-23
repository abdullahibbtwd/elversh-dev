// /* eslint-disable @next/next/no-img-element */
// "use client"
// import React, { useState} from 'react';
// import { 
//   Card, 
//   CardContent, 
//   CardHeader, 
//   CardTitle, 
//   CardDescription,
//   CardFooter
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { 
//   PlusCircle, 
//   Trash2, 
 
//   Edit,
//   Image as ImageIcon,
//   Calendar,
 
// } from 'lucide-react';
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,

//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const ProjectsAdminDashboard = () => {
  
//   // Mock skills data - in a real app this would come from your skills section
//   const skills = [
//     { id: 1, name: "React" },
//     { id: 2, name: "TypeScript" },
//     { id: 3, name: "Node.js" },
//     { id: 4, name: "MongoDB" },
//     { id: 5, name: "Tailwind CSS" },
//     { id: 6, name: "GraphQL" },
//     { id: 7, name: "AWS" },
//     { id: 8, name: "Docker" },
//   ];
  
//   const [projects, setProjects] = useState([
//     {
//       id: 1,
//       title: "E-commerce Platform",
//       description: "A full-featured online shopping platform with payment integration and inventory management.",
//       duration: "3 months",
//       skills: [1, 2, 5],
//       images: [
//         "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=500",
//         "https://images.unsplash.com/photo-1556742205-e10c9486e506?q=80&w=500"
//       ]
//     },
//     {
//       id: 2,
//       title: "Health Tracking App",
//       description: "Mobile application for tracking fitness metrics and health data with personalized insights.",
//       duration: "5 months",
//       skills: [1, 3, 4, 6],
//       images: [
//         "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=500",
//         "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500"
//       ]
//     },
//     {
//       id: 3,
//       title: "Portfolio Website",
//       description: "Modern portfolio website showcasing projects and skills with responsive design.",
//       duration: "1 month",
//       skills: [1, 2, 5],
//       images: [
//         "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=500"
//       ]
//     }
//   ]);
  
//   const [newProject, setNewProject] = useState({
//     title: "",
//     description: "",
//     duration: "",
//     skills: [] as number[],
//     images: [""]
//   });
  
//   const [editingId, setEditingId] = useState<number | null>(null);


//   // Handle form input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setNewProject(prev => ({ ...prev, [name]: value }));
//   };

//   // Handle image URL changes
//   const handleImageChange = (index: number, value: string) => {
//     const updatedImages = [...newProject.images];
//     updatedImages[index] = value;
//     setNewProject(prev => ({ ...prev, images: updatedImages }));
//   };

//   // Add a new image input
//   const addImageInput = () => {
//     setNewProject(prev => ({ ...prev, images: [...prev.images, ""] }));
//   };

//   // Remove an image input
//   const removeImageInput = (index: number) => {
//     if (newProject.images.length > 1) {
//       const updatedImages = [...newProject.images];
//       updatedImages.splice(index, 1);
//       setNewProject(prev => ({ ...prev, images: updatedImages }));
//     }
//   };

//   // Toggle skill selection
//   const toggleSkill = (skillId: number) => {
//     setNewProject(prev => {
//       const skills = [...prev.skills];
//       const index = skills.indexOf(skillId);
      
//       if (index > -1) {
//         skills.splice(index, 1);
//       } else {
//         skills.push(skillId);
//       }
      
//       return { ...prev, skills };
//     });
//   };

//   // Submit new project
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (editingId !== null) {
//       // Update existing project
//       setProjects(prev => 
//         prev.map(project => 
//           project.id === editingId ? { ...newProject, id: editingId } : project
//         )
//       );
//       setEditingId(null);
//     } else {
//       // Add new project
//       const projectToAdd = {
//         ...newProject,
//         id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1
//       };
//       setProjects(prev => [...prev, projectToAdd]);
//     }
    
//     // Reset form
//     setNewProject({
//       title: "",
//       description: "",
//       duration: "",
//       skills: [],
//       images: [""]
//     });
//   };

//   // Edit existing project
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const handleEdit = (project: any) => {
//     setNewProject(project);
//     setEditingId(project.id);
//   };

//   // Delete project
//   const handleDelete = (id: number) => {
//     setProjects(prev => prev.filter(project => project.id !== id));
//     if (editingId === id) {
//       setEditingId(null);
//       setNewProject({
//         title: "",
//         description: "",
//         duration: "",
//         skills: [],
//         images: [""]
//       });
//     }
//   };

//   // Get skill names by IDs
//   const getSkillNames = (skillIds: number[]) => {
//     return skillIds.map(id => {
//       const skill = skills.find(s => s.id === id);
//       return skill ? skill.name : "";
//     }).filter(name => name !== "");
//   };

//   return (
//     <div className="min-h-screen bg-[#E0E0E0] dark:bg-[#121212] text-[#121212] dark:text-[#E0E0E0] p-6 transition-colors duration-300">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <header className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Project Management</h1>
//             <p className="text-gray-600 dark:text-gray-400 mt-2">
//               Manage your portfolio projects and showcase your work
//             </p>
//           </div>
          
         
//         </header>
        
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Form Section */}
//           <Card className="dark:bg-gray-800">
//             <CardHeader>
//               <CardTitle className="flex items-center">
//                 {editingId ? (
//                   <>
//                     <Edit className="h-5 w-5 mr-2" />
//                     Edit Project
//                   </>
//                 ) : (
//                   <>
//                     <PlusCircle className="h-5 w-5 mr-2" />
//                     Add New Project
//                   </>
//                 )}
//               </CardTitle>
//               <CardDescription>
//                 {editingId 
//                   ? "Update the selected project" 
//                   : "Add a new project to your portfolio"}
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="title">Project Title</Label>
//                   <Input
//                     id="title"
//                     name="title"
//                     value={newProject.title}
//                     onChange={handleInputChange}
//                     placeholder="e.g., E-commerce Platform"
//                     required
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea
//                     id="description"
//                     name="description"
//                     value={newProject.description}
//                     onChange={handleInputChange}
//                     placeholder="Describe your project..."
//                     rows={4}
//                     required
//                   />
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="duration">Duration</Label>
//                     <div className="relative">
//                       <Input
//                         id="duration"
//                         name="duration"
//                         value={newProject.duration}
//                         onChange={handleInputChange}
//                         placeholder="e.g., 3 months"
//                         required
//                       />
//                       <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
//                     </div>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label>Skills Used</Label>
//                     <Select>
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Select skills" />
//                       </SelectTrigger>
//                       <SelectContent className="dark:bg-gray-800">
//                         <div className="p-2">
//                           <p className="text-sm text-gray-500 px-2 py-1">Select technologies used</p>
//                           <div className="grid grid-cols-2 gap-2 mt-2">
//                             {skills.map(skill => (
//                               <Button
//                                 key={skill.id}
//                                 type="button"
//                                 variant={newProject.skills.includes(skill.id) ? "default" : "outline"}
//                                 className="h-8 text-xs"
//                                 onClick={() => toggleSkill(skill.id)}
//                               >
//                                 {skill.name}
//                               </Button>
//                             ))}
//                           </div>
//                         </div>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
                
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <Label>Project Images</Label>
//                     <Button 
//                       type="button" 
//                       variant="outline" 
//                       size="sm"
//                       onClick={addImageInput}
//                     >
//                       <PlusCircle className="h-4 w-4 mr-2" />
//                       Add Image
//                     </Button>
//                   </div>
                  
//                   {newProject.images.map((image, index) => (
//                     <div key={index} className="flex items-center space-x-2">
//                       <Input
//                         value={image}
//                         onChange={(e) => handleImageChange(index, e.target.value)}
//                         placeholder={`https://example.com/project-image-${index + 1}.jpg`}
//                       />
//                       <Button
//                         type="button"
//                         variant="destructive"
//                         size="icon"
//                         onClick={() => removeImageInput(index)}
//                         disabled={newProject.images.length <= 1}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
                
//                 {newProject.images.some(img => img) && (
//                   <div className="pt-4">
//                     <Label>Image Previews</Label>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {newProject.images.filter(img => img).map((img, index) => (
//                         <div key={index} className="relative group">
//                           <div className="bg-gray-100 dark:bg-gray-700 w-24 h-24 rounded-md overflow-hidden">
//                             <img 
//                               src={img} 
//                               alt={`Preview ${index}`} 
//                               className="w-full h-full object-cover"
//                               onError={(e) => {
//                                 const target = e.target as HTMLImageElement;
//                                 target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpath d='M21 15l-5-5L5 21'%3E%3C/path%3E%3C/svg%3E";
//                               }}
//                             />
//                           </div>
//                           <Button 
//                             size="icon" 
//                             variant="destructive" 
//                             className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
//                             onClick={() => removeImageInput(index)}
//                           >
//                             <Trash2 className="h-3 w-3" />
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
                
//                 <div className="flex justify-end pt-4">
//                   {editingId && (
//                     <Button 
//                       type="button"
//                       variant="outline"
//                       className="mr-2"
//                       onClick={() => {
//                         setEditingId(null);
//                         setNewProject({
//                           title: "",
//                           description: "",
//                           duration: "",
//                           skills: [],
//                           images: [""]
//                         });
//                       }}
//                     >
//                       Cancel
//                     </Button>
//                   )}
//                   <Button type="submit">
//                     {editingId ? "Update Project" : "Add Project"}
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
          
//           {/* Projects List */}
//           <div>
//             <Card className="dark:bg-gray-800">
//               <CardHeader>
//                 <CardTitle>Your Projects</CardTitle>
//                 <CardDescription>
//                   {projects.length} projects in your portfolio
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {projects.length === 0 ? (
//                   <div className="text-center py-12">
//                     <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
//                     <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
//                       No projects yet
//                     </h3>
//                     <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
//                       Add your first project to get started
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="space-y-6">
//                     {projects.map(project => (
//                       <Card 
//                         key={project.id} 
//                         className={`relative overflow-hidden dark:bg-gray-700 ${
//                           editingId === project.id ? "ring-2 ring-blue-500" : ""
//                         }`}
//                       >
//                         <CardContent className="p-0">
//                           <div className="flex flex-col md:flex-row">
//                             <div className="md:w-2/5 h-48 md:h-auto">
//                               {project.images.length > 0 ? (
//                                 <img 
//                                   src={project.images[0]} 
//                                   alt={project.title} 
//                                   className="w-full h-full object-cover"
//                                 />
//                               ) : (
//                                 <div className="bg-gray-200 dark:bg-gray-600 w-full h-full flex items-center justify-center">
//                                   <ImageIcon className="h-12 w-12 text-gray-400" />
//                                 </div>
//                               )}
//                             </div>
                            
//                             <div className="p-6 md:w-3/5">
//                               <div className="flex justify-between items-start">
//                                 <div>
//                                   <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//                                     {project.title}
//                                   </h3>
//                                   <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300">
//                                     <Calendar className="h-4 w-4 mr-1" />
//                                     {project.duration}
//                                   </div>
//                                 </div>
                                
//                                 <div className="flex space-x-2">
//                                   <Button 
//                                     variant="outline" 
//                                     size="icon"
//                                     onClick={() => handleEdit(project)}
//                                   >
//                                     <Edit className="h-4 w-4" />
//                                   </Button>
//                                   <Button 
//                                     variant="destructive" 
//                                     size="icon"
//                                     onClick={() => handleDelete(project.id)}
//                                   >
//                                     <Trash2 className="h-4 w-4" />
//                                   </Button>
//                                 </div>
//                               </div>
                              
//                               <p className="mt-3 text-gray-700 dark:text-gray-300">
//                                 {project.description}
//                               </p>
                              
//                               <div className="mt-4">
//                                 <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
//                                   Technologies Used:
//                                 </h4>
//                                 <div className="flex flex-wrap gap-2">
//                                   {getSkillNames(project.skills).map((skill, index) => (
//                                     <span 
//                                       key={index}
//                                       className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
//                                     >
//                                       {skill}
//                                     </span>
//                                   ))}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </CardContent>
//                         <CardFooter className="bg-gray-50 dark:bg-gray-600/30 p-3 justify-end">
//                           <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
//                             <ImageIcon className="h-3 w-3" />
//                             <span>{project.images.length} image{project.images.length !== 1 ? 's' : ''}</span>
//                           </div>
//                         </CardFooter>
//                       </Card>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
            
//             {/* Stats Section */}
//             <div className="mt-6">
//               <Card className="dark:bg-gray-800">
//                 <CardHeader>
//                   <CardTitle>Projects Overview</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="bg-white dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center">
//                       <span className="text-3xl font-bold">{projects.length}</span>
//                       <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Projects</span>
//                     </div>
                    
//                     <div className="bg-white dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center">
//                       <span className="text-3xl font-bold">
//                         {projects.length > 0 
//                           ? (projects.reduce((sum, project) => {
//                               // Extract numeric value from duration string
//                               const match = project.duration.match(/\d+/);
//                               return sum + (match ? parseInt(match[0]) : 0);
//                             }, 0) / projects.length).toFixed(1) 
//                           : '0.0'}
//                       </span>
//                       <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Avg. Duration (months)</span>
//                     </div>
                    
//                     <div className="bg-white dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center">
//                       <span className="text-3xl font-bold">
//                         {skills.length}
//                       </span>
//                       <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Technologies Used</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectsAdminDashboard;


import ProjectsAdminDashboard from '@/components/Admin/Project'
import React from 'react'

const page = () => {
  return (
    <div>
      <ProjectsAdminDashboard/>
    </div>
  )
}

export default page
