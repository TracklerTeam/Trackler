import router from '@/router';
import axios from 'axios';
import { defineStore } from 'pinia';
import { API_URL } from '@/utils/constants';
import type { IUserStore } from '@/utils/types';

export const useUserStore = defineStore('user', {
    state: (): IUserStore => ({
        user: {
            _id: '',
            email: '',
            username: '',
            role: ''
        },
        isAuthenticated: false
    }),
    getters: {
        getUser: state => state.user,
        isAuth: state => state.isAuthenticated
    },
    actions: {
        async login(username: string, password: string) {
            try {
                const response = await axios.post(`${API_URL}/auth/login`, {
                    username,
                    password
                });

                const { token } = response.data;
                localStorage.setItem('token', token);

                this.user._id = response.data.user._id;
                this.user.email = response.data.user.email;
                this.user.username = response.data.user.username;
                this.user.role = response.data.user.role;

                this.isAuthenticated = true;
                router.push("/");

                return true;
            } catch (error) {
                console.log(error);

                return false;
            }
        },
        logout() {
            this.$reset();
            this.isAuthenticated = false;
            router.push("/");
        },
        async register(username: string, email: string, password: string) {
            try {
                const response = await axios.post(`${API_URL}/auth/register`, {
                    username,
                    email,
                    password
                });

                return {failed: false};
            } catch(error) {
                console.log(error);

                return {failed: true, error: error.response.data.error};
            }
        }
    },
    persist: true
});