import { model, Model, Schema } from 'mongoose';

export interface IShow {
    _id: string;
    name: string;
    description: string;
    image: string;
    seasons: {
        _id: string;
        name: string;
        number: number;
        description: string;
        image: string;
        air_date: string;
        episodes: {
            _id: string;
            name: string;
            description: string;
            image: string;
            duration: number;
            number: number;
            air_date: string;
        }[];
    }[];
    year: number;
    still_running: boolean;
    network: string;
    network_id: string;
    genre: string[];
    updatedAt: Date;
};

const IShowSchema = new Schema<IShow>(
{
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    image: { type: String, required: false },
    seasons: { type: [{
        _id: { type: String, required: true },
        name: { type: String, required: true },
        number: { type: Number, required: true },
        description: { type: String, required: false },
        image: { type: String, required: false },
        episodes: { type: [{
            _id: { type: String, required: true },
            name: { type: String, required: true },
            description: { type: String, required: false },
            image: { type: String, required: false },
            duration: { type: Number, required: false },
            number: { type: Number, required: true },
            air_date: { type: String, required: false }
        }], required: false },
    }], required: false },
    year: { type: Number, required: false },
    still_running: { type: Boolean, required: true },
    network: { type: String, required: false },
    network_id: { type: String, required: false },
    genre: { type: [String], required: false },
    updatedAt: { type: Date, required: true }
},
{ collection: 'show', timestamps: false }
);

export const ShowModel: Model<IShow> = model('show', IShowSchema);