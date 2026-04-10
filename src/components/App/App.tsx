import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import fetchMovies from "../../services/movieService";
import { toast, Toaster } from 'react-hot-toast';
import { useState, useEffect } from "react";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import Pagination from "../Pagination/Pagination";



export default function App() {

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

  const handleSearch = (topic: string) => {
    setTopic(topic)
    setPage(1)
  }

  useEffect(() => {
    if (isSuccess && data?.results?.length === 0 && topic !== "") {
      toast.error("No movies found for your request.");
    }
  }, [data, isSuccess, topic]);

  const openMovieModal = (movie: Movie) => {
    setSelectedMovie(movie);
  }
  const closeMovieModal = () => {
    setSelectedMovie(null);
  };

  return (<div className={css.app}>
    <Toaster
      position="top-center"
      reverseOrder={true}
    />
    <SearchBar onSubmit={handleSearch} />
    {isLoading && <Loader />}
    {isError && <ErrorMessage />}
    {isSuccess && totalPages > 1 && <Pagination pageCount={totalPages} forcePage={page} onPageChange={setPage} />}
    {data && data?.results.length > 0 && <MovieGrid movies={data.results} onSelect={openMovieModal} />}
    {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeMovieModal} />}
  </div>)
}

