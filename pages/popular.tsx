import Image from 'next/image';
import { useRouter } from 'next/router';
import { TMDB_API_KEY } from '../constants';
import { GetServerSideProps } from 'next';

interface Movie {
  id: string | number;
  adult: boolean;
  backdrop_path?: string;
  genre_ids: number[];
  original_title: string;
  title: string;
  release_date: string;
}

interface TMDBResponse {
  page?: number | string;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

async function getMovies(page = 1): Promise<TMDBResponse> {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`,
  );
  const data = await response.json();

  return data;
}

export default function Popular({ movies }: { movies: TMDBResponse }) {
  const router = useRouter();
  const nextPage = () => {
    if (!movies.page) return;
    router.push(`/popular?page=${(movies.page as number) + 1}`);
  };

  const prevPage = () => {
    if (!movies.page || movies.page === 1) return;
    router.push(`/popular?page=${(movies.page as number) - 1}`);
  };
  return (
    <>
      <div className='w-full max-w-4xl mx-auto'>
        <div className=' grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] grid-flow-row gap-8 place-items-stretch mt-8'>
          {movies.results?.map((movie) => (
            <div
              key={movie.id}
              className='rounded overflow-hidden bg-white shadow-xl'
            >
              <Image
                width={300}
                height={500}
                alt={movie.title}
                src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                className='object-cover w-full'
              />
              <h2 className='text-lg font-semibold text-center'>
                {movie.title}
              </h2>
            </div>
          ))}
        </div>
        <div className='flex justify-center gap-10 my-10'>
          <button
            onClick={prevPage}
            className='px-4 py-2 rounded text-white bg-indigo-500 hover:bg-indigo-600 transition-colors uppercase font-semibold'
          >
            Prev
          </button>
          <button
            onClick={nextPage}
            className='px-4 py-2 rounded text-white bg-indigo-500 hover:bg-indigo-600 transition-colors uppercase font-semibold'
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { page = '1' } = context.query;
  const movies = await getMovies(parseInt(page as string, 10));
  return {
    props: {
      movies,
    },
  };
};
