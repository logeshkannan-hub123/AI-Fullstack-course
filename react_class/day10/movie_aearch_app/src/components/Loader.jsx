import "../css/Loader.css";

function Loader({ loading }) {
  if (!loading) {
    return null;
  }

  return <h2 className="loading">Loading...</h2>;
}

export default Loader;
