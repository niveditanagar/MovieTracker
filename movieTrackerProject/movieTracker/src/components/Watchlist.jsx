import { useState, useEffect } from 'react';
import axios from 'axios';

function Watchlist() {

    const [searchTitle, setSearchTitle] = useState(''); // Holds input value
    const [searchResults, setSearchResults] = useState([]); // Stores API results
    const [loading, setLoading] = useState(false); // For loading state
    const [error, setError] = useState(''); // For error messages 

    //Save searchResults to localStorage whenever it changes
     useEffect(() => {
        localStorage.setItem('searchResults', JSON.stringify(searchResults));
    }, [searchResults]);

    // Load searchResults from localStorage on component mount
    useEffect(() => {
        const savedResults = localStorage.getItem('searchResults');
        console.log('Loading from localStorage: ', savedResults);
        if (savedResults) {
            try {
                const parsedResults = JSON.parse(savedResults);
                console.log('Parsed results: ', parsedResults);
                setSearchResults(parsedResults);
            } catch (error) {
                console.error('Error parsing localStorage data: ', error);
            }
        }
    }, []);

    const handleSearch = async () => {
        if(!searchTitle.trim()) {
            setError('Please enter a movie title');
            return;
        }

        setLoading(true);
        setError('');
        setSearchResults([]);

        try {
            const response = await axios.get(`http://localhost:3000/movies/search?title=${encodeURIComponent(searchTitle)}`);
            setSearchResults(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occured while search.');
        } finally {
            setLoading(false);
        }
    }

    const handleAdd = async (imdbID) => {
        try {
          const res = await axios.post('http://localhost:3000/movies/watchlist', { imdbID });
          console.log("response:", res);
        } catch (error) {
            console.error(error); 
        }
    };

    // useEffect(() => {
    //     const fetchMovies = async () => {
    //         try {
    //             const response = await fetch('/api/movies')
    //             const data = await response.json();
    //             console.log('this is data: ', data);
    //             setMovies(data);
    //         } catch (error) {
    //             console.error('Error fetching mvoies: ', error);
    //         }
    //     }

    //     fetchMovies();
    // }, []);


    return (
       
         <div>
            <input 
                value = {searchTitle}
                onChange = {(e) => setSearchTitle(e.target.value)}
            />
            <button onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
            </button>
            

            <div>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                {searchResults.map((movie, index) => (
                <li key={movie.imdbID || index}>
                    {movie.Title} ({movie.Year})
                <button onClick={() => handleAdd(movie.imdbID)}>Add</button>
                </li>
                ))}
                </ul>
            </div>
        </div>

    )
}

export default Watchlist;