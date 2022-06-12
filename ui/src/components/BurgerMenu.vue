<template>
    <div class="burger">
        <div class="burger-container">
            <div :class="[closed ? 'burger-item' : 'search']" @click="searchFocus">
                <ion-icon name="search-outline" v-bind:class="[closed ? 'md hydrated search-closed' : 'md hydrated']"></ion-icon>
                <input v-if="!closed" type="text" v-model="searched" placeholder="Search" class="search-form" @keydown.enter="search" />
            </div>
            <hr />
            <div :class="['burger-item', this.selected === 'Watchlist' ? 'selected' : '']" @click="$router.push('/dashboard')">
                <ion-icon name="list-outline"></ion-icon>
                <span v-if="!closed">Watchlist</span>
            </div>
            <div :class="['burger-item', this.selected === 'Upcoming' ? 'selected' : '']" @click="$router.push('/calendar')">
                <ion-icon name="calendar-outline"></ion-icon>
                <span v-if="!closed">Upcoming</span>
            </div>
            <div :class="['burger-item', this.selected === 'Discover' ? 'selected' : '']" @click="$router.push('/discover')">
                <ion-icon name="map-outline"></ion-icon>
                <span v-if="!closed">Discover</span>
            </div>
            <div :class="['burger-item', this.selected === 'Profile' ? 'selected' : '']" @click="$router.push('/profile/' + user._id)">
                <ion-icon name="person-circle"></ion-icon>
                <span v-if="!closed">Profile</span>
            </div>
            <div :class="['burger-item', this.selected === 'Community' ? 'selected' : '']" @click="$router.push('/community')">
                <ion-icon name="people-circle-outline"></ion-icon>
                <span v-if="!closed">Community</span>
            </div>
            <div :class="['burger-item']" @click="logout">
                <ion-icon name="log-out-outline"></ion-icon>
                <span v-if="!closed">Logout</span>
            </div>
            <div class="burger-item hide-burger" @click="switchBurger">
                <ion-icon v-if="!closed" name="arrow-back-outline"></ion-icon>
                <ion-icon v-if="closed" name="arrow-forward-outline"></ion-icon>
                <span v-if="!closed">Hide</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import router from "@/router";
import { useUserStore } from '../stores/userStore';

export default{
    name: "BurgerMenu",
    data: () => {
        return {
            searched: "",
            closed: false,
            selected: "Watchlist",
            user: {},
            timeoutTimer: null
        }
    },
    methods: {
        search: function () {
            router.push("/search/" + this.searched);
        },
        logout: function () {
            useUserStore().logout();
            router.push('/');
            location.reload();
        },
        switchBurger: function () {
            this.closed = !this.closed;
        },
        searchFocus: function () {
            if(this.closed) {
                this.closed = false;
                setTimeout(() => {
                    document.getElementsByClassName("search-form")[0].focus();
                }, 5);
            }
        }
    },
    watch: {
        '$route': function() {
            if(router.currentRoute.value.fullPath.includes("dashboard")) {
                this.selected = "Watchlist";
                this.searched = "";
            }
            else if(router.currentRoute.value.fullPath.includes("search"))  {
                this.selected = "Search";
                this.searched = router.currentRoute.value.params.query;
            }
            else if(router.currentRoute.value.fullPath.includes("calendar")) {
                this.selected = "Upcoming";
                this.searched = "";
            }
            else if(router.currentRoute.value.fullPath.includes("discover")) {
                this.selected = "Discover";
                this.searched = "";
            }
            else if(router.currentRoute.value.fullPath.includes("profile")) {
                this.selected = "Profile";
                this.searched = "";
            }
            else if(router.currentRoute.value.fullPath.includes("community")) {
                this.selected = "Community";
                this.searched = "";
            }
        },
        'searched': function() {
            if(this.timeoutTimer)
                clearTimeout(this.timeoutTimer);
            if(this.searched !== "")
                this.timeoutTimer = setTimeout(() => router.replace("/search/" + this.searched), 1000);
            else
                router.replace("/dashboard");
        }
    },
    mounted: function() {
        this.user = useUserStore().getUser;
    }
}
</script>

<style lang="scss" scoped>
.burger {
    position: fixed;
    padding-left: 0;
    left: 0;
    height: 100vh;
    max-width: 200px;
    background: #4B4C4E;
    .burger-container {
        margin-top: 40px;
        padding: 10px;
        padding-left: 0;
        padding-right: 0;

       .burger-item {
            left: 0;
            display: flex;
            flex-direction: row;
            align-items: center;
            text-align: center;
            color: white;
            cursor: pointer;
            margin-bottom: 20px;
            padding-top: 5px;
            padding-bottom: 5px;
            padding-right: 10px;

            transition: all 0.2s ease-in-out;

            &:hover {
                background: #5F5F5F;
            }

            ion-icon {
                font-size: 36px;
                margin-left: 10px;
            }

            span {
                margin-left: 10px;
                font-size: 24px;
            }
        }

        .hide-burger {
            position: absolute;
            bottom: 10px;
            width: 100%;
        }

        .search {
            margin-left: 10px;
            padding-right: 10px;

            ion-icon {
                position: absolute;
                font-size: 20px;
                margin-top: 8px;
                margin-left: 1px;
            }

            .search-closed {
                position: inherit;
                font-size: 36px;
                color: white;
            }

            .search-form {
                width: 100%;
                height: 40px;
                border: none;
                border-radius: 5px;
                background-color: #E9EAED;
                padding: 10px;
                font-size: 16px;
                font-weight: 400;
                color: #292A2C;
                outline: none;
                padding-left: 24px;
                font-size: 20px;
            }
        }

        .selected {
            border-left: 3px solid #1E68FC;
            margin-left: 0;

            ion-icon {
                margin-left: 7px;
            }
        }

        hr {
            border: 1px solid #292A2C;
            margin: 10px;
        }
    }
}
</style>