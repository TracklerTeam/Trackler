<template>
    <div class="content">
        <div class="loading" v-if="loading">
            <easy-spinner size="90px" />
        </div>
        <div class="loaded" v-if="!loading">
            <div class="info">
                <div class="background">
                    <div class="content-bg">
                        <div class="nameInfo">
                            <h1>{{ show.name }}</h1>
                            <h3>{{ show.seasons.length }} Seasons {{ show.network ? `| ${show.network} ` : '' }}| {{show.still_running ? 'Still Running' : 'Ended'}}</h3>
                        </div>
                        <div class="followBtn" @click="followUnfollow">
                            <span v-if="!followed">FOLLOW SHOW</span>
                            <span v-if="followed">UNFOLLOW SHOW</span>
                            <ion-icon v-if="!followed" name="add-circle-outline"></ion-icon>
                            <ion-icon v-if="followed" name="remove-circle-outline"></ion-icon>
                        </div>
                    </div>
                </div>
                <img class="showImg" :src="show.image ? show.image : 'https://via.placeholder.com/500x281'" height="500" width="281" />
                <div class="description">
                    <p>{{ show.description ? show.description : '' }}</p>
                </div>
            </div>
            <div class="rest">
                <hr />
                <div class="episodeList">
                    <div class="headerEpisode">
                        <div class="titleHead">
                            <ion-icon name="list-outline"></ion-icon>
                            <span>Episodes</span>
                        </div>
                        <div class="formkitMine">
                            <FormKit
                                type="select"
                                :options="seasons"
                                v-model="seasonSelected"
                            />
                        </div>
                    </div>
                    <div class="episodesList">
                        <div class="ep" v-for="episode in episodes" :key="episode._id">
                            <img :src="episode.image ? episode.image : 'https://via.placeholder.com/500x281'"/>
                            <div class="info">
                                <div class="title">
                                    <h2>{{ `${episode.number}x${seasonSelected.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})} - ${episode.name}`}}</h2>
                                    <h3>{{ `${episode.air_date ? `${episode.air_date} - ${episode.duration}` : episode.duration}` }}m</h3>
                                </div>
                                <ion-icon v-if="!episodesWatched.includes(parseInt(episode._id))" name="eye-outline" @click="watchEpisode(episode._id)"></ion-icon>
                                <ion-icon v-if="episodesWatched.includes(parseInt(episode._id))" name="eye-off-outline" @click="unwatchEpisode(episode._id)"></ion-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from "axios";
import { API_URL } from "@/utils/constants";
import { useUserStore } from "@/stores/userStore";

export default {
    name: "Show",
    mounted: async function() {
        this.prepare();
        this.user = useUserStore().user;
    },
    props: {
        id: {}
    },
    data: function() {
        return {
            show: {},
            loading: true,
            user: {},
            seasons: [],
            episodes: [],
            seasonSelected: 1,
            followed: false,
            episodesWatched: []
        };
    },
    methods: {
        prepare: async function() {
            let response = null;

            try {
                response = await axios.get(`${API_URL}/show/getShow/${this.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                this.show = response.data;
                this.loading = false;

                this.seasons = this.show.seasons.map(season => {
                    return {
                        value: season.number,
                        label: `Season ${season.number}`
                    };
                });

                this.episodes = this.show.seasons[0].episodes;

                this.followed = this.user.followed_shows.includes(parseInt(this.show._id));
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
        },
        followUnfollow: async function () {
            let response = null;

            try {
                if(this.followed) {
                    response = await axios.get(`${API_URL}/user/show/unfollow/${this.show._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                } else {
                    response = await axios.get(`${API_URL}/user/show/follow/${this.show._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                }

                this.followedShows = response.data;
                useUserStore().updateFollowed(this.followedShows);

                this.followed = !this.followed;
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
    }, 
    watch: {
        seasonSelected: async function() {
            this.episodes = this.show.seasons[this.seasonSelected - 1].episodes;
        }
    }
}
</script>

<style lang="scss" scoped>
    .content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;

        .loading {
            margin-left: 210px;
            margin-top: 50px;
        }

        .loaded {
            .description {
                margin-left: 561px;
                margin-top: 40px;

                font-family: 'Source Sans 3';
                font-style: normal;
                font-weight: 400;
                font-size: 24px;
                line-height: 28px;
            }

            .rest {
                position: absolute;
                top: 500px;
                left: 200px;

                width: calc(100% - 200px);
                height: calc(100% - 520px);

                hr {
                    margin: 20px;
                    padding: 0.3px;
                    background: #292A2C;;
                    opacity: 0.5;
                }

                .episodeList {
                    display: flex;
                    flex-direction: column;
                    height: 100%;

                    .episodesList {
                        display: flex;
                        flex-direction: row;
                        margin-left: 40px;
                        margin-right: 40px;
                        width: calc(100% - 80px);
                        flex-wrap: wrap;
                        align-items: center;
                        justify-content: center;

                        .ep {
                            display: flex;
                            flex-direction: column;
                            width: 500px;
                            margin: 20px;
                            min-height: 250px;
                            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);

                            img {
                                width: 100%;
                            }

                            .info {
                                display: flex;
                                flex-direction: row;
                                justify-content: space-between;
                                align-items: center;
                                min-height: 90px;
                                margin-left: 10px;
                                margin-right:10px;

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

                    .headerEpisode {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        margin-left: 40px;
                        margin-right: 40px;
                        width: calc(100% - 80px);

                        .formkitMine {
                            order: 2;

                            font-family: 'Source Sans 3';
                            font-style: normal;
                            font-size: 18px;
                            line-height: 20px;
                        }

                        .titleHead {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            justify-content: flex-start;

                            ion-icon {
                                font-size: 30px;
                                margin-right: 10px;
                            }

                            span {
                                font-family: 'Source Sans 3';
                                font-style: normal;
                                font-weight: 600;
                                font-size: 26px;
                                line-height: 24px;
                            }
                        }
                    }
                }
            }
            .background {
                background: #292A2C;
                width: 100%;
                height: 300px;
                
                .content-bg {
                    position: absolute;
                    display: flex;
                    flex-direction: row;
                    width: calc(100% - 561px);;
                    

                    top:80px;
                    left: 561px;
                    height: 220px;
                    align-items: center;

                    h1 {
                        font-family: 'Source Sans 3';
                        font-style: normal;
                        font-weight: 400;
                        font-size: 48px;
                        line-height: 68px;
                        color: #FFFFFF;
                    }

                    h3 {
                        font-family: 'Source Sans 3';
                        font-style: normal;
                        font-weight: 400;
                        font-size: 16px;
                        line-height: 23px;
                        color: #FFFFFF;
                    }

                    .followBtn {
                        background: #1E68FC;
                        color: white;

                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: center;

                        font-family: 'Source Sans 3';
                        font-style: normal;
                        font-weight: 1000;
                        font-size: 18px;
                        line-height: 18px;

                        padding: 10px;

                        ion-icon {
                            font-size: 24px;
                            margin-left: 5px;
                        }

                        margin-left: auto;
                        margin-right: 40px;
                        order: 2;
                        cursor: pointer;

                        transition: all 0.3s ease-in-out;

                        &:hover {
                            
                            background-color: #105bf3;
                        }
                    }
                }
            }

            .showImg {
                position: absolute;
                top: 80px;
                left: 240px;
            }
        }
    }
</style>