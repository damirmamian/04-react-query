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
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import Pagination from "../Pagination/Pagination";



export default function App() {

  const [movies, setMovies] = useState<Movie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);
  const [topic, setTopic] = useState('');

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movie', topic, page],
    queryFn: () => fetchMovies(topic, page),
    enabled: topic !== '',
    placeholderData: keepPreviousData,
  });
  const totalPages = data?.total_pages ?? 0
  const totalMovies = data?.results ?? []


  const handleSearch = async (topic: string) => {
    setTopic(topic)
    setMovies([])
    setPage(1)


    try {
      const data = await fetchMovies(topic, page)

      if (topic == "") {
        toast.error("Please enter your search query.")
      } else if (data.results.length === 0) {
        toast.error("No movies found for your request.")
        return
      }

      setMovies(totalMovies)
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.log(error);
    }
  }

  return (<div className={css.app}>
    <Toaster
      position="top-center"
      reverseOrder={true}
    />
    <SearchBar onSubmit={handleSearch} />
    {isLoading && <Loader />}
    {isError && <ErrorMessage />}
    {isSuccess && totalPages > 1 && <Pagination totalPages={totalPages} page={page} onPageChange={setPage} />}
    {movies.length > 0 && <MovieGrid movies={totalMovies} onSelect={setSelectedMovie} />}
    {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
  </div>)
}

