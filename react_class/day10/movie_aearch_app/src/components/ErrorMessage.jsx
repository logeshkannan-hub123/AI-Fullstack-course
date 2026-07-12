import "../css/ErrorMessage.css";

function ErrorMessage({ message }) {
  if (!message) {
    return null;
  }

  return <h2 className="error">{message}</h2>;
}

export default ErrorMessage;
