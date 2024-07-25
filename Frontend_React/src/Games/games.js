import "./games.css";
import React, { useState, useEffect } from "react";

function Game() {
    const [showGame, setShowGame] = useState(null);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);

    }, []);

    const handleClick = (game) => {
        setShowGame(game);
    };

    return (
        <div className="game-container">
            <div className="game-images">
                <img src="https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,f=auto/64f6163d6918e93386f57b2a729fd6c0.png" alt="sugar" className="game-image" onClick={() => handleClick("sugar-sugar")} />
                <img src="https://play-lh.googleusercontent.com/lCbn5iYc9wRgsyoJwgxsbE-Ho3tPLLi_94-HaRZ2Zs2mXotvBuYj5nFAJZPCVXF7chFO" alt="cut the rope" className="game-image" onClick={() => handleClick("cut-the-rope")} />
                <img src="https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,f=auto/f4b3ac7fe25cad9bc028b33f7a407f28.png" alt="temple run" className="game-image" onClick={() => handleClick("temple-run-2")} />
                {isSmallScreen ? (
                    <img src="https://cdn2.steamgriddb.com/icon_thumb/45b4f8abe6c172cab391e43e1e0e6611.png" alt="bad ice cream" className="game-image" onClick={() => handleClick("subway-surfer-world-tour-zurich")} />
                ) :  <img src="https://img.gamepix.com/games/cream/icon/cream.png" alt="bad ice cream" className="game-image" onClick={() => handleClick("bad-ice-cream")} />}
            </div>
                {showGame ? (
                    <iframe
                        src={`https://www.miniplay.com/embed/${showGame}`}
                        style={{ width: '100%', height: '100%' }}
                        title={showGame}
                        allowFullScreen
                    />
                ) : (
                    <div className="pick-game">Pick a game</div>
                )}
            
        </div>
    );
}

export default Game; 