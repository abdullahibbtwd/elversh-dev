
"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from 'next/image';

interface FormData {
  headingPart1: string;
  headingHighlight: string;
  headingPart2: string;
  headingPart3: string;
  subtitle: string;
  projectsCount: string;
  yearsExperience: string;
  satisfaction: string;
  support: string;
  role: string;
  roleDescription: string;
  backendSkills: string;
  frontendSkills: string;
  heroImage: Id<"_storage"> | null;
  cvFile: Id<"_storage"> | null;
}

interface FileState {
  heroImage: File | null;
  cvFile: File | null;
}

const HeroForm = () => {
  const homePageData = useQuery(api.homePage.getHomePageContent);

  const [formData, setFormData] = useState<FormData>({
    headingPart1: "",
    headingHighlight: "",
    headingPart2: "",
    headingPart3: "",
    subtitle: "",
    projectsCount: "",
    yearsExperience: "",
    satisfaction: "",
    support: "",
    role: "",
    roleDescription: "",
    backendSkills: "",
    frontendSkills: "",
    heroImage: null,
    cvFile: null,
  });

  const [selectedFiles, setSelectedFiles] = useState<FileState>({
    heroImage: null,
    cvFile: null,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [existingHeroImageUrl, setExistingHeroImageUrl] = useState<
    string | null
  >(null);

  const generateUploadUrl = useAction(api.files.generateUploadUrl);
  const saveContent = useMutation(api.homePage.saveHomePageContent);

  const heroImageUrl = useQuery(
    api.files.getFileUrl,
    formData.heroImage ? { storageId: formData.heroImage } : "skip"
  );

  useEffect(() => {
    if (homePageData) {
      setFormData(homePageData);
    }
  }, [homePageData]);

  useEffect(() => {
    if (heroImageUrl) {
      setExistingHeroImageUrl(heroImageUrl);
    }
  }, [heroImageUrl]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFiles((prev) => ({ ...prev, heroImage: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreviewImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCVChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFiles((prev) => ({ ...prev, cvFile: file }));
  };

  const uploadFile = async (file: File): Promise<Id<"_storage">> => {
    const url = await generateUploadUrl();

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    const { storageId } = await response.json();
    return storageId as Id<"_storage">;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let heroImageId = formData.heroImage;
      if (selectedFiles.heroImage) {
        heroImageId = await uploadFile(selectedFiles.heroImage);
      }

      let cvFileId = formData.cvFile;
      if (selectedFiles.cvFile) {
        cvFileId = await uploadFile(selectedFiles.cvFile);
      }

      const submissionData = {
        ...formData,
        heroImage: heroImageId,
        cvFile: cvFileId,
      };

      await saveContent({ data: submissionData });

      setSelectedFiles({ heroImage: null, cvFile: null });
      setPreviewImage(null);

      toast.success("Content saved successfully!");
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Failed to save content. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-teal-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800 dark:text-white">
              Hero Section Editor
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Update all content for your hero section
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Heading Part 1 */}
                <div className="space-y-2">
                  <Label
                    className="text-gray-800 dark:text-gray-200"
                    htmlFor="headingPart1"
                  >
                    Heading Part 1
                  </Label>
                  <Input
                    id="headingPart1"
                    name="headingPart1"
                    value={formData.headingPart1}
                    onChange={handleChange}
                    className="bg-gradient-to-br dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 from-blue-50 to-purple-50 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    placeholder="e.g., Building"
                  />
                </div>

                {/* Highlighted Heading */}
                <div className="space-y-2">
                  <Label
                    className="text-gray-800 dark:text-gray-200"
                    htmlFor="headingHighlight"
                  >
                    Highlighted Heading
                  </Label>
                  <Input
                    id="headingHighlight"
                    name="headingHighlight"
                    value={formData.headingHighlight}
                    onChange={handleChange}
                    className="bg-gradient-to-br dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 from-blue-50 to-purple-50 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    placeholder="e.g., Impactful"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Heading Part 2 */}
                <div className="space-y-2">
                  <Label
                    className="text-gray-800 dark:text-gray-200"
                    htmlFor="headingPart2"
                  >
                    Heading Part 2
                  </Label>
                  <Input
                    id="headingPart2"
                    name="headingPart2"
                    value={formData.headingPart2}
                    onChange={handleChange}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    placeholder="e.g., Digital Experiences"
                  />
                </div>

                {/* Heading Part 3 */}
                <div className="space-y-2">
                  <Label
                    className="text-gray-800 dark:text-gray-200"
                    htmlFor="headingPart3"
                  >
                    Heading Part 3
                  </Label>
                  <Input
                    id="headingPart3"
                    name="headingPart3"
                    value={formData.headingPart3}
                    onChange={handleChange}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    placeholder="e.g., for the Web."
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div className="space-y-2">
                <Label
                  className="text-gray-800 dark:text-gray-200"
                  htmlFor="subtitle"
                >
                  Subtitle
                </Label>
                <Textarea
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 min-h-[100px]"
                  placeholder="Describe your services"
                />
              </div>

              {/* Stats Section */}
              <div className="border-t border-gray-300 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label
                      className="text-gray-800 dark:text-gray-200"
                      htmlFor="projectsCount"
                    >
                      Projects Count
                    </Label>
                    <Input
                      id="projectsCount"
                      name="projectsCount"
                      value={formData.projectsCount}
                      onChange={handleChange}
                      className="bg-gradient-to-br dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 from-blue-50 to-purple-50 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      placeholder="e.g., 10+"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      className="text-gray-800 dark:text-gray-200"
                      htmlFor="yearsExperience"
                    >
                      Years Experience
                    </Label>
                    <Input
                      id="yearsExperience"
                      name="yearsExperience"
                      value={formData.yearsExperience}
                      onChange={handleChange}
                      className="bg-gradient-to-br dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 from-blue-50 to-purple-50 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      placeholder="e.g., 5+"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      className="text-gray-800 dark:text-gray-200"
                      htmlFor="satisfaction"
                    >
                      Satisfaction Rate
                    </Label>
                    <Input
                      id="satisfaction"
                      name="satisfaction"
                      value={formData.satisfaction}
                      onChange={handleChange}
                      className="bg-gradient-to-br dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 from-blue-50 to-purple-50 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      placeholder="e.g., 99%"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      className="text-gray-800 dark:text-gray-200"
                      htmlFor="support"
                    >
                      Support Availability
                    </Label>
                    <Input
                      id="support"
                      name="support"
                      value={formData.support}
                      onChange={handleChange}
                      className="bg-gradient-to-br dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 from-blue-50 to-purple-50 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      placeholder="e.g., 24/7"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Section */}
              <div className="border-t border-gray-300 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Profile Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      className="text-gray-800 dark:text-gray-200"
                      htmlFor="role"
                    >
                      Your Role
                    </Label>
                    <Input
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="bg-gradient-to-br dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 from-blue-50 to-purple-50 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      placeholder="e.g., Full Stack Developer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      className="text-gray-800 dark:text-gray-200"
                      htmlFor="roleDescription"
                    >
                      Role Description
                    </Label>
                    <Input
                      id="roleDescription"
                      name="roleDescription"
                      value={formData.roleDescription}
                      onChange={handleChange}
                      className="bg-gradient-to-br dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 from-blue-50 to-purple-50 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      placeholder="e.g., Creating end-to-end web solutions"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <Label
                      className="text-gray-800 dark:text-gray-200"
                      htmlFor="backendSkills"
                    >
                      Backend Skills
                    </Label>
                    <Input
                      id="backendSkills"
                      name="backendSkills"
                      value={formData.backendSkills}
                      onChange={handleChange}
                      className="bg-gradient-to-br dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 from-blue-50 to-purple-50 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      placeholder="e.g., Node.js, Python, Databases"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      className="text-gray-800 dark:text-gray-200"
                      htmlFor="frontendSkills"
                    >
                      Frontend Skills
                    </Label>
                    <Input
                      id="frontendSkills"
                      name="frontendSkills"
                      value={formData.frontendSkills}
                      onChange={handleChange}
                      className="bg-gradient-to-br dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 from-blue-50 to-purple-50 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      placeholder="e.g., React, Vue, Tailwind"
                    />
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="border-t border-gray-300 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Media Files
                </h3>

               
                <div className="space-y-4 mb-6">
                  <Label
                    className="text-gray-800 dark:text-gray-200"
                    htmlFor="heroImage"
                  >
                    Profile Image
                  </Label>

                  {(previewImage || existingHeroImageUrl) && (
                    <div className="mt-2">
                      <Image
                        src={previewImage || existingHeroImageUrl || ""}
                        alt="Preview"
                        width={192}
                        height={192}
                        className="w-48 h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <Label
                      htmlFor="heroImage"
                      className="cursor-pointer bg-gradient-to-br dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 from-blue-50 to-purple-50 text-gray-800 dark:text-white px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Choose Image
                    </Label>
                    <Input
                      id="heroImage"
                      name="heroImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {selectedFiles.heroImage && (
                      <span className="text-gray-600 dark:text-gray-300">
                        {selectedFiles.heroImage.name}
                      </span>
                    )}
                  </div>
                </div>

              
                <div className="space-y-4">
                  <Label
                    className="text-gray-800  dark:text-gray-200"
                    htmlFor="cvFile"
                  >
                    Upload CV
                  </Label>
                  <div className="flex items-center gap-4">
                    <Label
                      htmlFor="cvFile"
                      className="cursor-pointer bg-gradient-to-br dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 from-blue-50 to-purple-50 text-gray-800 dark:text-white px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Choose File
                    </Label>
                    <Input
                      id="cvFile"
                      name="cvFile"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCVChange}
                      className="hidden"
                    />
                    {selectedFiles.cvFile && (
                      <span className="text-gray-600 dark:text-gray-300">
                        {selectedFiles.cvFile.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-300 dark:border-gray-700">
                <Button
                  type="submit"
                  className="bg-gradient-to-br from-blue-500 dark:bg-gradient-to-br text-white dark:text-white dark:from-gray-950 dark:to-gray-950 to-purple-600 hover:bg-gray-200 dark:bg-[#121212] "
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Hero Section Preview
          </h2>

          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Heading Preview */}
                <div className="space-y-2">
                  <Label className="text-gray-600 dark:text-gray-400">
                    Heading:
                  </Label>
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    {formData.headingPart1}{" "}
                    <span className="text-blue-500">
                      {formData.headingHighlight}
                    </span>{" "}
                    {formData.headingPart2} {formData.headingPart3}
                  </h1>
                </div>

                {/* Subtitle Preview */}
                <div className="space-y-2">
                  <Label className="text-gray-600 dark:text-gray-400">
                    Subtitle:
                  </Label>
                  <p className="text-gray-800 dark:text-white">
                    {formData.subtitle}
                  </p>
                </div>

                {/* Stats Preview */}
                <div className="space-y-2">
                  <Label className="text-gray-600 dark:text-gray-400">
                    Statistics:
                  </Label>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br  from-blue-50 to-purple-50 text-gray-800 dark:text-gray-200 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 p-3 rounded-lg">
                      <div className="text-blue-500 font-bold">
                        {formData.projectsCount}
                      </div>
                      <div className="text-sm">Projects</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800 dark:text-gray-200 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 p-3 rounded-lg">
                      <div className="font-bold">
                        {formData.yearsExperience}
                      </div>
                      <div className="text-sm">Years</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800 dark:text-gray-200 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 p-3 rounded-lg">
                      <div className="text-blue-500 font-bold">
                        {formData.satisfaction}
                      </div>
                      <div className="text-sm">Satisfaction</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800 dark:text-gray-200 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 p-3 rounded-lg">
                      <div className="text-blue-500 font-bold">
                        {formData.support}
                      </div>
                      <div className="text-sm">Support</div>
                    </div>
                  </div>
                </div>

                {/* Profile Preview */}
                <div className="space-y-4">
                  <Label className="text-gray-600 dark:text-gray-400">
                    Profile Section:
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800 dark:text-gray-200 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 p-4 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-blue-100 dark:bg-blue-900 w-10 h-10 rounded-full mr-3 flex items-center justify-center">
                          <div className="text-blue-500">B</div>
                        </div>
                        <div>
                          <div className="font-medium">Backend</div>
                          <div className="text-sm">
                            {formData.backendSkills}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800 dark:text-gray-200 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950 p-4 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-blue-100 dark:bg-blue-900 w-10 h-10 rounded-full mr-3 flex items-center justify-center">
                          <div className="text-blue-500">F</div>
                        </div>
                        <div>
                          <div className="font-medium">Frontend</div>
                          <div className="text-sm">
                            {formData.frontendSkills}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-600 dark:text-gray-400">
                      Profile Image:
                    </Label>
                    {previewImage || existingHeroImageUrl ? (
                      <Image
                        src={previewImage || existingHeroImageUrl || ""}
                        alt="Hero preview"
                        width={128}
                        height={128}
                        className="w-32 h-32 object-cover rounded-full mt-2 border border-gray-300 dark:border-gray-600"
                      />
                    ) : (
                      <p className="text-gray-800 dark:text-white">
                        No image uploaded
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-gray-600 dark:text-gray-400">
                      CV File:
                    </Label>
                    <p className="text-gray-800 dark:text-white">
                      {selectedFiles.cvFile
                        ? selectedFiles.cvFile.name
                        : formData.cvFile
                          ? "File exists (not shown)"
                          : "No file uploaded"}
                    </p>
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

export default HeroForm;
