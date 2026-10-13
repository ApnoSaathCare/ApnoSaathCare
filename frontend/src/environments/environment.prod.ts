export const environment = {
  production: true,
  // Change this to your deployed backend URL (e.g. 'https://aapnosaath-api.onrender.com/api/v1')
  // or leave as '/api/v1' if using reverse proxy (Vercel/Netlify rewrites).
  apiUrl: (typeof window !== 'undefined' && (window as any).__API_URL__) || '/api/v1',
};
