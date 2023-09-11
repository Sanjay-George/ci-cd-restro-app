import "./index.css";
import Profile from "./profile.js";
import { Tabs } from "antd";
const onChange = (key) => {
  console.log(key);
};
const items = [
  {
    key: "1",
    label: `Profile`,
    children: <Profile />,
  },
  // {
  //   key: '2',
  //   label: `My Bookings`,
  //   children: `Content of Tab Pane 2`,
  // },
  // {
  //   key: '3',
  //   label: `My Reviews`,
  //   children: `Content of Tab Pane 3`,
  // },
];
const index = () => {
  return (
    <div className="user_profile_main">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
    </div>
  );
};
export default index;
