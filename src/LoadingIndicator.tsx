const LoadingIndicator = () => {
  return (
    <div className="loading-container">
      <div className="loading-cards">
        <div
          className="loading-card"
          style={{ transform: "rotate(10deg)", marginLeft: "-30px" }}
        ></div>
        <div
          className="loading-card"
          style={{ transform: "rotate(20deg)", marginLeft: "-20px" }}
        ></div>
        <div
          className="loading-card"
          style={{ transform: "rotate(30deg)", marginLeft: "-10px" }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
