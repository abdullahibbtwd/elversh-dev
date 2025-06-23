import { action, query } from './_generated/server';
import { v } from 'convex/values';


export const generateUploadUrl = action({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getFileUrl = query({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});