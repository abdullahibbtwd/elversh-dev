import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
        url: "https://elvershdev.com/",
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 1,
    }
  ]
}