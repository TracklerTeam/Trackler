<template>
    <div class="contentContainer">
        <div class="loading" v-if="loading">
            <easy-spinner size="90px" />
        </div>
        <div class="congrats" v-if="!this.unwatched.length && !loading">
            <ion-icon name="checkmark-circle-outline"></ion-icon>
            <span>You have watched everything!</span>
        </div>
        <div class="notWatched" v-if="this.unwatched.length && !loading">
            <ion-icon name="list-outline"></ion-icon>
            <h1>Not Watched ({{ this.unwatched.length }})</h1>
        </div>
        <div class="episodesList">
            <div class="ep" v-for="show in unwatched" :key="show.show._id">
                <img :src="show.nextEpisode.image ? show.nextEpisode.image : 'https://via.placeholder.com/500x281'" />
                <hr :style="[{width: `${show.watchedEpisodes ? (show.watchedEpisodes / show.totalEpisodes) * 100 : 0}%`}]"/>
                <div class="info">
                    <div class="title">
                        <h2>{{ `${show.seasonNumber}x${show.nextEpisode.number.toLocaleString('en-US',
                                { minimumIntegerDigits: 2, useGrouping: false })} - ${show.nextEpisode.name}`
                        }}</h2>
                        <h3 class="showName" @click="$router.push(`/show/${show.show._id}`)">{{ `${show.show.name}` }}</h3>
                        <h3>{{ `+${show.remainingSeasonEpisodes}/+${show.totalEpisodes - show.watchedEpisodes} Episodes` }}
                        </h3>
                    </div>
                    <ion-icon name="eye-outline" @click="watchEpisode(show.show._id, show.nextEpisode._id)"></ion-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from "axios";
import { useUserStore } from "@/stores/userStore";
import { API_URL } from "@/utils/constants";
import router from "@/router";

export default {
    name: 'Dashboard',
    data: () => {
        return {
            unwatched: [],
            loading: true
        }
    },
    mounted: function () {
        this.prepare();
    },
    methods: {
        prepare: async function (): Promise<void> {
            try {
                const response = await axios.get(`${API_URL}/user/show/getDashboard`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                this.unwatched = response.data;
                this.loading = false;
            } catch (error: any) {
                if (error.response.status === 401)
                    return useUserStore().logout();

                return this.$toast.open({
                    message: 'Something went wrong',
                    type: "error",
                    duration: 10000,
                    queue: false
                });
            }
        },
        watchEpisode: async function(showId: String, episodeId: String): Promise<any> {
            try {
                await axios.get(`${API_URL}/user/show/${showId}/watch/${episodeId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                const response = await axios.get(`${API_URL}/user/show/${showId}/getStats`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                this.unwatched = this.unwatched.map((show: any) => {
                    if (show.show._id === showId)
                        return response.data;
                    
                    return show;
                }).filter((show: any) => show.nextEpisode);
            } catch (error: any) {
                if(error.response.status === 401)
                    return useUserStore().logout();

                return this.$toast.open({
                    message: error.response.data.error,
                    type: "error",
                    duration: 10000,
                    queue: false               
                });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.contentContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: calc(100% - 240px);

    .episodesList {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
    }

    .notWatched {
        display: flex;
        flex-direction: row;
        align-items: center;
        text-align: center;

        ion-icon {
            font-size: 50px;
            margin-left: 10px;
        }

        h1 {
            margin-left: 10px;

            font-family: 'Source Sans 3';
            font-style: normal;
            font-weight: 700;
            font-size: 24px;
            line-height: 26px;
        }
    }

    .congrats {
        display: flex;
        flex-direction: column;
        align-items: center;

        ion-icon {
            font-size: 100px;
            color: green;
            margin-bottom: 20px;
        }

        span {
            margin-bottom: 20px;

            font-family: 'Source Sans 3';
            font-style: normal;
            font-weight: 700;
            font-size: 24px;
            line-height: 26px;

            color: green;
        }
    }

    .ep {
        display: flex;
        flex-direction: column;
        width: 500px;
        margin: 20px;
        min-height: 250px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

        hr {
            height: 5px;
            background-color: green;
            margin: 0;
            padding: 0;
            border: 0;
        }

        img {
            width: 100%;
        }

        .info {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            min-height: 110px;
            margin-left: 10px;
            margin-right: 10px;

            .title {
                h2 {
                    font-family: 'Source Sans 3';
                    font-style: normal;
                    font-weight: 600;
                    font-size: 20px;
                    line-height: 26px;
                }

                h3 {
                    font-family: 'Source Sans 3';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 18px;
                    line-height: 23px;
                }

                .showName {
                    cursor: pointer;
                    transition: all 0.3s ease-in-out;

                    &:hover {
                        color: #1E68FC;
                        text-decoration: underline;
                    }
                }
            }

            ion-icon {
                font-size: 24px;
                color: #292A2C;
                min-width: 30px;

                cursor: pointer;
                transition: all 0.3s ease-in-out;

                &:hover {
                    color: #1E68FC;
                }
            }
        }
    }
}
</style>