import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertFromClerk = internalMutation({
    args: { data: v.any() }, 
    handler: async (ctx, { data }) => {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("byClerkUserId", q => q.eq("clerkUserId", data.id))
        .unique();
  
      if (existingUser) {
        await ctx.db.patch(existingUser._id, {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          role: data.privateMetadata?.role || "user",
         
        });
      } else {
        await ctx.db.insert("users", {
          clerkUserId: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          role: data.privateMetadata?.role || "user", 
         
        });
      }
    }
  });

export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});