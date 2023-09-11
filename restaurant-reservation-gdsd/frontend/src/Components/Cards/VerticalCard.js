import "./Card.css";
import { Rate } from "antd";

const VerticalCard = (props) => {
  const allImages = props?.images?.filter((img) => !img.menuImage) || [];
  return (
    <div className="VerCard">
      <div className="VerCardImgContainer">
        <img
          src={`${process.env.REACT_APP_IMAGE_STORE_URL}/${allImages[0]?.path}`}
          className="card_image"
          onError={(e) => {
            e.target.src = "/images/RestImages/default-restaurant.jpeg";
          }}
        />
      </div>
      <div class="VerCard_Content">
        <h3 className="VerCard_title">{props.name}</h3>
        <Rate
          allowHalf
          value={parseFloat(props?.rating)}
          disabled
          className="RestOverviewRate"
        />
        <p className="VerCard_Description">
          {props?.address}, {props?.city}
        </p>
        <div>{props?.restaurantNote}</div>
        <div>Max Capacity: {props.maxCapacity}</div>
      </div>
    </div>
  );
};

export default VerticalCard;
