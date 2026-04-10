import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import fetchMovies from "../../services/movieService";
import { toast, Toaster } from 'react-hot-toast';
import { useState } from "react";
import type { Movie } from "../../types/movies";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function App() {

  const [movies, setMovies] = useState<Movie[]>([])
  const [loader, setLoader] = useState(false)
  const [error, setError] = useState(false)

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (topic: string) => {

    setMovies([])
    setLoader(true)
    setError(false)


    try {
      const data = await fetchMovies(topic)

      if (topic == "") {
        toast.error("Please enter your search query.")
      }
      if (data.results.length === 0) {
        toast.error("No movies found for your request.")
        return
      }

      setMovies(data.results)
      console.log(movies)

    } catch (error) {
      setError(true)
      toast.error("An error occurred. Please try again.");

    } finally {
      setLoader(false)

    }
  }


  return (<div className={css.app}>
    <Toaster
      position="top-center"
      reverseOrder={true}
    />

    <SearchBar onSubmit={handleSearch} />
    {loader && <Loader />}
    {error && <ErrorMessage />}

    {movies.length > 0 && <MovieGrid movies={movies} onSelect={setSelectedMovie} />}
    {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
  </div>)
}

