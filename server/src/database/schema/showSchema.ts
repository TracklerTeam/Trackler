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
    description: { type: String, required: true },
    image: { type: String, required: false },
    seasons: { type: [{
        _id: { type: String, required: true },
        name: { type: String, required: true },
        number: { type: Number, required: true },
        description: { type: String, required: true },
        image: { type: String, required: false },
        episodes: { type: [{
            _id: { type: String, required: true },
            name: { type: String, required: true },
            description: { type: String, required: true },
            image: { type: String, required: false },
            duration: { type: Number, required: true },
            number: { type: Number, required: true },
        }], required: true },
    }], required: true },
    year: { type: Number, required: true },
    still_running: { type: Boolean, required: true },
    network: { type: String, required: true },
    network_id: { type: String, required: true },
    genre: { type: [String], required: true },
    updatedAt: { type: Date, required: true }
},
{ collection: 'show', timestamps: false }
);

export const ShowModel: Model<IShow> = model('show', IShowSchema);