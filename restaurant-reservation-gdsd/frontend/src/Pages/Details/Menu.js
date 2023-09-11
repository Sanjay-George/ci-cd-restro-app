import React from "react";
import { Image, Row, Col } from "antd";

export default function Menu({ images }) {
  const menuImages = images ? images?.filter((img) => img.menuImage) : [];
  return (
    <Row gutter={30}>
      {menuImages?.map((img, i) => {
        return (
          <Col lg={12} key={i}>
            <Image
              src={`${process.env.REACT_APP_IMAGE_STORE_URL}/${img?.path}`}
              alt=""
              className="ImgDiv"
              height={300}
            />
          </Col>
        );
      })}
    </Row>
  );
}
