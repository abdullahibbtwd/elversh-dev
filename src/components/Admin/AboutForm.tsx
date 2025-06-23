"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Briefcase, Folder, X } from "lucide-react";
import Image from "next/image";
import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { toast } from "sonner";
import type { Id } from "../../../convex/_generated/dataModel";

const AboutPage = () => {
  const [formData, setFormData] = useState({
    profileImage: null as Id<'_storage'> | null,
    heading: "Full Stack Developer & UI/UX Enthusiast",
    description1:
      "I'm a passionate full-stack developer with expertise in creating robust web applications. With over 5 years of experience, I specialize in bridging the gap between frontend elegance and backend efficiency.",
    description2:
      "My approach combines technical expertise with creative problem-solving to deliver solutions that not only meet requirements but exceed expectations. I believe in writing clean, maintainable code and creating intuitive user experiences.",
    experience: 5,
    projects: 30,
    available: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const profileImageUrl = useQuery(
    api.files.getFileUrl,
    formData.profileImage ? { storageId: formData.profileImage } : "skip"
  );
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveAboutSection = useMutation(api.homePage.saveAboutSection);
  const generateUploadUrl = useAction(api.files.generateUploadUrl);

  // Show preview when a new file is selected
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profileImage: null }));
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let profileImageId = formData.profileImage;
      if (selectedFile) {
        profileImageId = await uploadFile(selectedFile);
      }
      await saveAboutSection({
        data: {
          profileImage: profileImageId,
          heading: formData.heading,
          description1: formData.description1,
          description2: formData.description2,
          experience: formData.experience,
          projects: formData.projects,
          available: formData.available,
        },
      });
      setIsSubmitting(false);
      toast.success("About section updated successfully!");
      setSelectedFile(null);
    } catch (error: unknown) {
      console.log(error);
      setIsSubmitting(false);
      toast.error("Failed to update About section.");
    }
  };

  const uploadFile = async (file: File): Promise<Id<'_storage'>> => {
    const url = await generateUploadUrl();
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await response.json();
    return storageId as Id<'_storage'>;
  };

  return (
    <div className=" p-4 md:p-6 bg-gradient-to-br from-blue-200 to-purple-200 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900  w-full h-full">
      <Card className="border-none shadow-lg dark:bg-gradient-to-br text-gray-800 dark:text-white dark:from-gray-900 dark:to-gray-800 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
            About Me Editor
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-6 flex items-center space-x-2">
              <Switch
                id="preview-mode"
                checked={isPreview}
                onCheckedChange={setIsPreview}
              />
              <Label
                htmlFor="preview-mode"
                className="text-gray-700 dark:text-gray-300"
              >
                Preview Mode
              </Label>
            </div>

            {isPreview ? (
              // Preview UI
              <div className="p-6 rounded-lg border dark:border-gray-700 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Image & Stats Preview */}
                  <div>
                    <div className="relative rounded-2xl overflow-hidden border-8 border-white dark:border-gray-800 shadow-xl w-full max-w-md mx-auto">
                      {profileImageUrl ? (
                        <div className="relative h-80 w-full">
                          <Image
                            src={profileImageUrl}
                            alt="Profile preview"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-xl"
                          />
                        </div>
                      ) : (
                        <div className="h-80 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-xl">
                          <span className="text-gray-500">No image selected</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="p-4 rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-blue-100 dark:bg-blue-900/30">
                            <Briefcase className="text-blue-500" size={24} />
                          </div>
                          <div>
                            <div className="text-xl font-bold mb-1">
                              {formData.experience || 0}+ Years
                            </div>
                            <div className="text-sm">Experience</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-blue-100 dark:bg-blue-900/30">
                            <Folder className="text-blue-500" size={24} />
                          </div>
                          <div>
                            <div className="text-xl font-bold mb-1">
                              {formData.projects || 0}+ Projects
                            </div>
                            <div className="text-sm">Completed</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text Preview */}
                  <div>
                    <h3 className="text-2xl font-bold mb-6">
                      {formData.heading}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">
                      {formData.description1}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {formData.description2}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Edit Form
              <div className="space-y-6">
                {/* Profile Image Upload */}
                <div>
                  <Label className="block mb-2">Profile Image</Label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {profileImageUrl && (
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300">
                          <Image
                            src={profileImageUrl}
                            alt="Profile preview"
                            layout="fill"
                            objectFit="cover"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      {!profileImageUrl && (
                        <div className="w-24 h-24 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">No image</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <Input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Recommended size: 400x400 pixels
                      </p>
                    </div>
                  </div>
                </div>

                {/* Heading */}
                <div>
                  <Label htmlFor="heading" className="block mb-2">
                    Heading
                  </Label>
                  <Input
                    id="heading"
                    name="heading"
                    value={formData.heading}
                    onChange={handleChange}
                    placeholder="e.g. Full Stack Developer & UI/UX Enthusiast"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description1" className="block mb-2">
                    First Paragraph
                  </Label>
                  <Textarea
                    id="description1"
                    name="description1"
                    value={formData.description1}
                    onChange={handleChange}
                    rows={4}
                    className="min-h-[100px]"
                    placeholder="Enter first paragraph..."
                  />
                </div>

                <div>
                  <Label htmlFor="description2" className="block mb-2">
                    Second Paragraph
                  </Label>
                  <Textarea
                    id="description2"
                    name="description2"
                    value={formData.description2}
                    onChange={handleChange}
                    rows={4}
                    className="min-h-[100px]"
                    placeholder="Enter second paragraph..."
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="experience" className="block mb-2">
                      Years of Experience
                    </Label>
                    <Input
                      id="experience"
                      name="experience"
                      type="number"
                      value={formData.experience}
                      onChange={handleNumberChange}
                      min={0}
                    />
                  </div>
                  <div>
                    <Label htmlFor="available" className="block mb-2">
                      Available
                    </Label>
                    <Input
                      id="available"
                      name="available"
                      value={formData.available}
                      onChange={handleChange}
                      placeholder="Enter availability status..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="projects" className="block mb-2">
                      Number of Projects
                    </Label>
                    <Input
                      id="projects"
                      name="projects"
                      type="number"
                      value={formData.projects}
                      onChange={handleNumberChange}
                      min={0}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-8 space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPreview(!isPreview)}
                className="border-gray-300 cursor-pointer dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                {isPreview ? "Edit" : "Preview"}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-br cursor-pointer from-blue-500 dark:bg-gradient-to-br text-white dark:text-white dark:from-gray-900 dark:to-gray-800 to-purple-600 hover:bg-gray-200 dark:bg-[#121212]"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;