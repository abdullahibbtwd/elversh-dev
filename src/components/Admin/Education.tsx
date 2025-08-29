/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef} from 'react';
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
  Calendar,
  BookOpen,
  Award
} from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import type { Id } from '@/../convex/_generated/dataModel';
import { toast } from 'sonner';
import Image from 'next/image';

const EducationCertificateDashboard = () => {
  // Convex queries and mutations
  const addEducation = useMutation(api.homePage.addEducation);
  const updateEducation = useMutation(api.homePage.updateEducation);
  const deleteEducation = useMutation(api.homePage.deleteEducation);
  const educations = useQuery(api.homePage.getEducation) || [];
  
  const addCertificate = useMutation(api.homePage.addCertificate);
  const updateCertificate = useMutation(api.homePage.updateCertificate);
  const deleteCertificate = useMutation(api.homePage.deleteCertificate);
  const certificates = useQuery(api.homePage.getCertificates) || [];
  
  // Education state
  const [newEducation, setNewEducation] = useState<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string;
    description: string;
    achievements: string[];
    courses: string[];
    logo: string | null;
  }>({
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    gpa: "",
    description: "",
    achievements: [],
    courses: [],
    logo: null
  });
  
  const [newAchievement, setNewAchievement] = useState("");
  const [newCourse, setNewCourse] = useState("");
  
  // Certificates state
  const [newCertificate, setNewCertificate] = useState<{
    title: string;
    issuer: string;
    issueDate: string;
    expiryDate: string;
    credentialLink: string;
    description: string;
    skills: string[];
    image: string | null;
  }>({
    title: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    credentialLink: "",
    description: "",
    skills: [],
    image: null
  });
  
  const [newSkill, setNewSkill] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<"education" | "certificate" | null>(null);
  const [activeTab, setActiveTab] = useState<"education" | "certificate">("education");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  // Handle form input changes for education
  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEducation(prev => ({ ...prev, [name]: value }));
  };

  // Handle form input changes for certificates
  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCertificate(prev => ({ ...prev, [name]: value }));
  };

  // Add achievement to education
  const addAchievement = () => {
    if (newAchievement.trim()) {
      setNewEducation(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement]
      }));
      setNewAchievement("");
    }
  };

  // Remove achievement from education
  const removeAchievement = (index: number) => {
    setNewEducation(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  // Add course to education
  const addCourse = () => {
    if (newCourse.trim()) {
      setNewEducation(prev => ({
        ...prev,
        courses: [...prev.courses, newCourse]
      }));
      setNewCourse("");
    }
  };

  // Remove course from education
  const removeCourse = (index: number) => {
    setNewEducation(prev => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index)
    }));
  };

  // Add skill to certificate
  const addSkill = () => {
    if (newSkill.trim()) {
      setNewCertificate(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
      setNewSkill("");
    }
  };

  // Remove skill from certificate
  const removeSkill = (index: number) => {
    setNewCertificate(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // For now, just store the file name as a placeholder
        setNewEducation(prev => ({
          ...prev,
          logo: file.name
        }));
        toast.success('Logo uploaded successfully!');
      } catch (error) {
        console.error('Failed to upload logo:', error);
        toast.error('Failed to upload logo.');
      }
    }
  };

  // Handle certificate image upload
  const handleCertImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // For now, just store the file name as a placeholder
        setNewCertificate(prev => ({
          ...prev,
          image: file.name
        }));
        toast.success('Certificate image uploaded successfully!');
      } catch (error) {
        console.error('Failed to upload certificate image:', error);
        toast.error('Failed to upload certificate image.');
      }
    }
  };

  // Submit education
  const handleEducationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty achievements and courses
    const filteredData = {
      ...newEducation,
      achievements: newEducation.achievements.filter(achievement => achievement.trim() !== ""),
      courses: newEducation.courses.filter(course => course.trim() !== ""),
      endDate: newEducation.endDate || null,
      gpa: newEducation.gpa || null,
      description: newEducation.description || null,
      logo: newEducation.logo
    };
    
    try {
      if (editingId !== null && editingType === "education") {
        await updateEducation({
          id: editingId as Id<'education'>,
          ...filteredData
        });
        toast.success('Education updated successfully!');
      } else {
        await addEducation(filteredData);
        toast.success('Education added successfully!');
      }
      
      setNewEducation({
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        gpa: "",
        description: "",
        achievements: [],
        courses: [],
        logo: null
      });
      
      setEditingId(null);
      setEditingType(null);
    } catch (error) {
      console.error('Failed to save education:', error);
      toast.error('Failed to save education.');
    }
  };

  // Submit certificate
  const handleCertificateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty skills
    const filteredData = {
      ...newCertificate,
      skills: newCertificate.skills.filter(skill => skill.trim() !== ""),
      expiryDate: newCertificate.expiryDate || null,
      credentialLink: newCertificate.credentialLink || null,
      description: newCertificate.description || null,
      image: newCertificate.image
    };
    
    try {
      if (editingId !== null && editingType === "certificate") {
        await updateCertificate({
          id: editingId as Id<'certificates'>,
          ...filteredData
        });
        toast.success('Certificate updated successfully!');
      } else {
        await addCertificate(filteredData);
        toast.success('Certificate added successfully!');
      }
      
      setNewCertificate({
        title: "",
        issuer: "",
        issueDate: "",
        expiryDate: "",
        credentialLink: "",
        description: "",
        skills: [],
        image: null
      });
      
      setEditingId(null);
      setEditingType(null);
    } catch (error) {
      console.error('Failed to save certificate:', error);
      toast.error('Failed to save certificate.');
    }
  };

  // Edit existing item
  const handleEdit = (item: any, type: "education" | "certificate") => {
    if (type === "education") {
      setNewEducation({
        institution: item.institution,
        degree: item.degree,
        field: item.field,
        startDate: item.startDate,
        endDate: item.endDate || "",
        gpa: item.gpa || "",
        description: item.description || "",
        achievements: item.achievements,
        courses: item.courses,
        logo: item.logo || null
      });
    } else {
      setNewCertificate({
        title: item.title,
        issuer: item.issuer,
        issueDate: item.issueDate,
        expiryDate: item.expiryDate || "",
        credentialLink: item.credentialLink || "",
        description: item.description || "",
        skills: item.skills,
        image: item.image || null
      });
    }
    setEditingId(item._id);
    setEditingType(type);
    setActiveTab(type);
  };

  // Delete item
  const handleDelete = async (id: string, type: "education" | "certificate") => {
    try {
      if (type === "education") {
        await deleteEducation({ id: id as Id<'education'> });
        toast.success('Education deleted successfully!');
      } else {
        await deleteCertificate({ id: id as Id<'certificates'> });
        toast.success('Certificate deleted successfully!');
      }
      
      if (editingId === id) {
        setEditingId(null);
        setEditingType(null);
        
        if (type === "education") {
          setNewEducation({
            institution: "",
            degree: "",
            field: "",
            startDate: "",
            endDate: "",
            gpa: "",
            description: "",
            achievements: [],
            courses: [],
            logo: null
          });
        } else {
          setNewCertificate({
            title: "",
            issuer: "",
            issueDate: "",
            expiryDate: "",
            credentialLink: "",
            description: "",
            skills: [],
            image: null
          });
        }
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast.error('Failed to delete item.');
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-indigo-50 dark:bg-gray-800 text-gray-900 dark:text-white p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Education & Certificates</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your educational background and professional certifications
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "education" | "certificate")}>
              <TabsList className="grid grid-cols-2 w-full max-w-xs gap-2">
                <TabsTrigger value="education" className='bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950' >
                  <BookOpen className="h-4 w-4 mr-2 " />
                  Education
                </TabsTrigger>
                <TabsTrigger value="certificate" className='bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950'>
                  <Award className="h-4 w-4 mr-2" />
                  Certificates
                </TabsTrigger>
              </TabsList>
            </Tabs>
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
                    {editingType === "education" ? "Edit Education" : "Edit Certificate"}
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 mr-2" />
                    {activeTab === "education" ? "Add New Education" : "Add New Certificate"}
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {editingId 
                  ? "Update the selected item" 
                  : activeTab === "education" 
                    ? "Add your educational background" 
                    : "Add your professional certifications"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeTab === "education" ? (
                <form onSubmit={handleEducationSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      name="institution"
                      value={newEducation.institution}
                      onChange={handleEducationChange}
                      placeholder="e.g., Harvard University"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="degree">Degree</Label>
                      <Input
                        id="degree"
                        name="degree"
                        value={newEducation.degree}
                        onChange={handleEducationChange}
                        placeholder="e.g., Bachelor of Science"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="field">Field of Study</Label>
                      <Input
                        id="field"
                        name="field"
                        value={newEducation.field}
                        onChange={handleEducationChange}
                        placeholder="e.g., Computer Science"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <div className="relative">
                        <Input
                          type="date"
                          id="startDate"
                          name="startDate"
                          value={newEducation.startDate}
                          onChange={handleEducationChange}
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
                          value={newEducation.endDate}
                          onChange={handleEducationChange}
                          placeholder="Present"
                        />
                        <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gpa">GPA</Label>
                    <Input
                      id="gpa"
                      name="gpa"
                      value={newEducation.gpa}
                      onChange={handleEducationChange}
                      placeholder="e.g., 3.9/4.0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newEducation.description}
                      onChange={handleEducationChange}
                      placeholder="Describe your education experience..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Achievements</Label>
                      <div className="space-y-2 mt-2">
                        {newEducation.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={achievement}
                              onChange={(e) => {
                                const updatedAchievements = [...newEducation.achievements];
                                updatedAchievements[index] = e.target.value;
                                setNewEducation(prev => ({
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
                              className='bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950'
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
                            className='bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950'
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Courses</Label>
                      <div className="space-y-2 mt-2">
                        {newEducation.courses.map((course, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={course}
                              onChange={(e) => {
                                const updatedCourses = [...newEducation.courses];
                                updatedCourses[index] = e.target.value;
                                setNewEducation(prev => ({
                                  ...prev,
                                  courses: updatedCourses
                                }));
                              }}
                              placeholder="Course name"
                            />
                            <Button 
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeCourse(index)}
                              className='bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950'
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex items-center gap-2">
                          <Input
                            value={newCourse}
                            onChange={(e) => setNewCourse(e.target.value)}
                            placeholder="Add new course"
                          />
                          <Button 
                            type="button"
                            onClick={addCourse}
                            className='bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950'
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Institution Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="border rounded-md p-2 w-16 h-16 flex items-center justify-center">
                        {newEducation.logo ? (
                          <Image 
                            src={newEducation.logo} 
                            alt="Logo" 
                            width={64}
                            height={64}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-xs text-gray-500">No logo</span>
                        )}
                      </div>
                      <div>
                        <input 
                          type="file" 
                          ref={logoInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoUpload}
                        />
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => logoInputRef.current?.click()}
                          className='bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950'
                        >
                          Upload Logo
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    {editingId && editingType === "education" && (
                      <Button
                        type="button"
                        variant="outline"
                        className="mr-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950"
                        onClick={() => {
                          setEditingId(null);
                          setEditingType(null);
                          setNewEducation({
                            institution: "",
                            degree: "",
                            field: "",
                            startDate: "",
                            endDate: "",
                            gpa: "",
                            description: "",
                            achievements: [],
                            courses: [],
                            logo: null
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" className='bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950'>
                      {editingId ? "Update Education" : "Add Education"}
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleCertificateSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Certificate Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={newCertificate.title}
                      onChange={handleCertificateChange}
                      placeholder="e.g., AWS Certified Developer"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="issuer">Issuing Organization</Label>
                    <Input
                      id="issuer"
                      name="issuer"
                      value={newCertificate.issuer}
                      onChange={handleCertificateChange}
                      placeholder="e.g., Amazon Web Services"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="issueDate">Issue Date</Label>
                      <div className="relative">
                        <Input
                          type="date"
                          id="issueDate"
                          name="issueDate"
                          value={newCertificate.issueDate}
                          onChange={handleCertificateChange}
                          required
                        />
                        <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiration Date</Label>
                      <div className="relative">
                        <Input
                          type="date"
                          id="expiryDate"
                          name="expiryDate"
                          value={newCertificate.expiryDate}
                          onChange={handleCertificateChange}
                          placeholder="Never"
                        />
                        <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="credentialLink">Credential Link</Label>
                    <Input
                      id="credentialLink"
                      name="credentialLink"
                      value={newCertificate.credentialLink}
                      onChange={handleCertificateChange}
                      placeholder="e.g., https://www.credly.com/badges/12345"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newCertificate.description}
                      onChange={handleCertificateChange}
                      placeholder="Describe the certification..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Skills</Label>
                      <div className="space-y-2 mt-2">
                        {newCertificate.skills.map((skill, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={skill}
                              onChange={(e) => {
                                const updatedSkills = [...newCertificate.skills];
                                updatedSkills[index] = e.target.value;
                                setNewCertificate(prev => ({
                                  ...prev,
                                  skills: updatedSkills
                                }));
                              }}
                              placeholder="Skill"
                            />
                            <Button 
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeSkill(index)}
                              className='bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950'
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex items-center gap-2">
                          <Input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Add new skill"
                          />
                          <Button 
                            type="button"
                            onClick={addSkill}
                            className='bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950'
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Certificate Image</Label>
                    <div className="flex items-center gap-4">
                      <div className="border rounded-md p-2 w-16 h-16 flex items-center justify-center">
                        {newCertificate.image ? (
                          <Image 
                            src={newCertificate.image} 
                            alt="Certificate" 
                            width={64}
                            height={64}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-xs text-gray-500">No image</span>
                        )}
                      </div>
                      <div>
                        <input 
                          type="file" 
                          ref={certInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleCertImageUpload}
                        />
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => certInputRef.current?.click()}
                          className='bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950'
                        >
                          Upload Image
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    {editingId && editingType === "certificate" && (
                      <Button
                        type="button"
                        variant="outline"
                        className="mr-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950"
                        onClick={() => {
                          setEditingId(null);
                          setEditingType(null);
                          setNewCertificate({
                            title: "",
                            issuer: "",
                            issueDate: "",
                            expiryDate: "",
                            credentialLink: "",
                            description: "",
                            skills: [],
                            image: null
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" className='bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950'>
                      {editingId ? "Update Certificate" : "Add Certificate"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
          
          {/* List Section */}
          <div>
            {activeTab === "education" ? (
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Education History</CardTitle>
                  <CardDescription>
                    {educations.length} education records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {educations.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                        No education records yet
                      </h3>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Add your educational background to get started
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {educations.map(education => (
                        <Card 
                          key={education._id} 
                          className={`relative overflow-hidden dark:bg-gray-700 ${
                            editingId === education._id && editingType === "education" 
                              ? "ring-2 ring-blue-500" 
                              : ""
                          }`}
                        >
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-4">
                                  {education.logo && (
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-md p-1">
                                      <Image 
                                        src={education.logo} 
                                        alt={education.institution} 
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                      {education.institution}
                                    </h3>
                                    <div className="mt-2">
                                      <p className="font-medium">
                                        {education.degree} in {education.field}
                                      </p>
                                      <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {formatDate(education.startDate)} - {formatDate(education.endDate)}
                                        {education.gpa && (
                                          <span className="ml-4">GPA: {education.gpa}</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {education.description && (
                                  <p className="mt-3 text-gray-700 dark:text-gray-300">
                                    {education.description}
                                  </p>
                                )}
                                
                                {education.achievements.length > 0 && (
                                  <div className="mt-4">
                                    <h4 className="font-medium text-gray-900 dark:text-white">Achievements:</h4>
                                    <ul className="mt-2 space-y-1">
                                      {education.achievements.map((achievement, idx) => (
                                        <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                                          <span className="mr-2">•</span>
                                          <span>{achievement}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {education.courses.length > 0 && (
                                  <div className="mt-4">
                                    <h4 className="font-medium text-gray-900 dark:text-white">Courses:</h4>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {education.courses.map((course, idx) => (
                                        <span 
                                          key={idx}
                                          className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                        >
                                          {course}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => handleEdit(education, "education")}
                                  className='bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950'
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="icon"
                                  onClick={() => handleDelete(education._id, "education")}
                                  className='bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950'
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
            ) : (
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Professional Certificates</CardTitle>
                  <CardDescription>
                    {certificates.length} professional certificates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {certificates.length === 0 ? (
                    <div className="text-center py-12">
                      <Award className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                        No certificates yet
                      </h3>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Add your professional certifications to get started
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {certificates.map(certificate => (
                        <Card 
                          key={certificate._id} 
                          className={`relative overflow-hidden dark:bg-gray-700 ${
                            editingId === certificate._id && editingType === "certificate" 
                              ? "ring-2 ring-blue-500" 
                              : ""
                          }`}
                        >
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-4">
                                  {certificate.image && (
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-md p-1">
                                      <Image 
                                        src={certificate.image} 
                                        alt={certificate.title} 
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                      {certificate.title}
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 mt-1">
                                      {certificate.issuer}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="mt-3 space-y-2">
                                  <div className="flex items-center text-sm">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                    <span>Issued: {formatDate(certificate.issueDate)}</span>
                                  </div>
                                  {certificate.expiryDate && (
                                    <div className="flex items-center text-sm">
                                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                      <span>Expires: {formatDate(certificate.expiryDate)}</span>
                                    </div>
                                  )}
                                  {certificate.credentialLink && (
                                    <div className="flex items-center text-sm">
                                      <span className="font-medium mr-2">Link:</span>
                                      <a 
                                        href={certificate.credentialLink} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                      >
                                        View credential
                                      </a>
                                    </div>
                                  )}
                                </div>
                                
                                {certificate.description && (
                                  <p className="mt-3 text-gray-700 dark:text-gray-300">
                                    {certificate.description}
                                  </p>
                                )}
                                
                                {certificate.skills.length > 0 && (
                                  <div className="mt-4">
                                    <h4 className="font-medium text-gray-900 dark:text-white">Skills:</h4>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {certificate.skills.map((skill, idx) => (
                                        <span 
                                          key={idx}
                                          className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => handleEdit(certificate, "certificate")}
                                  className='bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950'
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="icon"
                                  onClick={() => handleDelete(certificate._id, "certificate")}
                                  className='bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950'
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="bg-gray-50 dark:bg-gray-600/30 p-4 justify-end">
                            {certificate.image && (
                              <Button variant="outline" size="sm" className='bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950'>
                                View Certificate
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Stats Section */}
            <div className="mt-6">
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 rounded-lg p-4 flex flex-col items-center">
                      <BookOpen className="h-8 w-8 text-blue-500 mb-2" />
                      <span className="text-2xl font-bold">{educations.length}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Education Records</span>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 rounded-lg p-4 flex flex-col items-center">
                      <Award className="h-8 w-8 text-green-500 mb-2" />
                      <span className="text-2xl font-bold">{certificates.length}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Certificates</span>
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

export default EducationCertificateDashboard;