'use node';
import { action } from "./_generated/server";
import { v } from "convex/values";
import webpush from "web-push";
import { api } from "./_generated/api";

export const sendPushToUserAction = action({
  args: {
    userId: v.string(),
    title: v.string(),
    body: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
   
    const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY!;
    const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;
    webpush.setVapidDetails(
      "mailto:abdullahibashirtwd@gmail.com",
      VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY
    );


    const sub = await ctx.runQuery(api.chat.getPushSubscription, { userId: args.userId });
    if (!sub) return;

    const payload = JSON.stringify({
      title: args.title,
      body: args.body,
      url: args.url || "/",
    });

    try {
      await webpush.sendNotification(sub.subscription, payload);
    } catch (err) {
      console.error("Push error:", err);
    }
  },
}); 