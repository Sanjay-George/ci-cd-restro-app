import { Rate } from "antd";
import "./Card.css";

const HorzCard = (props) => {
  return (
    <div className="card">
      <div className="card_body">
        <img src={props.img} className="card_image" />
        <h2 className="card_title">{props.title}</h2>
        <Rate disabled defaultValue={props.ratings || 0} />
        <p className="card_description">{props.description}</p>
      </div>
      <button className="card_btn">Details</button>
    </div>
  );
};

export default HorzCard;
