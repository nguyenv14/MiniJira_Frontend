export const getApiRoutes = () => {
  const config = useRuntimeConfig()

  const base = config.public.apiBaseUrl

  return {
    auth: {
      login: `${base}/auth/login`,
      logout: `${base}/auth/logout`,
      register: `${base}/auth/register`,
    },
    profile: {
      getProfile: (id: string | number) => `${base}/profile/${id}`,
      changePassword: (id: string | number) => `${base}/profile/${id}/change-password`
    },
    user: {
      search: `${base}/users`,
      user: (id: string | number) => `${base}/users/${id}`
    }
  }
}