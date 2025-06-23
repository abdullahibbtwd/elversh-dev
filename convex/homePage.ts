import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
export const getAboutSection = query({
  handler: async (ctx) => {
    try {
      const data = await ctx.db.query('aboutSection').first();
      if (!data) return null;
      
      let profileImageUrl = null;
      if (data.profileImage) {
        try {
          profileImageUrl = await ctx.storage.getUrl(data.profileImage);
        } catch (error) {
          console.error('Error getting profile image URL:', error);
          // Continue without the image URL
        }
      }
      
      return {
        ...data,
        profileImageUrl
      };
    } catch (error) {
      console.error('Error in getAboutSection:', error);
      // Return default data if query fails
      return {
        heading: "Passionate Full-Stack Developer",
        description1: "I'm a dedicated full-stack developer with a passion for creating innovative web solutions.",
        description2: "My journey in web development has equipped me with the skills to build scalable applications.",
        experience: 3,
        projects: 50,
        available: "Available",
        profileImageUrl: null
      };
    }
  },
});

export const getHomePageContent = query({
  handler: async (ctx) => {
    const data = await ctx.db.query('homePageContent').first();
    if (!data) return null;
    
   
    const heroImageUrl = data.heroImage ? await ctx.storage.getUrl(data.heroImage) : null;
    const cvFileUrl = data.cvFile ? await ctx.storage.getUrl(data.cvFile) : null;
    
    return {
      ...data,
      heroImageUrl,
      cvFileUrl
    };
  },
});

export const saveHomePageContent = mutation({
  args: {
    data: v.object({
      headingPart1: v.string(),
      headingHighlight: v.string(),
      headingPart2: v.string(),
      headingPart3: v.string(),
      subtitle: v.string(),
      projectsCount: v.string(),
      yearsExperience: v.string(),
      satisfaction: v.string(),
      support: v.string(),
      role: v.string(),
      roleDescription: v.string(),
      backendSkills: v.string(),
      frontendSkills: v.string(),
      heroImage: v.union(v.id('_storage'), v.null()),
      cvFile: v.union(v.id('_storage'), v.null()),
    })
  },
  handler: async (ctx, { data }) => {

    const existing = await ctx.db.query('homePageContent').first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
    
    
    return await ctx.db.insert('homePageContent', data);
  },
});

// Mutation to save About section data
export const saveAboutSection = mutation({
  args: {
    data: v.object({
      profileImage: v.union(v.id('_storage'), v.null()),
      heading: v.string(),
      description1: v.string(),
      description2: v.string(),
      experience: v.number(),
      projects: v.number(),
      available: v.string(),
    })
  },
  handler: async (ctx, { data }) => {
    // Delete existing document if exists
    const existing = await ctx.db.query('aboutSection').first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }

    return await ctx.db.insert('aboutSection', data);
  },
});

export const addService = mutation({
  args: {
    title: v.string(),
    icon: v.string(),
    description: v.string(),
    features: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('services', args);
  },
});

