import { useState, useEffect } from 'react';
import axios from 'axios';

function Watchlist() {

    const [searchTitle, setSearchTitle] = useState(''); // Holds input value
    const [searchResults, setSearchResults] = useState([]); // Stores API results
    const [loading, setLoading] = useState(false); // For loading state
    const [error, setError] = useState(''); // For error messages 
    const [watchlist, setWatchlist] = useState([]); // Stores watchlist movies
    const [view, setView] = useState('search'); // 'search' or 'watchlist'

    //Save searchResults to localStorage whenever it changes
    //  useEffect(() => {
    //     localStorage.setItem('searchResults', JSON.stringify(searchResults));
    // }, [searchResults]);

    // // Load searchResults from localStorage on component mount
    // useEffect(() => {
    //     const savedResults = localStorage.getItem('searchResults');
    //     console.log('Loading from localStorage: ', savedResults);
    //     if (savedResults) {
    //         try {
    //             const parsedResults = JSON.parse(savedResults);
    //             console.log('Parsed results: ', parsedResults);
    //             setSearchResults(parsedResults);
    //         } catch (error) {
    //             console.error('Error parsing localStorage data: ', error);
    //         }
    //     }
    // }, []);


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

    const handleAdd = async (imdbID) => {
        try {
            const res = await axios.post('http://localhost:3000/movies/watchlist', { imdbID });
            console.log("Movie added:", res.data);
            setWatchlist(prev => [...prev, res.data.movie || res.data]);
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
                <button>WATCHED</button>
            </div>

            <div>
                {view === 'watchlist' ? (
                    <div>
                        <h2>Saved Watchlist</h2>
                        <ul>
                            {watchlist.map((movie) => (
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