export default function CoingeckoLimit() {
  const handleRefresh = () => {
    window.location.reload();
  };
  return (
    <div className="coingecko-limit">
      <p className="limit">
        You have sent too many api calls, wait.. and refresh.
      </p>
      <button onClick={handleRefresh}>Refresh</button>
    </div>
  );
}
