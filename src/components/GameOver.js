const GameOver = ({ score, reset }) => {
  return (
    <>
      <div>Game over</div>
      <div>Score: {score}</div>
      <button onClick={reset}>Restart</button>
    </>
  );
};

export default GameOver;
