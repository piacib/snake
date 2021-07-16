const GameOver = ({ score, reset }) => {
  return (
    <div className="gameover-display">
      <h2>Game over</h2>
      <h3>Score: {score}</h3>
      <button className="restart" onClick={reset}>
        Restart
      </button>
    </div>
  );
};

export default GameOver;
