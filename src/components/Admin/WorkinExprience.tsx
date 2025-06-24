/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  PlusCircle, 
  Trash2, 
  Edit,
  Calendar,
  Briefcase,
  Building2,
  ExternalLink
} from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import type { Id } from '@/../convex/_generated/dataModel';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const WorkExperienceDashboard = () => {
  // Convex queries and mutations
  const addWorkExperience = useMutation(api.homePage.addWorkExperience);
  const updateWorkExperience = useMutation(api.homePage.updateWorkExperience);
  const deleteWorkExperience = useMutation(api.homePage.deleteWorkExperience);
  const workExperiences = useQuery(api.homePage.getWorkExperience) || [];
  const skills = useQuery(api.homePage.getSkills) || [];
  
  const [newWorkExperience, setNewWorkExperience] = useState<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    shortDescription: string;
    longDescription: string;
    achievements: string[];
    technologies: string[];
    companyLink: string;
  }>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    shortDescription: "",
    longDescription: "",
    achievements: [],
    technologies: [],
    companyLink: ""
  });
  
  const [newAchievement, setNewAchievement] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewWorkExperience(prev => ({ ...prev, [name]: value }));
  };

  // Add achievement
  const addAchievement = () => {
    if (newAchievement.trim()) {
      setNewWorkExperience(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement]
      }));
      setNewAchievement("");
    }
  };

  // Remove achievement
  const removeAchievement = (index: number) => {
    setNewWorkExperience(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  // Add technology from skills
  const addTechnology = () => {
    if (selectedSkill && !newWorkExperience.technologies.includes(selectedSkill)) {
      setNewWorkExperience(prev => ({
        ...prev,
        technologies: [...prev.technologies, selectedSkill]
      }));
      setSelectedSkill("");
    }
  };

  // Remove technology
  const removeTechnology = (index: number) => {
    setNewWorkExperience(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  // Get skill image by name
  const getSkillImage = (skillName: string) => {
    const skill = skills.find(s => s.name === skillName);
    return skill?.image || null;
  };

  // Submit work experience
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty achievements and technologies
    const filteredData = {
      ...newWorkExperience,
      achievements: newWorkExperience.achievements.filter(achievement => achievement.trim() !== ""),
      technologies: newWorkExperience.technologies.filter(tech => tech.trim() !== "")
    };
    
    try {
      if (editingId !== null) {
        await updateWorkExperience({
          id: editingId as Id<'workExperience'>,
          ...filteredData
        });
        toast.success('Work experience updated successfully!');
      } else {
        await addWorkExperience(filteredData);
        toast.success('Work experience added successfully!');
      }
      
      // Reset form
      setNewWorkExperience({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        shortDescription: "",
        longDescription: "",
        achievements: [],
        technologies: [],
        companyLink: ""
      });
      
      setNewAchievement("");
      setSelectedSkill("");
      setEditingId(null);
    } catch (error) {
      console.error('Failed to save work experience:', error);
      toast.error('Failed to save work experience.');
    }
  };

  // Edit existing experience
  const handleEdit = (experience: any) => {
    setNewWorkExperience({
      company: experience.company,
      position: experience.position,
      startDate: experience.startDate,
      endDate: experience.endDate || "",
      shortDescription: experience.shortDescription,
      longDescription: experience.longDescription,
      achievements: experience.achievements,
      technologies: experience.technologies,
      companyLink: experience.companyLink || ""
    });
    setEditingId(experience._id);
  };

  // Delete experience
  const handleDelete = async (id: string) => {
    try {
      await deleteWorkExperience({ id: id as Id<'workExperience'> });
      toast.success('Work experience deleted successfully!');
      
      if (editingId === id) {
        setEditingId(null);
        setNewWorkExperience({
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          shortDescription: "",
          longDescription: "",
          achievements: [],
          technologies: [],
          companyLink: ""
        });
      }
    } catch (error) {
      console.error('Failed to delete work experience:', error);
      toast.error('Failed to delete work experience.');
    }
  };


  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };


  const calculateDuration = (start: string, end: string | null) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    return `${years > 0 ? `${years} yr${years > 1 ? 's' : ''} ` : ''}${remainingMonths > 0 ? `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}` : ''}`;
  };

  return (
    <div className="h-full dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950bg-gradient-to-br from-indigo-50 dark:bg-gray-800 text-gray-900 dark:text-white p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Work Experience</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your professional work history and accomplishments
              </p>
            </div>
          </div>
        </header>
        
        <div className="flex flex-wrap gap-8">
          {/* Form Section */}
          <Card className="dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 flex-1 lg:w-1/2 max-h-max bg-gradient-to-br from-indigo-50 p-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                {editingId ? (
                  <>
                    <Edit className="h-5 w-5 mr-2" />
                    Edit Work Experience
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add New Experience
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {editingId 
                  ? "Update your work experience details" 
                  : "Add your professional work experience"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    value={newWorkExperience.company}
                    onChange={handleInputChange}
                    placeholder="e.g., Google"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    name="position"
                    value={newWorkExperience.position}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior Designer"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyLink">Company Website</Label>
                  <Input
                    id="companyLink"
                    name="companyLink"
                    value={newWorkExperience.companyLink}
                    onChange={handleInputChange}
                    placeholder="e.g., https://company.com"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <div className="relative">
                      <Input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={newWorkExperience.startDate}
                        onChange={handleInputChange}
                        required
                      />
                      <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <div className="relative">
                      <Input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={newWorkExperience.endDate}
                        onChange={handleInputChange}
                        placeholder="Present"
                      />
                      <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Textarea
                    id="shortDescription"
                    name="shortDescription"
                    value={newWorkExperience.shortDescription}
                    onChange={handleInputChange}
                    placeholder="Brief description for collapsed view..."
                    rows={2}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="longDescription">Long Description</Label>
                  <Textarea
                    id="longDescription"
                    name="longDescription"
                    value={newWorkExperience.longDescription}
                    onChange={handleInputChange}
                    placeholder="Detailed description for expanded view..."
                    rows={3}
                    required
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>Achievements</Label>
                    <div className="space-y-2 mt-2">
                      {newWorkExperience.achievements.map((achievement, index) => (
                        achievement && (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={achievement}
                              onChange={(e) => {
                                const updatedAchievements = [...newWorkExperience.achievements];
                                updatedAchievements[index] = e.target.value;
                                setNewWorkExperience(prev => ({
                                  ...prev,
                                  achievements: updatedAchievements
                                }));
                              }}
                              placeholder="Achievement"
                            />
                            <Button 
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeAchievement(index)}
                              className='bg-gray-400 dark:bg-gray-700'
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      ))}
                      <div className="flex items-center gap-2">
                        <Input
                          value={newAchievement}
                          onChange={(e) => setNewAchievement(e.target.value)}
                          placeholder="Add new achievement"
                        />
                        <Button 
                          type="button"
                          onClick={addAchievement}
                          className='bg-gray-400 dark:bg-gray-700'
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Technologies</Label>
                    <div className="space-y-2 mt-2">
                      {newWorkExperience.technologies.map((tech, index) => (
                        tech && (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={tech}
                              onChange={(e) => {
                                const updatedTechs = [...newWorkExperience.technologies];
                                updatedTechs[index] = e.target.value;
                                setNewWorkExperience(prev => ({
                                  ...prev,
                                  technologies: updatedTechs
                                }));
                              }}
                              placeholder="Technology"
                            />
                            <Button 
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeTechnology(index)}
                              className='bg-gray-400 dark:bg-gray-700'
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      ))}
                      <div className="flex items-center gap-2">
                        <Select
                          value={selectedSkill}
                          onValueChange={setSelectedSkill}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select skill" />
                          </SelectTrigger>
                          <SelectContent>
                            {skills.map((skill) => (
                              <SelectItem key={skill.name} value={skill.name}>
                                {skill.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          type="button"
                          onClick={addTechnology}
                          className='bg-gray-400 dark:bg-gray-700'
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  {editingId && (
                    <Button 
                      type="button"
                      variant="outline"
                      className="mr-2"
                      onClick={() => {
                        setEditingId(null);
                        setNewWorkExperience({
                          company: "",
                          position: "",
                          startDate: "",
                          endDate: "",
                          shortDescription: "",
                          longDescription: "",
                          achievements: [],
                          technologies: [],
                          companyLink: ""
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button type="submit" className='bg-gray-700 text-white hover:bg-gray-800 duration-500 ease-in-out transition'>
                    {editingId ? "Update Experience" : "Add Experience"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* List Section */}
          <div className='flex-1 lg:w-1/2 max-h-max dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-gradient-to-br from-indigo-50 dark:bg-gray-700 p-4'>
            <Card className="dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950">
              <CardHeader>
                <CardTitle>Work History</CardTitle>
                <CardDescription>
                  {workExperiences.length} professional experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                {workExperiences.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                      No work experience yet
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Add your professional experiences to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {workExperiences.map(experience => (
                      <Card 
                        key={experience._id} 
                        className={`relative overflow-hidden dark:bg-gray-700 ${
                          editingId === experience._id 
                            ? "ring-2 ring-gray-500" 
                            : ""
                        }`}
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <Building2 className="h-5 w-5 mr-2 text-blue-500" />
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {experience.company}
                                  </h3>
                                  {experience.companyLink && (
                                    <a 
                                      href={experience.companyLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center text-sm text-blue-500 hover:underline"
                                    >
                                      {experience.companyLink}
                                      <ExternalLink className="ml-1" size={14} />
                                    </a>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-3">
                                <p className="font-medium text-lg">
                                  {experience.position}
                                </p>
                                
                                <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-300">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                                  <span className="mx-2">•</span>
                                  <span>{calculateDuration(experience.startDate, experience.endDate)}</span>
                                </div>
                                
                                <p className="mt-3 text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm md:text-base">
                                  {experience.shortDescription}
                                </p>
                                
                                <div className="mt-3">
                                  <p className="font-medium text-gray-900 dark:text-white">Long Description:</p>
                                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm md:text-base">
                                    {experience.longDescription}
                                  </p>
                                </div>
                                
                                {experience.achievements.length > 0 && (
                                  <div className="mt-3">
                                    <p className="font-medium text-gray-900 dark:text-white">Key Achievements:</p>
                                    <ul className="mt-1 list-disc pl-5 space-y-1">
                                      {experience.achievements.map((achievement, index) => (
                                        <li key={index} className="text-gray-700 dark:text-gray-300">
                                          {achievement}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {experience.technologies.length > 0 && (
                                  <div className="mt-4">
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Technologies Used</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {experience.technologies.map((tech, idx) => {
                                        const skillImage = getSkillImage(tech);
                                        return (
                                          <Badge 
                                            key={idx}
                                            variant="outline"
                                            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 flex items-center gap-1"
                                          >
                                            {skillImage && (
                                              <img 
                                                src={skillImage} 
                                                alt={tech} 
                                                className="w-4 h-4 object-contain"
                                              />
                                            )}
                                            {tech}
                                          </Badge>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleEdit(experience)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => handleDelete(experience._id)}
                              >
                                <Trash2 className="h-4 w-4 text-[#121212] dark:text-[#E0E0E0]" />
                              </Button>
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
              <Card className="dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950">
                <CardHeader>
                  <CardTitle>Experience Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gradient-to-br from-indigo-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Total Experience
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Combined duration of all positions
                          </p>
                        </div>
                        <div className="text-2xl font-bold">
                          {workExperiences.reduce((total, exp) => {
                            const start = new Date(exp.startDate);
                            const end = exp.endDate ? new Date(exp.endDate) : new Date();
                            const months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
                            return total + months;
                          }, 0) / 12 >= 1 ? 
                            `${Math.floor(workExperiences.reduce((total, exp) => {
                              const start = new Date(exp.startDate);
                              const end = exp.endDate ? new Date(exp.endDate) : new Date();
                              const months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
                              return total + months;
                            }, 0) / 12)} years` : 
                            `${workExperiences.reduce((total, exp) => {
                              const start = new Date(exp.startDate);
                              const end = exp.endDate ? new Date(exp.endDate) : new Date();
                              const months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
                              return total + months;
                            }, 0)} months`}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-indigo-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center">
                        <Briefcase className="h-8 w-8 text-blue-500 mb-2" />
                        <span className="text-2xl font-bold">{workExperiences.length}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Positions</span>
                      </div>
                      
                      <div className="bg-gradient-to-br from-indigo-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center">
                        <Building2 className="h-8 w-8 text-green-500 mb-2" />
                        <span className="text-2xl font-bold">
                          {new Set(workExperiences.map(exp => exp.company)).size}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Companies</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkExperienceDashboard;