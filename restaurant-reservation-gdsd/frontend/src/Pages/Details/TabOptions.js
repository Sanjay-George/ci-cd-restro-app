import React from "react";
import { Tabs } from "antd";
import Overview from "./Overview";
import Photos from "./Photos";
import Menu from "./Menu";
import Review from "./Review";

const TabOptions = ({ restaurantDetails }) => {
  const onChange = (key) => {
    console.log(key);
  };

  const items = [
    {
      key: "1",
      label: `Overview`,
      children: <Overview restaurantDetails={restaurantDetails} />,
    },
    {
      key: "2",
      label: `Menu`,
      children: <Menu images={restaurantDetails?.images} />,
    },
    {
      key: "3",
      label: `Reviews`,
      children: <Review restaurantDetails={restaurantDetails} />,
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
};

export default TabOptions;
