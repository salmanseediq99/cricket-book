import { useState } from "react";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [player1, setPlayer1] = useState(false);
  const [player2, setPlayer2] = useState(false);
  const [playerScore1, setPlayerScore1] = useState(0);
  const [playerScore2, setPlayerScore2] = useState(0);
  const [playerWicket1, setPlayerWicket1] = useState(0);
  const [playerWicket2, setPlayerWicket2] = useState(0);
  let [quitGame, setQuitGame] = useState(false);

  //advanced game features
  const [overs, setOvers] = useState("");
  const [wicket, setWicket] = useState(1);
  const [remainingBalls, setRemainingBalls] = useState(0);

  function startGame() {
    setPlayer1(true);
    setPlayer2(false);
    setPlayerScore1(0);
    setPlayerScore2(0);
    setPlayerWicket1(0);
    setPlayerWicket2(0);
    setPlayer1(true);
    setRemainingBalls(overs);
  }

  function player1Play(e) {
    e.preventDefault();
    if (gameStarted && player1 && playerWicket1 !== wicket) {
      const random = Math.floor(Math.random() * 7);
      setPlayerScore1((score) => score + random);
      setRemainingBalls((balls) => balls - 1);
      if (random === 0) {
        setPlayerWicket1((w) => w + 1);
      }
    }
    if (remainingBalls === 1 || playerWicket1 === wicket) {
      // When Player 1 finishes all balls
      setPlayer1(false);
      setPlayer2(true);
      setRemainingBalls(overs); // Reset balls for Player 2
    }
  }
  function player2Play(e) {
    e.preventDefault();
    if (
      gameStarted &&
      player2 &&
      playerWicket2 !== wicket &&
      playerScore2 <= playerScore1
    ) {
      const random = Math.floor(Math.random() * 7);
      setPlayerScore2((score) => score + random);
      setRemainingBalls((balls) => balls - 1);
      if (random === 0) {
        setPlayerWicket2((w) => w + 1);
      }
    }
    if (remainingBalls === 1 || playerWicket2 === wicket) {
      // When Player 1 finishes all balls
      setPlayer2(false);
    }
  }

  function quit() {
    setGameStarted(false);
    setQuitGame(true);
    setPlayer1(false);
    setPlayer2(false);
    setPlayerScore1(0);
    setPlayerScore2(0);
    setPlayerWicket1(0);
    setPlayerWicket2(0);
  }

  const getResult = () => {
    // If the match is tied
    if (playerScore2 === playerScore1 && playerWicket2 === wicket) {
      return "Match Tied";
    }

    // If Player 2 wins outright
    if (playerScore2 > playerScore1 && playerWicket2 < wicket) {
      return `Player 2 wins with ${wicket - playerWicket2} wickets remaining.`;
    }

    // If Player 1 wins outright
    if (playerWicket2 === wicket || remainingBalls === 0) {
      if (playerScore1 > playerScore2) {
        return `Player 1 wins by ${playerScore1 - playerScore2} runs`;
      }
    }

    // If Player 2 is actively chasing and balls are remaining
    if (player2 && remainingBalls > 0) {
      return `Player 2 needs ${
        playerScore1 - playerScore2 + 1
      } runs from ${remainingBalls} balls`;
    }

    // If Player 1 finishes and Player 2 needs a target
    if (!player1 && player2 && playerWicket2 < wicket && remainingBalls === 0) {
      return `Player 2 needs ${
        playerScore1 - playerScore2 + 1
      } runs to win the match`;
    }

    // Default case (should not trigger under normal conditions)
    return "";
  };

  return (
    <>
      {gameStarted && !player1 && !player2 ? (
        <div className="start-div">
          <button className="start" onClick={startGame}>
            Start Game
          </button>
        </div>
      ) : null}
      {player1 === false && player2 === true && (
        <p className="message">{getResult()}</p>
      )}
      <nav>
        <h1>React Cricket</h1>
        {gameStarted ? (
          <div>
            <button className="quit" onClick={quit}>
              Quit Game
            </button>
          </div>
        ) : null}
      </nav>

      <main>
        <Form
          overs={overs}
          setOvers={setOvers}
          wicket={wicket}
          setWicket={setWicket}
          gameStarted={gameStarted}
          setGameStarted={setGameStarted}
        />
        <TeamOne
          score1={playerScore1}
          wicket={playerWicket1}
          player1={player1}
          player1Play={player1Play}
          gameStarted={gameStarted}
          overs={overs}
          total={wicket}
          remainingBalls={remainingBalls}
        />
        <TeamTwo
          score2={playerScore2}
          wicket={playerWicket2}
          player2={player2}
          player2Play={player2Play}
          gameStarted={gameStarted}
          overs={overs}
          total={wicket}
          remainingBalls={remainingBalls}
        />
      </main>
      <Footer gameStarted={gameStarted} />
    </>
  );
}

