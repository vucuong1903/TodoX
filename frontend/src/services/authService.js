import api from "@/lib/axios";

const authService = {
   signUp: async (username, password, email, firstName, lastName) => {
      const response = await api.post(
         "/auth/signup",
         { username, password, email, firstName, lastName },
         { withCredentials: true }
      );
      return response.data;
   },
   signIn: async (username, password) => {
      const response = await api.post(
         "/auth/signin",
         { username, password },
         { withCredentials: true }
      );
      return response.data;
   },
   signOut: async () => {
      const response = await api.post("/auth/signout", {}, { withCredentials: true });
      return response.data;
   },
   fetchMe: async () => {
      const res = await api.get("/users/me", { withCredentials: true });
      return res.data.user;
   },
   refresh: async () => {
      const res = await api.post("/auth/refresh", {}, { withCredentials: true });
      return res.data.accessToken;
   },
};

export default authService;
