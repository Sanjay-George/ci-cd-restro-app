import { Rate } from "antd";
import "./Card.css";

const HorzCard = (props) => {
  const allImages = props?.images?.filter((img) => !img.menuImage) || [];
  return (
    <div className="card">
      <div className="card_body">
        <img
          src={`${process.env.REACT_APP_IMAGE_STORE_URL}/${allImages[0]?.path}`}
          className="card_image"
          onError={(e) => {
            e.target.src = "/images/RestImages/default-restaurant.jpeg";
          }}
        />
        <h2 className="card_title">{props.title}</h2>
        <Rate
          allowHalf
          disabled
          value={parseFloat(props.ratings) || 0}
          className="StarIcon"
        />
        <p className="card_description">{props.description}</p>
      </div>
      <button className="card_btn">Details</button>
    </div>
  );
};

export default HorzCard;
