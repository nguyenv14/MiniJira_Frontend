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
      getUserToProjectByAddTask: `${base}/users/get-user-to-add-task`,
    },
    project: {
      search: `${base}/projects`,
      project: `${base}/projects/save`,
      detail: `${base}/projects/detail`,
      findByMember: `${base}/projects/get-members-by-project-id`,
      addMember: `${base}/projects/add-member`,
      removeMember: `${base}/projects/remove-member`,
      updateMemberRole: `${base}/projects/change-role-member`,
      update: `${base}/projects/update`,
    },
    task: {
      search: `${base}/tasks/search`,
      save: `${base}/tasks/save`,
      changeStatus: `${base}/tasks/change-status`,
      task: (id: string | number) => `${base}/tasks/${id}`,
      delete: (id: string | number) => `${base}/tasks/${id}`,
      getTaskByProjectId: (projectId: string | number) => `${base}/tasks/get-tasks-by-project-id/${projectId}`,
      taskDetail: `${base}/tasks/detail`,
      addChecklist: `${base}/tasks/save-checklist`,
      changeStatusChecklist: `${base}/tasks/change-status-checklist`,
      addComment: `${base}/tasks/add-comment`,
    },
    dashboard: {
      getTask: `${base}/dashboard/get-task`,
      getProject: `${base}/projects/get-project-by-userId`
    }
  }
}