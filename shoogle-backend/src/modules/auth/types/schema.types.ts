export const googleCallbackQuerySchema = {
  type: "object",
  properties: {
    code: { type: "string" },
    error: { type: "string" },
  },
};
