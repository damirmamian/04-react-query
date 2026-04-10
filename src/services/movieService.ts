import axios from "axios";
import type { Movie } from "../types/movies";


interface fetchMoviesProps {
    results: Movie[];
    total_pages: number;
    total_results: number;
    page: number;
}

const movie = axios.create({
    baseURL: `https://api.themoviedb.org/3`,
    headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    }
})

export default async function fetchMovies(topic: string) {
    const response = await movie.get<fetchMoviesProps>(`/search/movie`, {
        params: {
            query: topic
        }
    })
    console.log(response.data);
    return response.data
}
