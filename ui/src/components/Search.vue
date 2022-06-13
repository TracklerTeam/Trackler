<template>
    <div class="content">
        <div class="loading" v-if="loading">
            <easy-spinner size="90px" />
        </div>
        <div class="show-item" v-for="show in shows" :key="show.name">
            <img :src="show.backdrop_path ? 'https://image.tmdb.org/t/p/w500/' + show.backdrop_path : 'https://via.placeholder.com/500x281'" @click="$router.push(`/show/${show.id}`)"/>
            <div class="show-info">
                <h3 class="title" @click="$router.push(`/show/${show.id}`)">{{ show.name }}</h3>
                <ion-icon v-if="!followedShows.includes(show.id)" name="add-circle-outline" @click="addShow(show.id)"></ion-icon>
                <ion-icon v-if="followedShows.includes(show.id)" name="remove-circle-outline" @click="removeShow(show.id)"></ion-icon>
            </div>
        </div>
        <div class="nothing" v-if="shows.length == 0 && !loading">
            <ion-icon name="sad"></ion-icon>
            <h3>No results found</h3>
        </div>
        <div class="pages" v-if="!loading">
            <div>
                <div class="page" v-if="page > 1 && total_pages" @click="changePage(page - 1)">
                    <ion-icon name="arrow-back-outline"></ion-icon>
                </div>
            </div>
            <div v-if="total_pages <= show_pages && total_pages > 1">
                <div :class="['page', pagei === page ? 'selected' : '']" v-for="pagei in total_pages" :key="pagei" @click="changePage(pagei)">
                    <span>{{ pagei }}</span>
                </div>
            </div>
            <div v-if="total_pages > show_pages">
                <div v-if="page > show_pages - Math.floor(show_pages / 2)" @click="changePage(1)" class="page">
                    <span>1</span>
                </div>
                <div class="page-special" v-if="page > Math.floor(show_pages / 2) + 2">
                    <span>...</span>
                </div>
                <div v-for="pagei in [...Array(show_pages).keys()].map(i => i + page - Math.floor(show_pages / 2)).filter(i => i > 0 && i < total_pages + 1)" :class="['page', pagei === page ? 'selected' : '']" :key="pagei" @click="changePage(pagei)">
                    <span>{{ pagei }}</span>
                </div>
                <div class="page-special" v-if="page <= total_pages - Math.floor(show_pages / 2) - 2">
                    <span>...</span>
                </div>
                <div v-if="page < total_pages - Math.floor(show_pages / 2)" @click="changePage(total_pages)" class="page">
                    <span>{{ total_pages }}</span>
                </div>
            </div>
            <div>
                <div class="page" v-if="page !== total_pages && total_pages" @click="changePage(page + 1)">
                    <ion-icon name="arrow-forward-outline"></ion-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import router from '@/router';
import { API_URL } from '@/utils/constants';
import axios from 'axios';
import { useUserStore } from '../stores/userStore';

export default {
    name: 'Search',
    data: () => {
        return {
            queryed: "",
            page: 1,
            show_pages: 5,
            shows: [],
            followedShows: [],
            loading: true,
            total_pages: 1
        }
    },
    props: {
        query: {
            type: String,
            required: true
        }
    },
    methods: {
        performSearch: async function(): Promise<void> {
            let response = null;
            try {
                response = await axios.get(`${API_URL}/search/multi/${this.queryed}/${this.page}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } catch(error: any) {
                if(error.response.status === 401) 
                    return useUserStore().logout();
                
                return this.$toast.open({
                    message: 'Something went wrong',
                    type: "error",
                    duration: 10000,
                    queue: false               
                });
            }

            this.shows = response.data.results;
            this.loading = false;
            this.total_pages = response.data.total_pages;
        },
        addShow: async function(id: Number): Promise<void> {
            let response = null;

            try {
                response = await axios.get(`${API_URL}/user/show/follow/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                this.followedShows = response.data;
                useUserStore().updateFollowed(this.followedShows);
            } catch (error: any) {
                if(error.response.status === 401)
                    return useUserStore().logout();

                
                this.followedShows = error.response.data.followed_shows;
                useUserStore().updateFollowed(this.followedShows);
                return this.$toast.open({
                    message: error.response.data.error,
                    type: "error",
                    duration: 10000,
                    queue: false               
                });
            }
        },
        removeShow: async function(id: Number): Promise<void> {
            let response = null;

            try {
                response = await axios.get(`${API_URL}/user/show/unfollow/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                this.followedShows = response.data;
                useUserStore().updateFollowed(this.followedShows);
            } catch (error: any) {
                if(error.response.status === 401) 
                    return useUserStore().logout();
                
                return this.$toast.open({
                    message: 'Something went wrong',
                    type: "error",
                    duration: 10000,
                    queue: false               
                });
            }
        },
        changePage: function(page: Number): void {
            this.page = page;
            this.loading = true;
            this.performSearch();
        }
    },
    mounted: function() {
        this.queryed = this.query;
        this.performSearch();

        this.followedShows = useUserStore().user.followed_shows;
    },
    watch: {
        '$route': async function () {
            this.loading = true;
            this.shows = [];
            this.queryed = router.currentRoute.value.params.query;

            this.performSearch();
        }
    }
}
</script>

<style lang="scss" scoped>
    .content {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        .show-item {
            display: flex;
            flex-direction: column;
            margin: 20px;

            width: 20vw;
            min-width: 390px;

            img {
                cursor: pointer;
            }

            .show-info {
                margin-top: 10px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;

                ion-icon {
                    font-size: 2rem;
                    cursor: pointer;
                }

                .title {
                    font-family: 'Source Sans 3';
                    font-style: normal;
                    font-weight: 700;
                    font-size: 18px;
                    line-height: 26px;
                    color: #292A2C;
                    cursor: pointer;

                    transition: all 0.3s ease-in-out;

                    &:hover {
                        color: #00A0FF;
                        border-bottom: 1px solid #00A0FF;
                    }
                }
            }
        }

        .nothing {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            margin: 20px;
            width: 20vw;
            min-width: 390px;

            ion-icon {
                font-size: 2rem;
                margin-bottom: 20px;
            }

            .title {
                font-family: 'Source Sans 3';
                font-style: normal;
                font-weight: 700;
                font-size: 18px;
                line-height: 26px;
                color: #292A2C;
                margin-bottom: 16px;
            }
        }

        .pages {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            
            div {
                display: flex;
                flex-direction: row;

                .page {
                    margin: 5px;
                    font-family: 'Source Sans 3';
                    font-style: normal;
                    font-weight: 700;
                    font-size: 18px;
                    line-height: 26px;
                    color: #292A2C;
                    margin-bottom: 16px;

                    transition: all 0.3s ease-in-out;

                    &:hover {
                        color: #00A0FF;
                        text-decoration: underline;
                    }
                }

                .page-special {
                    margin: 5px;
                    font-family: 'Source Sans 3';
                    font-style: normal;
                    font-weight: 700;
                    font-size: 18px;
                    line-height: 26px;
                    color: #292A2C;
                    margin-bottom: 16px;

                }

                .selected {
                    color: #00A0FF;
                    text-decoration: underline;
                }
            }
        }
    }
</style>