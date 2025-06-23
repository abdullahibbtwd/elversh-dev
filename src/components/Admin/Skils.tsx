/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  PlusCircle, 
  Trash2,
  Edit,
  Image as ImageIcon
} from 'lucide-react';
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SkillsAdminDashboard = () => {
  const addSkill = useMutation(api.homePage.addSkill);
  const updateSkill = useMutation(api.homePage.updateSkill);
  const deleteSkill = useMutation(api.homePage.deleteSkill);
  const skills = useQuery(api.homePage.getSkills) || [];
  
  const [newSkill, setNewSkill] = useState({
    name: "",
    years: "",
    image: "",
    category: ""
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);



  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSkill(prev => ({ ...prev, [name]: value }));
  };

  // Submit new skill
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        await updateSkill({
          id: editingId as Id<'skills'>,
          name: newSkill.name,
          years: parseInt(newSkill.years),
          image: newSkill.image,
          category: newSkill.category,
        });
        setEditingId(null);
      } else {
        await addSkill({
          name: newSkill.name,
          years: parseInt(newSkill.years),
          image: newSkill.image,
          category: newSkill.category,
        });
      }
      setNewSkill({
        name: "",
        years: "",
        image: "",
        category: ""
      });
    } catch (error) {
      console.error("Failed to save skill:", error);
    }
  };


  const handleEdit = (skill: any) => {
    setNewSkill({
      ...skill,
      years: skill.years.toString()
    });
    setEditingId(skill._id);
  };

  // Delete skill
  const handleDelete = async (id: string) => {
    try {
      await deleteSkill({ id: id as Id<"skills"> });
      setEditingId(null);
      setNewSkill({
        name: "",
        years: "",
        image: "",
        category: ""
      });
    } catch (error) {
      console.error("Failed to delete skill:", error);
    }
  };

  return (
    <div className="min-h-screen text-[#121212] dark:text-[#E0E0E0] bg-gradient-to-br from-indigo-50 to-teal-50 p-6 transition-colors duration-300 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Skills Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your technical skills and expertise
            </p>
          </div>
          
        
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                {editingId ? (
                  <>
                    <Edit className="h-5 w-5 mr-2" />
                    Edit Skill
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add New Skill
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {editingId 
                  ? "Update the selected skill" 
                  : "Add a new skill to your profile"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Skill Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newSkill.name}
                    onChange={handleInputChange}
                    placeholder="e.g., React"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="years">Years of Experience</Label>
                    <Input
                      id="years"
                      name="years"
                      type="number"
                      min="0"
                      max="50"
                      value={newSkill.years}
                      onChange={handleInputChange}
                      placeholder="e.g., 4"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newSkill.category}
                      onValueChange={(value) => setNewSkill(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent >
                        <SelectItem value="Backend">Backend</SelectItem>
                        <SelectItem value="Frontend">Frontend</SelectItem>
                        <SelectItem value="Database">Database</SelectItem>
                        <SelectItem value="Tools/Technologies">Tools/Technologies</SelectItem>
                        <SelectItem value="DevOps/Deployment">DevOps/Deployment</SelectItem>
                        <SelectItem value="Testing">Testing</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={newSkill.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.svg"
                    required
                  />
                </div>
                
                {newSkill.image && (
                  <div className="flex flex-col items-center border rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-2">Image Preview</p>
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg flex items-center justify-center h-32 w-32">
                      {newSkill.image.endsWith('.svg') ? (
                        <img 
                          src={newSkill.image} 
                          alt="Skill preview" 
                          className="h-16 w-16 object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                          <p className="text-xs text-gray-500 mt-2">Image preview available for SVG</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end pt-4">
                  {editingId && (
                    <Button 
                      type="button"
                      variant="outline"
                      className="mr-2"
                      onClick={() => {
                        setEditingId(null);
                        setNewSkill({
                          name: "",
                          years: "",
                          image: "",
                          category: ""
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button type="submit" className='bg-[#121212] text-[#E0E0E0] dark:bg-gray-500'>
                    {editingId ? "Update Skill" : "Add Skill"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Skills List */}
          <div>
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Your Skills</CardTitle>
                <CardDescription>
                  {skills.length} skills listed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {skills.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                      No skills yet
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Add your first skill to get started
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {skills.map(skill => (
                      <Card 
                        key={skill._id} 
                        className={`relative overflow-hidden dark:bg-gray-700 ${
                          editingId === skill._id ? "ring-2 ring-blue-500" : ""
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-4">
                              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-2 rounded-lg flex items-center justify-center h-16 w-16">
                                {skill.image ? (
                                  <img 
                                    src={skill.image} 
                                    alt={skill.name} 
                                    className="h-12 w-12 object-contain"
                                  />
                                ) : (
                                  <ImageIcon className="h-8 w-8 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {skill.name}
                                </h3>
                                <div className="flex items-center flex-col mt-1 space-x-4">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                    {skill.category}
                                  </span>
                                  <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {skill.years} {skill.years === 1 ? 'year' : 'years'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleEdit(skill)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => handleDelete(skill._id)}
                              >
                                <Trash2 className="h-4 w-4" />
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
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="mt-12">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Skills Overview</CardTitle>
              <CardDescription>
                Summary of your technical expertise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Skills</p>
                      <h3 className="text-3xl font-bold mt-1">{skills.length}</h3>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                      <PlusCircle className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Experience</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {skills.length > 0 
                          ? (skills.reduce((sum, skill) => sum + skill.years, 0) / skills.length).toFixed(1) 
                          : '0.0'} years
                      </h3>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Most Experienced</p>
                      <h3 className="text-2xl font-bold mt-1 truncate">
                        {skills.length > 0 
                          ? skills.reduce((max, skill) => skill.years > max.years ? skill : max, skills[0]).name 
                          : 'None'} 
                        <span className="text-lg text-gray-600 dark:text-gray-300"> ({skills.length > 0 ? Math.max(...skills.map(s => s.years)) : 0} yrs)</span>
                      </h3>
                    </div>
                    <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600 dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SkillsAdminDashboard;