<template>
    <header>
        <nav>
            <div class="branding">
                <router-link to="/" class="link">
                    <h3>Trackler</h3>
                </router-link>
            </div>
            <ul v-show="!authenticated" class="navigation">
                <router-link class="link" to="/login">
                    <li>
                        <ion-icon name="person-circle"></ion-icon>
                        Login
                    </li>
                </router-link>
            </ul>
            <ul v-show="authenticated" class="navigation">
                <router-link class="link" :to="'/profile/' + user._id">
                    <li>
                        <ion-icon name="person-circle" v-if="!user.photoURL"></ion-icon>
                        {{ user.username }}
                    </li>
                </router-link>
            </ul>
        </nav>
    </header>
</template>

<script lang="ts">
import { useUserStore } from "@/stores/userStore"

export default{
    name: "Header",
    data: () => {
        return {
            authenticated: false,
            user: {}
        }
    },
    mounted: function () {
        if(useUserStore().isAuth) {
            this.authenticated = true;
            this.user = useUserStore().user;
        }
    },
    watch: {
        '$route': function() {
            if(useUserStore().isAuth) {
            this.authenticated = true;
            this.user = useUserStore().user;
            }
        }
    }
}
</script>

<style lang="scss" scoped>

header {
    background-color: #E9EAED;
    z-index: 99;
    width: 100%;
    position: fixed;
    color: #292A2C;
    padding: 10px;

    nav {
        display: flex;
        flex-direction: row;
 
        width: 90%;
        margin: 0 auto;          
    }

    ul, .link {
        font-weight: 400;
        font-size: 16px;
        list-style: none;
        text-decoration: none;
        color: inherit;
    }

    li {
        padding: 16px;
        margin-left: 16px;
        display: flex;
        flex-direction: row;
        align-items: center;
        text-align: center;

        ion-icon {
            margin-right: 10px;
            font-size: 25px;
        }
    }

    .link {
        font-size: 16px;

        &:hover {
            color: #1E68FC;
            cursor: pointer;
        }
    }

    .branding {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .navigation {
        display: flex;
        align-items: center;
        position: absolute;
        top:0;
        height: 100%;
        right: 40px;
    }
}

</style>
