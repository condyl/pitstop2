import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const BackButton = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 transition-colors hover:text-gray-900 focus:outline-none focus:text-gray-900 ${className}`}
      aria-label="Go back to previous page"
    >
      <span aria-hidden="true">←</span>
      <span>Back</span>
    </button>
  );
};

BackButton.propTypes = {
  className: PropTypes.string
};

export default BackButton;