export const updateService = mutation({
  args: {
    id: v.id('services'),
    title: v.string(),
    icon: v.string(),
    description: v.string(),
    features: v.array(v.string()),
  },
  handler: async (ctx, { id, ...data }) => {
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

export const deleteService = mutation({
  args: { id: v.id('services') },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return id;
  },
});

export const getServices = query({
  handler: async (ctx) => {
    return await ctx.db.query('services').collect();
  },
});

export const addSkill = mutation({
  args: {
    name: v.string(),
    years: v.number(),
    image: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('skills', args);
  },
});

export const updateSkill = mutation({
  args: {
    id: v.id('skills'),
    name: v.string(),
    years: v.number(),
    image: v.string(),
    category: v.string(),
  },
  handler: async (ctx, { id, ...data }) => {
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

export const deleteSkill = mutation({
  args: { id: v.id('skills') },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return id;
  },
});

export const getSkills = query({
  handler: async (ctx) => {
    return await ctx.db.query('skills').collect();
  },
});

export const addProject = mutation({
  args: {
    title: v.string(),
    shortDescription: v.string(),
    longDescription: v.string(),
    techIcons: v.array(v.string()),
    images: v.array(v.id('_storage')),
    githubLink: v.string(),
    liveLink: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('projects', args);
  },
});

export const updateProject = mutation({
  args: {
    id: v.id('projects'),
    title: v.string(),
    shortDescription: v.string(),
    longDescription: v.string(),
    techIcons: v.array(v.string()),
    images: v.array(v.id('_storage')),
    githubLink: v.string(),
    liveLink: v.string(),
  },
  handler: async (ctx, { id, ...data }) => {
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

export const deleteProject = mutation({
  args: { id: v.id('projects') },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return id;
  },
});

export const getProjects = query({
  handler: async (ctx) => {
    return await ctx.db.query('projects').collect();
  },
});

// Work Experience Mutations and Queries
export const addWorkExperience = mutation({
  args: {
    company: v.string(),
    position: v.string(),
    startDate: v.string(),
    endDate: v.union(v.string(), v.null()),
    shortDescription: v.string(),
    longDescription: v.string(),
    achievements: v.array(v.string()),
    technologies: v.array(v.string()),
    companyLink: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('workExperience', args);
  },
});

export const updateWorkExperience = mutation({
  args: {
    id: v.id('workExperience'),
    company: v.string(),
    position: v.string(),
    startDate: v.string(),
    endDate: v.union(v.string(), v.null()),
    shortDescription: v.string(),
    longDescription: v.string(),
    achievements: v.array(v.string()),
    technologies: v.array(v.string()),
    companyLink: v.union(v.string(), v.null()),
  },
  handler: async (ctx, { id, ...data }) => {
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

export const deleteWorkExperience = mutation({
  args: { id: v.id('workExperience') },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return id;
  },
});

export const getWorkExperience = query({
  handler: async (ctx) => {
    return await ctx.db.query('workExperience').collect();
  },
});

// Education Mutations and Queries
export const addEducation = mutation({
  args: {
    institution: v.string(),
    degree: v.string(),
    field: v.string(),
    startDate: v.string(),
    endDate: v.union(v.string(), v.null()),
    gpa: v.union(v.string(), v.null()),
    description: v.union(v.string(), v.null()),
    achievements: v.array(v.string()),
    courses: v.array(v.string()),
    logo: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('education', args);
  },
});

export const updateEducation = mutation({
  args: {
    id: v.id('education'),
    institution: v.string(),
    degree: v.string(),
    field: v.string(),
    startDate: v.string(),
    endDate: v.union(v.string(), v.null()),
    gpa: v.union(v.string(), v.null()),
    description: v.union(v.string(), v.null()),
    achievements: v.array(v.string()),
    courses: v.array(v.string()),
    logo: v.union(v.string(), v.null()),
  },
  handler: async (ctx, { id, ...data }) => {
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

export const deleteEducation = mutation({
  args: { id: v.id('education') },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return id;
  },
});

export const getEducation = query({
  handler: async (ctx) => {
    return await ctx.db.query('education').collect();
  },
});

// Certificates Mutations and Queries
export const addCertificate = mutation({
  args: {
    title: v.string(),
    issuer: v.string(),
    issueDate: v.string(),
    expiryDate: v.union(v.string(), v.null()),
    credentialLink: v.union(v.string(), v.null()),
    description: v.union(v.string(), v.null()),
    skills: v.array(v.string()),
    image: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('certificates', args);
  },
});

export const updateCertificate = mutation({
  args: {
    id: v.id('certificates'),
    title: v.string(),
    issuer: v.string(),
    issueDate: v.string(),
    expiryDate: v.union(v.string(), v.null()),
    credentialLink: v.union(v.string(), v.null()),
    description: v.union(v.string(), v.null()),
    skills: v.array(v.string()),
    image: v.union(v.string(), v.null()),
  },
  handler: async (ctx, { id, ...data }) => {
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

export const deleteCertificate = mutation({
  args: { id: v.id('certificates') },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return id;
  },
});

export const getCertificates = query({
  handler: async (ctx) => {
    return await ctx.db.query('certificates').collect();
  },
});

