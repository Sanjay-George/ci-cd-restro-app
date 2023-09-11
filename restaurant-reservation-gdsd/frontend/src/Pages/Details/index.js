import "./details.css";
import ReservationBox from "./ReservationBox";
import AdditionalInformation from "./AdditionalInfo";
import Tabs from "./TabOptions";
import ImageSlider from "./imageslider";
import "./details.css";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import {
  restaurantDetailsById,
  getChatDetailsByRestaurantId,
} from "../../query/restaurant";
import { FloatButton } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import ChatWrapper from "../Chat/Chat";
import { useState } from "react";

const Details = () => {
  const { id } = useParams();

  const [showChat, setShowChat] = useState(false);
  const userToken = localStorage.getItem("token");

  const { data: restaurantDetails } = useQuery(
    ["restaurant-listings", { id }],
    () => restaurantDetailsById(id)
  );

  const { data: chatDetails } = useQuery(["chat-details", { id }], () =>
    getChatDetailsByRestaurantId(id)
  );

  return (
    <>
      {restaurantDetails?.data[0]?.images && (
        <div className="ImgSlider">
          <ImageSlider images={restaurantDetails?.data[0]?.images} />
        </div>
      )}
      <div className="restaurant_details_container">
        <div className="RestTabsSection">
          <Tabs restaurantDetails={restaurantDetails?.data[0]} />
        </div>
        <div className="MakeReservationSection">
          <ReservationBox resId={id} />
          <div style={{ textAlign: "left" }}>
            <AdditionalInformation
              restaurantDetails={restaurantDetails?.data[0]}
            />
          </div>
        </div>
      </div>
      {chatDetails && chatDetails.data.length && chatDetails.data[0].chatId && (
        <>
          <FloatButton
            shape="circle"
            type="primary"
            style={{
              right: 50,
              height: 50,
              width: 50,
            }}
            icon={<MessageOutlined style={{ fontSize: 18 }} />}
            onClick={() => {
              setShowChat(true);
            }}
          />

          <ChatWrapper
            showModal={showChat}
            setShowModal={setShowChat}
            chatDetails={chatDetails?.data[0]}
          />
        </>
      )}
    </>
  );
};

export default Details;
