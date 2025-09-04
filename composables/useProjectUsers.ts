// composables/useProjectUsers.ts
export const useProjectUsers = () => {
  const users = ref<Array<{ _id: string; username: string }>>([]);
  const loading = ref(false);

  const fetchUsersForProject = async (projectId: string) => {
    const api = getApiRoutes();

    if (!projectId) {
      console.warn("Project ID is required to fetch users");
      return [];
    }

    loading.value = true;
    try {
      const response = await useRequest(`${api.user.getUserToProjectByAddTask}`, {
        method: "POST",
        body: { project_id: projectId },
      });

      if (response && response.data && response.statusCode === 200) {
        users.value = response.data || [];
        return response.data || [];
      } else {
        users.value = [];
        return [];
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      users.value = [];
      return [];
    } finally {
      loading.value = false;
    }
  };

  return {
    users,
    loading,
    fetchUsersForProject
  };
};