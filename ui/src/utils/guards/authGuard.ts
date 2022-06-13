import router from "@/router";
import { useUserStore } from "@/stores/userStore";

export function authGuard(to: any , from: any, next: any) {
    useUserStore().isAuth ? next() : next('/login');
};