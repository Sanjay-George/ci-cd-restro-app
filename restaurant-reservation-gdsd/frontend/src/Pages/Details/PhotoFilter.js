import React from "react";
import { Tabs } from "antd";

const onChange = (key) => {
  console.log(key);
};

const items = [
  {
    key: "1",
    label: `All`,
    children: `Content of Tab Pane 1`,
  },
  {
    key: "2",
    label: `Food`,
    children: `Content of Tab Pane 2`,
  },
  {
    key: "3",
    label: `Interior`,
    children: `Content of Tab Pane 3`,
  },
  {
    key: "4",
    label: `Exterior`,
    children: `Content of Tab Pane 4`,
  },
];

export default function PhotoFilter() {
  return (
    <>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </>
  );
}
