import { mutation,query } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    from: v.string(),
    to: v.string(),
    message: v.string(),
    fromName: v.string(),
    fromImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chats", {
      ...args,
      timestamp: Date.now(),
    });
  },
});
export const getChat = query({
    args: { userId: v.string() },
    handler: async (ctx, { userId }) => {
      return await ctx.db
        .query("chats")
        .filter((q) =>
          q.or(
            q.and(q.eq(q.field("from"), userId), q.eq(q.field("to"), "admin")),
            q.and(q.eq(q.field("from"), "admin"), q.eq(q.field("to"), userId))
          )
        )
        .order("asc")
        .collect();
    },
  });
export const getAllChats = query({
  handler: async (ctx) => {
    return await ctx.db.query('chats').collect();
  }
});