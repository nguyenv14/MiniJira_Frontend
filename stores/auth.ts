import { defineStore } from 'pinia'
import { getApiRoutes } from '@/utils/api'
import { useRequest } from '@/utils/base-request'


export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
    userInfo: null as {
      id: string
      username: string
      email: string
      role: number
      isActive: boolean
      isAdmin: boolean
    } | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    login(token: string, userInfo: {
      id: string
      username: string
      email: string
      role: number
      isActive: boolean
      isAdmin: boolean
    }) {
      console.log('Đăng nhập với:', { token, userInfo })
      this.accessToken = token
      this.userInfo = userInfo
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('accessToken', token)
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
          console.log('Đã lưu vào localStorage')
        } catch (e) {
          console.error('Lỗi khi lưu vào localStorage:', e)
        }
      }
    },

    logout() {
      this.accessToken = null
      this.userInfo = null
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('userInfo')
          console.log('Đã xóa localStorage')
        } catch (e) {
          console.error('Lỗi khi xóa localStorage:', e)
        }
      }
    },

    loadFromStorage() {
      if (typeof window !== 'undefined') {
        try {
          const token = localStorage.getItem('accessToken')
          const userInfo = localStorage.getItem('userInfo')
          if (token) {
            this.accessToken = token
            this.userInfo = userInfo ? JSON.parse(userInfo) : null
            console.log('Đã tải từ localStorage:', { token, userInfo: this.userInfo })
          }
        } catch (e) {
          console.error('Lỗi khi tải từ localStorage:', e)
          this.accessToken = null
          this.userInfo = null
        }
      }
    },

    async fetchAndSaveProfile() {
      try {
        if (!this.userInfo?.id) throw new Error('Không có user id')
        const api = getApiRoutes(); // ✅ Gọi bên trong hàm
        const response = await useRequest(
          api.profile.getProfile(this.userInfo.id),
          {
            method: 'GET',
            auth: true,
          }
        )
        if (response.statusCode === 200) {
          this.userInfo = response.data
          if (typeof window !== 'undefined') {
            localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
          }
        } else {
          this.logout()
          return navigateTo("/login");

        }
      } catch (error) {
        console.error('Lỗi fetchAndSaveProfile:', error)
        this.logout()
        return navigateTo("/login");

      }
    }
  }
})