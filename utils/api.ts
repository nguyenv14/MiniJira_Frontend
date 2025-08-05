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
      getProfile: `${base}/profile`,
      changePassword: (id: string | number) => `${base}/profile/${id}/change-password`
    },
    user: {
      search: `${base}/users`,
      user: (id: string | number) => `${base}/users/${id}`,
      getUserToAddProject: `${base}/users/get-user-to-add-project`,
    },
    project: {
      search: `${base}/projects`,
      project: `${base}/projects/create`,
      detail: `${base}/projects/detail`,
      findByMember: `${base}/projects/get-members-by-project-id`,
      addMember: `${base}/projects/add-member`,
      removeMember: `${base}/projects/remove-member`,
      updateMemberRole: `${base}/projects/change-role-member`,
    }
  }
}