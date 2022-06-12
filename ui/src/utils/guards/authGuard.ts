import router from "@/router";
import { useUserStore } from "@/stores/userStore";

export function authGuard(to: any , from: any, next: any) {
    const isAuth = useUserStore().isAuth;

    if (isAuth) {


        next();
    } else {
        next('/login');
    }

    isAuth ? next() : next('/login');
};

export function authGuardHome(to: any , from: any, next: any) {
    useUserStore().isAuth ? next('/dashboard') : next();
}

export function authGuardDashboard(to: any, from: any, next: any) {
    useUserStore().isAuth ? next() : next('/');
}