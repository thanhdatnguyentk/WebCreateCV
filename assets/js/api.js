export const Api = {
  saveCV: async (data) => {
    console.log("Lưu CV:", data);
    return Promise.resolve({ status: "ok", id: Date.now() });
  },
};
