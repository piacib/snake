const GameOver = ({ score, reset }) => {
  return (
    <div className="gameover-display">
      <div>Game over</div>
      <div>Score: {score}</div>
      <button className="restart" onClick={reset}>
        Restart
      </button>
    </div>
  );
};

export default GameOver;
