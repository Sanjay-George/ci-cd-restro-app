import { Carousel } from "antd";
import "./details.css";

const ImageSlider = ({ images }) => {
  const resImages = images ? images?.filter((img) => !img.menuImage) : [];
  return (
    <Carousel effect="fade" autoplay="true">
      {resImages?.map((image, i) => {
        return (
          <div>
            <img
              src={`${process.env.REACT_APP_IMAGE_STORE_URL}/${image?.path}`}
              alt=""
              className="ImgDiv"
            />
          </div>
        );
      })}
    </Carousel>
  );
};
export default ImageSlider;
