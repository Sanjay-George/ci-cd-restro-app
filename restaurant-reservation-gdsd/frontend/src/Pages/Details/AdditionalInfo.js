import "./details.css";
import {
  ClockCircleOutlined,
  CarOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
const AdditionalInformation = ({ restaurantDetails }) => {
  return (
    <>
      <h3 className="ReserveBox_title" style={{ paddingTop: 55 }}>
        Additional Information
      </h3>
      <div className="AdditionalInfoContainer">
        <div className="AdditionalInfoContainerLeft">
          <ClockCircleOutlined className="AdditionalInfoIcons" />
        </div>
        <div className="AdditionalInfoContainerRight">
          <b style={{ textAlign: "left" }}>Operating Hours</b>
          <div className="AdditionalInfoText">
            <p>
              Dinner Mon–Thu, Sun 5:00 pm–10:00 pm Fri, Sat 5:00 pm–12:00 am
            </p>
            <div>
              Max Tables:
              {restaurantDetails?.maxTables}
            </div>
            <div>
              Max Capacity:
              {restaurantDetails?.maxCapacity}
            </div>
          </div>
        </div>
      </div>
      <div className="AdditionalInfoContainer">
        <div className="AdditionalInfoContainerLeft">
          <CarOutlined className="AdditionalInfoIcons" />
        </div>
        <div className="AdditionalInfoContainerRight">
          <b style={{ textAlign: "left" }}>Address</b>
          <div className="AdditionalInfoText">
            <p>
              {restaurantDetails?.address}, {restaurantDetails?.city}
            </p>
          </div>
        </div>
      </div>
      <div className="AdditionalInfoContainer">
        <div className="AdditionalInfoContainerLeft">
          <CoffeeOutlined className="AdditionalInfoIcons" />
        </div>
        <div className="AdditionalInfoContainerRight">
          <b style={{ textAlign: "left" }}>Cuisines</b>
          <div className="AdditionalInfoText">
            <p>{restaurantDetails?.cuisine}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdditionalInformation;
