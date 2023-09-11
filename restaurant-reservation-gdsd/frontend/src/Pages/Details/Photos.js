import React from "react";
import { Image } from "antd";
import PhotoFilter from "./PhotoFilter";

export default function Photos() {
  return (
    <>
      <PhotoFilter />
      <Image.PreviewGroup>
        <Image
          width={200}
          src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        />
        <Image
          width={200}
          src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
        />
      </Image.PreviewGroup>
    </>
  );
}
