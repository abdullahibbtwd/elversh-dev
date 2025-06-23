/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  PlusCircle, 
  Trash2, 
  Edit,
  ChevronDown,
  ChevronUp,
  X,
  ZoomIn,
  MoveLeft,
  MoveRight,
  ExternalLink,
  Github,
  Image as ImageIcon,
  Calendar,
} from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from '@/app/context/ThemeContext';
import { useMutation, useAction, useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import type { Id } from '@/../convex/_generated/dataModel';
import { toast } from 'sonner';

// Place this at the top level of your file
type ProjectImageProps = {
  storageId: Id<'_storage'>;
  alt?: string;
  [key: string]: any;
};
const ProjectImage = ({ storageId, alt, ...props }: ProjectImageProps) => {
  const url = useQuery(api.files.getFileUrl, storageId ? { storageId } : 'skip');
  if (!url) return <div className="bg-gray-200 w-full h-full" />; // fallback
  return <img src={url} alt={alt} {...props} />;
};

const ProjectsAdminDashboard = () => {
  const { isDark } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addProject = useMutation(api.homePage.addProject);
  const updateProject = useMutation(api.homePage.updateProject);
  const deleteProject = useMutation(api.homePage.deleteProject);
  const generateUploadUrl = useAction(api.files.generateUploadUrl);
  const projects = useQuery(api.homePage.getProjects) || [];
  const skills = useQuery(api.homePage.getSkills) || [];
  
  const [newProject, setNewProject] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    techIcons: [] as string[],
    images: [] as File[],
    githubLink: "",
    liveLink: ""
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentProject, setCurrentProject] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  // Get available tech options from skills database
  const techOptions = skills.map(skill => skill.name);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setNewProject(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));
    }
  };

  // Remove an image
  const removeImage = (index: number) => {
    const updatedImages = [...newProject.images];
    updatedImages.splice(index, 1);
    setNewProject(prev => ({ ...prev, images: updatedImages }));
  };

  // Trigger file input
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Toggle tech icon selection
  const toggleTechIcon = (icon: string) => {
    setNewProject(prev => {
      const techIcons = [...prev.techIcons];
      const index = techIcons.indexOf(icon);
      
      if (index > -1) {
        techIcons.splice(index, 1);
      } else {
        techIcons.push(icon);
      }
      
      return { ...prev, techIcons };
    });
  };

  // Helper to upload a file to Convex storage
  const uploadFile = async (file: File): Promise<Id<'_storage'>> => {
    const url = await generateUploadUrl();
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    const { storageId } = await response.json();
    return storageId as Id<'_storage'>;
  };

  // Submit new project to Convex
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Upload images and get storage IDs
      let imageIds: Id<'_storage'>[] = [];
      if (newProject.images && newProject.images.length > 0) {
        imageIds = await Promise.all(
          newProject.images.map(async (file) => {
            if (file instanceof File) {
              return await uploadFile(file);
            }
            return file; // fallback if already an ID
          })
        );
      }
      await addProject({
        title: newProject.title,
        shortDescription: newProject.shortDescription,
        longDescription: newProject.longDescription,
        techIcons: newProject.techIcons,
        images: imageIds,
        githubLink: newProject.githubLink,
        liveLink: newProject.liveLink,
      });
      toast.success('Project added successfully!');
      setNewProject({
        title: "",
        shortDescription: "",
        longDescription: "",
        techIcons: [],
        images: [],
        githubLink: "",
        liveLink: ""
      });
      setEditingId(null);
    } catch (error) {
      console.error('Failed to save project:', error);
      toast.error('Failed to save project.');
    }
  };

  // Edit existing project
  const handleEdit = (project: any) => {
    setNewProject({
      ...project,
      images: [] // Reset images when editing since we can't convert storage IDs back to Files
    });
    setEditingId(project._id); // Use Convex _id
  };

  // Delete project
  const handleDelete = async (id: string) => {
    try {
      await deleteProject({ id: id as Id<'projects'> });
      toast.success('Project deleted successfully!');
      if (editingId === id) {
        setEditingId(null);
        setNewProject({
          title: "",
          shortDescription: "",
          longDescription: "",
          techIcons: [],
          images: [],
          githubLink: "",
          liveLink: ""
        });
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project.');
    }
  };

  // Open lightbox for project images
  const openLightbox = (projectIndex: number, imageIndex: number = 0) => {
    setCurrentProject(projectIndex);
    setLightboxIndex(imageIndex);
    setLightboxOpen(true);
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Navigate lightbox images
  const navigateImage = (direction: 'prev' | 'next') => {
    const projectImages = projects[currentProject].images;
    if (direction === 'next') {
      setLightboxIndex((prev) => (prev + 1) % projectImages.length);
    } else {
      setLightboxIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? "bg-[#0e0e0e] text-gray-100" 
        : "bg-gradient-to-br from-indigo-50 to-teal-50 text-gray-800"
    } p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Project <span className="text-blue-500">Management</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage portfolio projects displayed on your website
            </p>
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className={`rounded-2xl overflow-hidden transition-all duration-300 ${
            isDark 
              ? "bg-gray-900 border border-gray-800" 
              : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center">
                {editingId ? (
                  <>
                    <Edit className="h-5 w-5 mr-2" />
                    Edit Project
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add New Project
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {editingId 
                  ? "Update the selected project" 
                  : "Add a new project to your portfolio"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newProject.title}
                    onChange={handleInputChange}
                    placeholder="e.g., E-commerce Platform"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Input
                    id="shortDescription"
                    name="shortDescription"
                    value={newProject.shortDescription}
                    onChange={handleInputChange}
                    placeholder="Brief project summary"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="longDescription">Full Description</Label>
                  <Textarea
                    id="longDescription"
                    name="longDescription"
                    value={newProject.longDescription}
                    onChange={handleInputChange}
                    placeholder="Detailed project description..."
                    rows={4}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="githubLink">GitHub Link</Label>
                    <Input
                      id="githubLink"
                      name="githubLink"
                      value={newProject.githubLink}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="liveLink">Live Demo Link</Label>
                    <Input
                      id="liveLink"
                      name="liveLink"
                      value={newProject.liveLink}
                      onChange={handleInputChange}
                      placeholder="https://project-demo.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Project Images</Label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                      multiple
                      accept="image/*"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={triggerFileInput}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Upload Images
                    </Button>
                  </div>
                  
                  {newProject.images.length > 0 && (
                    <div className="pt-4">
                      <Label>Image Previews</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newProject.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="bg-gray-100 dark:bg-gray-700 w-24 h-24 rounded-md overflow-hidden">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button 
                              size="icon" 
                              variant="destructive" 
                              className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
                              onClick={(e) => {
                                e.preventDefault();
                                removeImage(index);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4 mt-6">
                  <Label>Technologies Used</Label>
                  <div className="flex flex-wrap gap-2">
                    {techOptions.map(tech => (
                      <Button
                        key={tech}
                        type="button"
                        variant={newProject.techIcons.includes(tech) ? "default" : "outline"}
                        className="capitalize"
                        onClick={() => toggleTechIcon(tech)}
                      >
                        {tech.replace(/-/g, ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end pt-6">
                  {editingId && (
                    <Button 
                      type="button"
                      variant="outline"
                      className="mr-2"
                      onClick={() => {
                        setEditingId(null);
                        setNewProject({
                          title: "",
                          shortDescription: "",
                          longDescription: "",
                          techIcons: [],
                          images: [],
                          githubLink: "",
                          liveLink: ""
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button type="submit">
                    {editingId ? "Update Project" : "Add Project"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Projects Preview */}
          <div>
            <Card className={`rounded-2xl overflow-hidden transition-all duration-300 ${
              isDark 
                ? "bg-gray-900 border border-gray-800" 
                : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
            }`}>
              <CardHeader>
                <CardTitle>Projects Preview</CardTitle>
                <CardDescription>
                  {projects.length} projects in your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                      No projects yet
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Add your first project to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {projects.map((project, index) => (
                      <Card 
                        key={project._id} 
                        className={`relative overflow-hidden rounded-2xl transition-all duration-300 group ${
                          isDark 
                            ? "bg-gray-900 border border-gray-800" 
                            : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
                        } ${editingId === project._id ? "ring-2 ring-blue-500" : ""}`}
                      >
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            {/* Images Section */}
                            <div className={`md:w-1/2 p-6 ${isDark ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-purple-50"}`}>
                              {project.images.length > 0 ? (
                                <>
                                  <div 
                                    className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer mb-4 transition-all duration-300 transform hover:scale-[1.02] ${
                                      isDark ? "border border-gray-800" : "border border-gray-200"
                                    }`}
                                    onClick={() => openLightbox(index, 0)}
                                  >
                                    <ProjectImage
                                      storageId={project.images[0]}
                                      alt={project.title}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <div className="bg-black/40 p-2 rounded-full">
                                        <ZoomIn className="text-white" size={24} />
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4">
                                    <h4 className="font-medium mb-2 text-sm text-gray-500">More images:</h4>
                                    <div className="flex gap-3 overflow-x-auto py-2">
                                      {project.images.map((img, imgIndex) => (
                                        <div 
                                          key={imgIndex}
                                          className={`relative w-20 h-16 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                                            imgIndex === 0 
                                              ? "ring-2 ring-blue-500 scale-105" 
                                              : "opacity-80 hover:opacity-100"
                                          }`}
                                          onClick={() => openLightbox(index, imgIndex)}
                                        >
                                          <ProjectImage
                                            storageId={img}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                          />
                                          {imgIndex === 0 && (
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-2 h-2 rounded-full"></div>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="aspect-video flex items-center justify-center bg-gray-200 border-2 border-dashed rounded-xl">
                                  <ImageIcon className="h-12 w-12 text-gray-400" />
                                </div>
                              )}
                            </div>
                            
                            {/* Details Section */}
                            <div className="md:w-1/2 p-6">
                              <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-bold group-hover:text-blue-500 transition-colors">
                                  {project.title}
                                </h3>
                                <div className="flex space-x-3">
                                  <a 
                                    href={project.githubLink} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-2 rounded-full ${
                                      isDark 
                                        ? "bg-gray-800 hover:bg-gray-700" 
                                        : "bg-blue-100 hover:bg-blue-200"
                                    } transition-colors`}
                                    aria-label="View on GitHub"
                                  >
                                    <Github size={20} />
                                  </a>
                                  <a 
                                    href={project.liveLink} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-2 rounded-full ${
                                      isDark 
                                        ? "bg-gray-800 hover:bg-gray-700" 
                                        : "bg-blue-100 hover:bg-blue-200"
                                    } transition-colors`}
                                    aria-label="View live project"
                                  >
                                    <ExternalLink size={20} />
                                  </a>
                                </div>
                              </div>
                              
                              <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                                {project.shortDescription}
                              </p>
                              
                              <div className="mt-6">
                                <h4 className="font-medium mb-3 text-sm uppercase tracking-wider text-blue-500">
                                  Technologies Used
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                  {project.techIcons.map((techName, idx) => {
                                    const skill = skills.find(s => s.name === techName);
                                    return (
                                      <div 
                                        key={idx}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center p-2 ${
                                          isDark ? "bg-gray-800" : "bg-blue-100"
                                        }`}
                                        title={techName}
                                      >
                                        {skill && skill.image ? (
                                          <img 
                                            src={skill.image} 
                                            alt={techName}
                                            className="w-6 h-6 object-contain"
                                          />
                                        ) : (
                                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-6 h-6" />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              
                              <div className="flex justify-between mt-8">
                                <Button 
                                  variant="outline"
                                  onClick={() => handleEdit(project)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                                <Button 
                                  variant="destructive"
                                  onClick={() => handleDelete(project._id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Stats Section */}
            <div className="mt-6">
              <Card className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                isDark 
                  ? "bg-gray-900 border border-gray-800" 
                  : "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
              }`}>
                <CardHeader>
                  <CardTitle>Projects Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`rounded-lg p-4 flex flex-col items-center ${
                      isDark ? "bg-gray-800" : "bg-gradient-to-br from-blue-50 to-purple-50"
                    }`}>
                      <span className="text-3xl font-bold">{projects.length}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Projects</span>
                    </div>
                    
                    <div className={`rounded-lg p-4 flex flex-col items-center ${
                      isDark ? "bg-gray-800" : "bg-gradient-to-br from-blue-50 to-purple-50"
                    }`}>
                      <span className="text-3xl font-bold">
                        {projects.reduce((total, project) => total + project.images.length, 0)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Images</span>
                    </div>
                    
                    <div className={`rounded-lg p-4 flex flex-col items-center ${
                      isDark ? "bg-gray-800" : "bg-gradient-to-br from-blue-50 to-purple-50"
                    }`}>
                      <span className="text-3xl font-bold">
                        {techOptions.length}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Available Technologies</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && projects[currentProject].images.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div 
            className="max-w-6xl w-full max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X size={32} />
            </button>
            
            <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden">
              <ProjectImage
                storageId={projects[currentProject].images[lightboxIndex]}
                alt={projects[currentProject].title}
                className="w-full h-full object-contain"
              />
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Previous image"
              >
                <MoveLeft size={28} />
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Next image"
              >
                <MoveRight size={28} />
              </button>
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                {lightboxIndex + 1} / {projects[currentProject].images.length}
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex gap-2 justify-center overflow-x-auto py-2 max-w-full">
                {projects[currentProject].images.map((img, idx) => (
                  <div 
                    key={idx}
                    className={`relative w-20 h-16 rounded cursor-pointer transition-all ${
                      lightboxIndex === idx ? "ring-2 ring-blue-500 scale-105" : "opacity-70"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(idx);
                    }}
                  >
                    <ProjectImage
                      storageId={img}
                      alt={projects[currentProject].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsAdminDashboard;