import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function PokemonList() {
    const [data, setData] = useState(null);
    const [verifyData, setVerifyData] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [loadingVerifyData, setLoadingVerifyData] = useState(true);
    const [errorData, setErrorData] = useState(null);
    const [errorVerifyData, setErrorVerifyData] = useState(null);
    const [answerImageUrl, setAnswerImageUrl] = useState(null);
    const [answerImageUrlFromVerify, setAnswerImageUrlFromVerify] = useState(null)
    const [result, setResult] = useState(null);
    const [displayMessage, setDisplayMessage] = useState(null)
    const [displayPokemonName, setDisplayPokemonName] = useState(null)
    const [gameStarted, setGameStarted] = useState(false);
    const [gameRestarted, setGameRestarted] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/getpokemons');
                if (response != null) {
                    setData(response.data);
                }
                const answerPokemon = response.data.allPokemons.find(pokemon => pokemon._isAnswer);
                if (answerPokemon) {
                    setAnswerImageUrl(answerPokemon._originalImageURI);
                }
            } catch (error) {
                setErrorData(error.message);
            } finally {
                setLoadingData(false);
            }
        };

        if (gameStarted || gameRestarted) {
            fetchData();
        }
        
    }, [gameStarted, gameRestarted]);

    const handleStartGame = () => {
        setGameStarted(true); // Update gameStarted state when button is clicked
    };

    const handleRestartGame = () => {
        setGameRestarted(true);
        //setGameStarted(true);
        setLoadingData(true);
        setAnswerImageUrlFromVerify("");
        setResult("")
        setDisplayMessage("")
        setDisplayPokemonName("")
    };

    const fetchVerifyData = async (pokemonId, pokemonName) => {
        try {
            const url = `http://127.0.0.1:5000/api/verifypokemon/${pokemonId}/${pokemonName}`;
            const response = await axios.get(url);
            setVerifyData(response.data)
            console.log(verifyData)
            const answerPokemonUrl = response.data.correctPokemonImageUri;
            if (answerPokemonUrl) {
                setAnswerImageUrlFromVerify(answerPokemonUrl);
            }
            if (response.data.isAnswerCorrect === true) {
                setResult("YOU ARE CORRECT!")
            } else {
                setResult("WRONG ANSWER!")
            }
            setDisplayMessage(response.data.displayMessage)
            setDisplayPokemonName(`Real Pokemon is: ${response.data.correctPokemonName}`)

            console.log('Verify data:', response.data);
        } catch (error) {
            setErrorVerifyData(error.message)
            console.error('Error fetching verify data:', error);
        } finally {
            setLoadingVerifyData(false);
        }
    };


    return (
        <div className="pokemon-list" >
            {!gameStarted && (
                <button onClick={handleStartGame} className="start-button" >Start Game</button>
            )}
            <div className="data-section">
                {loadingData ? (
                    <p></p>
                ) : errorData ? (
                    <p>Error: {errorData}</p>
                ) : (
                    <div>
                        <h1>Guess the Pokemon!</h1>
                        <hr></hr>
                        <div className="grid-container">
                            <div>
                                {answerImageUrl && (
                                    <img className='silhouette-image'
                                        src={answerImageUrl}
                                        alt="Answer Pokemon"
                                    />
                                )}
                                <div className="button-container">
                                    {data.allPokemons.map((pokemon, index) => (
                                        <button
                                            key={index}
                                            onClick={() => fetchVerifyData(pokemon._id, pokemon._name)}
                                            className="custom-button"
                                            disabled={!gameRestarted && (verifyData && verifyData != null)}
                                        >
                                            {pokemon._name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                {loadingVerifyData ? (
                                    <p></p>
                                ) : errorVerifyData ? (
                                    <p>Error: {errorVerifyData}</p>
                                ) : (
                                    <>
                                        {answerImageUrlFromVerify && (
                                            <img className="original-image"
                                                src={answerImageUrlFromVerify}
                                                alt="Answer Pokemon"
                                            />
                                        )}
                                        <h1>{result}</h1>
                                        <h2>{displayMessage}</h2>
                                        <h3>{displayPokemonName}</h3>
                                    </>
                                )}
                            </div>

                        </div>
                        {!gameRestarted && (
                            <button
                                onClick={handleRestartGame}
                                className="restart-button"
                                style={{ display: verifyData && verifyData != null ? 'block' : 'none' }}
                            >
                                Restart Game
                            </button>
                        )}
                        {/* <div className="button-container">
                            {data.allPokemons.map((pokemon, index) => (
                                <button key={index} onClick={() => fetchVerifyData(pokemon._id, pokemon._name)} className="custom-button">
                                    {pokemon._name}
                                </button>
                            ))}
                        </div> */}
                        {/* <div className="verify-section">
                            {loadingVerifyData ? (
                                <p></p>
                            ) : errorVerifyData ? (
                                <p>Error: {errorVerifyData}</p>
                            ) : (
                                <>
                                    <p>{result}</p>
                                    <p>{displayMessage}</p>
                                    <p>{displayPokemonName}</p>
                                    {answerImageUrlFromVerify && (
                                        <img
                                            src={answerImageUrlFromVerify}
                                            alt="Answer Pokemon"
                                            style={{
                                                maxWidth: '200px',
                                                maxHeight: '200px',
                                            }}
                                        />
                                    )}
                                </>
                            )}
                        </div> */}
                    </div>
                )}
            </div>
        </div>
    );

}

export default PokemonList;