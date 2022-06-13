import axios from 'axios';
import { IShow, ShowModel } from "../database/schema/showSchema";
import moment from 'moment';

export const addShow = async (id: string) => {
    try {
        const response = await axios.get(`${process.env.TMDB_URL}/tv/${id}?api_key=${process.env.TMDB_KEY}&language=en-US`);

        const newShow = new ShowModel({
            _id: response.data.id,
            name: response.data.name ? response.data.name : '',
            description: response.data.overview ? response.data.overview : '',
            image: response.data.poster_path ? `${process.env.TMDB_IMG_URL}/w500${response.data.poster_path}` : '',
            seasons: [],
            year: response.data.first_air_date ? response.data.first_air_date.substring(0, 4) : 0,
            still_running: response.data.in_production ? response.data.in_production : false,
            network: response.data.networks.length ? response.data.networks[0].name : '',
            network_id: response.data.networks.length ? response.data.networks[0].id : '',
            genre: response.data.genres.length ? response.data.genres.map((genre: { name: any }) => genre.name) : [],
            updatedAt: moment().toDate()
        });

        const seasons = [];
        for (let i = 1; i <= response.data.number_of_seasons; i++) {
            const seasonResponse = await axios.get(`${process.env.TMDB_URL}/tv/${id}/season/${i}?api_key=${process.env.TMDB_KEY}&language=en-US`);

            seasons.push({
                _id: seasonResponse.data._id,
                name: seasonResponse.data.name ? seasonResponse.data.name : '',
                number: seasonResponse.data.season_number ? seasonResponse.data.season_number : i,
                description: seasonResponse.data.overview ? seasonResponse.data.overview : '',
                image: seasonResponse.data.poster_path ? `${process.env.TMDB_IMG_URL}/w500${seasonResponse.data.poster_path}` : '',
                air_date: seasonResponse.data.air_date ? seasonResponse.data.air_date : '',
                episodes: [],
            });

            const episodes = [];
            for (let j = 1; j <= seasonResponse.data.episodes.length; j++) {
                episodes.push({
                    _id: seasonResponse.data.episodes[j - 1].id,
                    name: seasonResponse.data.episodes[j - 1].name ? seasonResponse.data.episodes[j - 1].name : '',
                    description: seasonResponse.data.episodes[j - 1].overview ? seasonResponse.data.episodes[j - 1].overview : '',
                    image: seasonResponse.data.episodes[j - 1].still_path ? `${process.env.TMDB_IMG_URL}/w500${seasonResponse.data.episodes[j - 1].still_path}` : '',
                    duration: seasonResponse.data.episodes[j - 1].runtime ? seasonResponse.data.episodes[j - 1].runtime : 0,
                    number: seasonResponse.data.episodes[j - 1].episode_number ? seasonResponse.data.episodes[j - 1].episode_number : j,
                    air_date: seasonResponse.data.episodes[j - 1].air_date ? seasonResponse.data.episodes[j - 1].air_date : '',
                });
            }
            seasons[i - 1].episodes = episodes;
        }

        newShow.seasons = seasons;
        newShow.save();

        return newShow;
    } catch (error) {
        throw error;
    }
}