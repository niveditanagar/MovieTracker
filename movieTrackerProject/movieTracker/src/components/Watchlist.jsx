import { useState, useEffect } from 'react';
import axios from 'axios';

function Watchlist() {

    const [searchTitle, setSearchTitle] = useState(''); // Holds input value
    const [searchResults, setSearchResults] = useState([]); // Stores API results
    const [loading, setLoading] = useState(false); // For loading state
    const [error, setError] = useState(''); // For error messages 
    const [watchlist, setWatchlist] = useState([]); // Stores watchlist movies
    const [view, setView] = useState('search'); // 'search' or 'watchlist'

    const fetchWachList = async () => {
        try {
            const res = await axios.get('http://localhost:3000/movies');
            setWatchlist(res.data);
        } catch (error) {
            console.error('Error fetching watchlist: ', error);
        }
    }

    useEffect(() => {
        fetchWachList();
    }, []);


    const handleSearch = async () => {
        if (!searchTitle.trim()) {
            setError('Please enter a movie title');
            return;
        }

        setLoading(true);
        setError('');
        setSearchResults([]);

        try {
            const response = await axios.get(`http://localhost:3000/movies/search?title=${encodeURIComponent(searchTitle)}`);
            setSearchResults(response.data);
            setView('search');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occured while search.');
        } finally {
            setLoading(false);
        }
    }

        const handleWatched = async (imdbID) => {
        try {
            const res = await axios.patch(`http://localhost:3000/movies/watched/${imdbID}`)
            console.log("handle watched: ", res.data)
            const updatedMovie = res.data.updatedMovie;
            // Update local state to reflect the change
            setWatchlist(prev => prev.map(movie =>
                movie.imdbID === imdbID ? updatedMovie : movie
            ));
        } catch (error) {
            console.error(error);
        }
    }

    const handleAdd = async (imdbID) => {
        try {
            const res = await axios.post('http://localhost:3000/movies/watchlist', { imdbID });
            //const newMovie = res.data.newMoive;
            console.log("Movie added:", res.data);
            await fetchWachList();
            //setWatchlist(prev => [...prev, newMovie]);
        } catch (error) {
            console.error(error);
        }
    };


    return (

        <div>
            <input
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
            />
            <button onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
            </button>

            <div>
                <button onClick={() => setView('watchlist')}>WATCHLIST</button>
                <button onClick={() => setView('watched')}>WATCHED</button>
            </div>

            <div>
                {view === 'watchlist' ? (
                    <div>
                        <h2>Saved Watchlist</h2>
                        <ul>
                            {watchlist.map((movie) => (
                                <li key={movie.imdbID}>
                                    {movie.title} ({movie.year})
                                    {!movie.watched && (
                                        <button onClick={() => handleWatched(movie.imdbID)}>
                                            Mark as Watched
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : view === 'watched' ? (
                    <div>
                        <h2>Watched Movies</h2>
                        <ul>
                            {watchlist.filter(movie => movie.watched).map((movie) => (
                                <li key={movie.imdbID}>
                                    {movie.title} ({movie.year})
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div>
                        <ul>
                            {searchResults.map((movie) => (
                                <li key={movie.imdbID}>
                                    {movie.Title} ({movie.Year})
                                    <button onClick={() => handleAdd(movie.imdbID)}>Add</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>

    )
}

export default Watchlist;