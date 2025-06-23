/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Code, 
  ServerCog, 
  Smartphone,
  Database, 
  Zap,
  Cpu,
  X
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import { toast } from 'sonner';

const ServicesAdminDashboard = () => {
  // Available icons for selection
  const availableIcons = [
    { name: "Code", component: <Code size={24} /> },
    { name: "ServerCog", component: <ServerCog size={24} /> },
    { name: "Smartphone", component: <Smartphone size={24} /> },
    { name: "Database", component: <Database size={24} /> },
    { name: "Zap", component: <Zap size={24} /> },
    { name: "Cpu", component: <Cpu size={24} /> }
  ];

  const addService = useMutation(api.homePage.addService);
  const updateService = useMutation(api.homePage.updateService);
  const deleteService = useMutation(api.homePage.deleteService);
  const services = useQuery(api.homePage.getServices) || [];
  
  const [newService, setNewService] = useState({
    title: "",
    icon: "",
    description: "",
    features: [""]
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showIconSelector, setShowIconSelector] = useState(false);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewService(prev => ({ ...prev, [name]: value }));
  };

  // Handle feature item changes
  const handleFeatureItemChange = (index: number, value: string) => {
    const updatedFeatures = [...newService.features];
    updatedFeatures[index] = value;
    setNewService(prev => ({ ...prev, features: updatedFeatures }));
  };

  // Add a new feature item
  const addFeatureItem = () => {
    setNewService(prev => ({ ...prev, features: [...prev.features, ""] }));
  };

  // Remove a feature item
  const removeFeatureItem = (index: number) => {
    if (newService.features.length > 1) {
      const updatedFeatures = [...newService.features];
      updatedFeatures.splice(index, 1);
      setNewService(prev => ({ ...prev, features: updatedFeatures }));
    }
  };

  // Select an icon
  const selectIcon = (iconName: string) => {
    setNewService(prev => ({ ...prev, icon: iconName }));
    setShowIconSelector(false);
  };

  // Submit new service
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        await updateService({
          id: editingId as Id<"services">,
          title: newService.title,
          icon: newService.icon,
          description: newService.description,
          features: newService.features,
        });
        setEditingId(null);
      } else {
        await addService({
          title: newService.title,
          icon: newService.icon,
          description: newService.description,
          features: newService.features,
        });
      }
      setNewService({
        title: "",
        icon: "",
        description: "",
        features: [""]
      });

      toast.success("Service added successfully");
    } catch (error) {
      console.error("Failed to save service:", error);
    }
  };

  const handleEdit = (service: any) => {
    setNewService(service);
    setEditingId(service._id);
  };

  // Delete service
  const handleDelete = async (id: string) => {
    try {
      await deleteService({ id: id as Id<"services"> });
      toast.success("Service deleted successfully");
      if (editingId === id) {
        setEditingId(null);
        setNewService({
          title: "",
          icon: "",
          description: "",
          features: [""]
        });
      }

    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };

  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    const icon = availableIcons.find(icon => icon.name === iconName);
    return icon ? icon.component : <Code size={24} />;
  };

  return (
    <div className="min-h-screen bg-[#E0E0E0] dark:bg-[#121212] p-6 md:p-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Services Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Manage your development services to match the frontend display
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-4"></div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="dark:bg-[#121826] border border-blue-500/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex text-gray-900 dark:text-white items-center">
                {editingId ? (
                  <>
                    <Edit className="h-5 w-5 mr-2 text-blue-500" />
                    Edit Service
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 mr-2 text-gray-500" />
                    Add New Service
                  </>
                )}
              </CardTitle>
              <CardDescription className='text-gray-500'>
                {editingId 
                  ? "Update the selected service" 
                  : "Add a new service to your offerings"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6 text-gray-900 dark:text-gray-200">
                <div className="space-y-4">
                  {/* Icon Selection */}
                  <div>
                    <Label className="block mb-2">Icon</Label>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div 
                          className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 border dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 border-blue-300 dark:border-gray-700 cursor-pointer"
                          onClick={() => setShowIconSelector(true)}
                        >
                          {newService.icon ? (
                            getIconComponent(newService.icon)
                          ) : (
                            <span className="text-[#121212] dark:text-[#E0E0E0]">Select</span>
                          )}
                        </div>
                        {newService.icon && (
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                            onClick={() => setNewService(prev => ({ ...prev, icon: "" }))}
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setShowIconSelector(true)}
                      >
                        Select Icon
                      </Button>
                    </div>
                    
                    {showIconSelector && (
                      <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 dark:border-gray-700 shadow-lg z-10">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium">Select an Icon</h3>
                          <button 
                            type="button"
                            onClick={() => setShowIconSelector(false)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                          {availableIcons.map((icon, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg flex flex-col items-center cursor-pointer border ${
                                newService.icon === icon.name
                                  ? "bg-gradient-to-br from-blue-100 to-purple-100 border-blue-300 dark:border-blue-700"
                                  : "bg-gradient-to-br from-blue-50 to-purple-50 border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              }`}
                              onClick={() => selectIcon(icon.name)}
                            >
                              <div className="text-gray-500 mb-1">{icon.component}</div>
                              <span className="text-xs mt-1">{icon.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Service Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={newService.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Web Development"
                      required
                      className="bg-gradient-to-br dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 from-blue-50 to-purple-50 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newService.description}
                      onChange={handleInputChange}
                      placeholder="Service description"
                      required
                      rows={3}
                      className="bg-gradient-to-br dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 from-blue-50 to-purple-50 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 min-h-[100px]"
                    />
                  </div>
                  
                  {/* Features */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Key Features</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={addFeatureItem}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Feature
                      </Button>
                    </div>
                    
                    {newService.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={feature}
                          onChange={(e) => handleFeatureItemChange(index, e.target.value)}
                          placeholder={`Feature ${index + 1}`}
                          required
                          className="bg-gradient-to-br dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 from-blue-50 to-purple-50 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeFeatureItem(index)}
                          disabled={newService.features.length <= 1}
                        >
                          <Trash2 className="h-4 w-4 text-[#121212] dark:text-[#E0E0E0]" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 space-x-3">
                  {editingId && (
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingId(null);
                        setNewService({
                          title: "",
                          icon: "",
                          description: "",
                          features: [""]
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-br from-blue-500 dark:bg-gradient-to-br text-white dark:text-white dark:from-gray-950 dark:to-gray-950 to-purple-600 cursor-pointer hover:bg-gray-200 dark:bg-[#121212]"
                  >
                    {editingId ? "Update Service" : "Add Service"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Services List */}
          <div>
            <Card className="dark:bg-[#121826] border border-blue-500/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Your Services</CardTitle>
                <CardDescription className='text-[#121212] dark:text-[#E0E0E0]'>
                  {services.length} services available
                </CardDescription>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                      No services yet
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Add your first service to get started
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {services.map(service => (
                      <Card 
                        key={service._id} 
                        className={`relative overflow-hidden dark:bg-gray-800/50 border ${
                          editingId === service._id 
                            ? "border-blue-500 ring-2 ring-blue-500/30" 
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-4">
                              <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 text-gray-500">
                                {getIconComponent(service.icon)}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-gray-500 transition-colors">
                                  {service.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">
                                  {service.description}
                                </p>
                                <div className="mt-4">
                                  <h4 className="font-medium mb-2 text-sm uppercase tracking-wider text-gray-500">
                                    Key Features
                                  </h4>
                                  <ul className="space-y-2">
                                    {service.features.map((feature, idx) => (
                                      <li key={feature + idx} className="flex items-center">
                                        <span className={`w-2 h-2 rounded-full mr-3 bg-gray-500`}></span>
                                        <span className="text-gray-700 dark:text-gray-300">
                                          {feature}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleEdit(service)}
                                className="border-gray-300 dark:border-gray-600"
                              >
                                <Edit className="h-4 w-4 text-[#121212] dark:text-[#E0E0E0]"  />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => handleDelete(service._id as Id<"services">)}
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
      </div>
    </div>
  );
};

export default ServicesAdminDashboard;