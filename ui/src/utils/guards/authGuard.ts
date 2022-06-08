import { useUserStore } from "@/stores/userStore";

export function authGuard(to: any , from: any, next: any) {
    useUserStore().isAuth ? next() : next('/login');
};

export function authGuardHome(to: any , from: any, next: any) {
    useUserStore().isAuth ? next('/dashboard') : next();
}