function TeamOne({
  score1,
  wicket,
  total,
  player1,
  player1Play,
  gameStarted,
  overs,
  remainingBalls,
}) {
  return (
    <>
      {gameStarted ? (
        <div className={`team-1 ${!player1 ? "end-of-play" : ""}`}>
          <h3 className="team-1-name">Team 1</h3>
          <div>
            <h2 className="team-1-score">
              {score1}/{wicket}
            </h2>
            <p>Runs/ Wicket</p>
          </div>
          <button
            className="start"
            onClick={player1Play}
            disabled={!gameStarted || !player1}
          >
            Play
          </button>
          <h4 className="over">Balls Remaining : {remainingBalls}</h4>
          <h4 className="team-1-wickets">
            Wickets Remaining : {total - wicket}
          </h4>
        </div>
      ) : null}
    </>
  );
}
function TeamTwo({
  score2,
  wicket,
  total,
  player2,
  player2Play,
  gameStarted,
  remainingBalls,
  overs,
}) {
  return (
    <>
      {gameStarted ? (
        <div className={`team-2 ${!player2 ? "end-of-play" : ""}`}>
          <h3 className="team-2-name">Team 2</h3>
          <div>
            <h2 className="team-2-score">
              {score2}/{wicket}
            </h2>
            <p>Runs/ Wicket</p>
          </div>
          <button
            className="start"
            onClick={player2Play}
            disabled={!gameStarted || !player2}
          >
            Play
          </button>
          <h4 className="over">Balls Remaining : {remainingBalls}</h4>
          <h4 className="team-2-wickets">
            Wickets Remaining : {total - wicket}
          </h4>
        </div>
      ) : null}
    </>
  );
}

function Form({
  overs,
  setOvers,
  wicket,
  setWicket,
  gameStarted,
  setGameStarted,
}) {
  function submitForm(e) {
    e.preventDefault();

    if (overs) {
      setGameStarted(true);
      setOvers((overs) => overs * 6);
    }
  }
  return (
    <>
      {!gameStarted ? (
        <div className="form-div">
          <h1>Welcome to React Cricket 2024</h1>
          <form onSubmit={submitForm}>
            <select
              className="select"
              value={overs}
              onChange={(e) => setOvers(Number(e.target.value))}
            >
              <option>Select Overs</option>
              {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
                <option value={i} key={i}>
                  {i}
                </option>
              ))}
            </select>
            <div className="range">
              <input
                className="slider"
                type="range"
                max="10"
                min="1"
                value={wicket}
                onChange={(e) => setWicket(Number(e.target.value))}
              />
              <span>Wickets : {wicket}</span>
            </div>
            <button className="start">Proceed To Play</button>
          </form>
        </div>
      ) : null}
    </>
  );
}

function Footer({ gameStarted }) {
  return (
    <>
      {gameStarted ? (
        <footer>
          <p> 0 : Wicket</p>
          <p> 1 : 1 Runs</p>
          <p> 2 : 2 Runs</p>
          <p> 3 : 3 Runs</p>
          <p> 4 : 4 Runs</p>
          <p> 5 : 5 Runs</p>
          <p> 6 : 6 Runs</p>
        </footer>
      ) : null}
    </>
  );
}
