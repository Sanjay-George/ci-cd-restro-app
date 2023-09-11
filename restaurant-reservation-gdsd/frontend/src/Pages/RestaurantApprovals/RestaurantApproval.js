import React, { useState } from "react";
import { Space, Spin, Table, Tag } from "antd";
import "./RestaurantApproval.css";
import SideMenu from "./AdminSideMenu";

const columns = [
  {
    title: "Restaurant Name",
    dataIndex: "restaurantName",
    key: "restaurantName",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Attached Files",
    dataIndex: "attachedFiles",
    key: "attachedFiles",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a style={{ color: "#49be25" }}>Approve {record.name}</a>
        <a style={{ color: "red" }}>Reject</a>
      </Space>
    ),
  },
];
const data = [
  {
    key: "1",
    restaurantName: "Leipzeg Restaurant",
    attachedFiles: "Photos",
    address: "New York No. 7 Lake Park",
  },
  {
    key: "2",
    restaurantName: "Niesig Restaurant",
    attachedFiles: "Photos",
    address: "New York No. 3 Lake Park",
  },
  {
    key: "3",
    restaurantName: "Arkadas Restaurant",
    attachedFiles: "Photos",
    address: "New York No. 12 Lake Park",
  },
  {
    key: "4",
    restaurantName: "Duy Restaurant",
    attachedFiles: "Photos",
    address: "New York No. 31 Lake Park",
  },
  {
    key: "5",
    restaurantName: "Duy Restaurant",
    attachedFiles: "Photos",
    address: "New York No. 31 Lake Park",
  },
  {
    key: "6",
    restaurantName: "Duy Restaurant",
    attachedFiles: "Photos",
    address: "New York No. 31 Lake Park",
  },
  {
    key: "7",
    restaurantName: "Duy Restaurant",
    attachedFiles: "Photos",
    address: "New York No. 31 Lake Park",
  },
];

export default function RestaurantApproval() {
  return (
    <div className="TableContainer">
      <div className="TableContainerLeft">
        <SideMenu />
      </div>
      <div className="TableContainerRight">
        <Table
          className="tblApprovals"
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 5,
          }}
          bordered
        />
      </div>
    </div>
  );
}
