import React, { useState, useEffect } from "react";

import "./Reservation.css";
import { Image, Form, Row, Col, Select, Input, Button, message } from "antd";
import {
  FieldTimeOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation } from "react-query";

import {
  restaurantDetailsById,
  reserveRestaurant,
  updateReserveRestaurant,
  cancelReserveRestaurant,
} from "../../query/restaurant";
import { getAllExtraServices } from "../../query/searchFilters";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const { TextArea } = Input;

export default function Reservation() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resId = searchParams.get("resId");
  const numberOfSeats = searchParams.get("numberOfSeats");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const [reserveStatus, setReserveStatus] = useState("Pending");
  const [reservationId, setReservationId] = useState(null);

  const userToken = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");

  const { data: restaurantDetails } = useQuery(
    ["restaurant-listings", { resId }],
    () => restaurantDetailsById(resId)
  );

  const { data: allExtraServices } = useQuery(
    "all-extra-service",
    getAllExtraServices
  );

  const reserveRestaurantMutation = useMutation((body) =>
    reserveRestaurant(body)
  );

  const updateReserveRestaurantMutation = useMutation((body) =>
    updateReserveRestaurant(body)
  );

  const cancelReserveRestaurantMutation = useMutation((id) =>
    cancelReserveRestaurant(id)
  );
  const restaurantData = restaurantDetails?.data[0];

  useEffect(() => {
    if (reserveRestaurantMutation?.data?.data?.reservationId) {
      setReservationId(reserveRestaurantMutation?.data?.data?.reservationId);
    }
  }, [reserveRestaurantMutation]);

  const onFinish = (values) => {
    const body = {
      ...values,
      date,
      time: parseInt(time),
      numberOfSeats: parseInt(numberOfSeats),
      restaurantId: parseInt(resId),
      ...(reserveStatus === "Modify" && { reservationId }),
    };

    reserveStatus === "Modify"
      ? updateReserveRestaurantMutation.mutate(body, {
          onSuccess: () => {
            message.success("Restaurant Reserve modified successfully");
            setReserveStatus("Reserved");
          },
          onError: (data) => {
            const errorMessage = data?.response?.data;
            message.error(errorMessage);
          },
        })
      : reserveRestaurantMutation.mutate(body, {
          onSuccess: () => {
            message.success("Restaurant reserved successfully");
            setReserveStatus("Reserved");
          },
          onError: (data) => {
            const errorMessage = data?.response?.data;
            message.error(errorMessage);
          },
        });
  };

  const cancelReservation = () => {
    cancelReserveRestaurantMutation.mutate(reservationId, {
      onSuccess: () => {
        message.success("Restaurant cancelled successfully");
        setTimeout(() => {
          navigate(`/details/${resId}`);
        }, [300]);
      },
      onError: (data) => {
        const errorMessage = data?.response?.data;
        message.error(errorMessage);
      },
    });
  };

  return (
    <>
      <div className="main-class" style={{ maxWidth: 800, margin: "0 auto" }}>
        <Row gutter={30}>
          <Col sm={6}>
            <h2>One last step!</h2>
            <Image
              width={200}
              style={{ borderRadius: "50%", marginTop: 20 }}
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
              preview={false}
            />
          </Col>
          <Col sm={10} className="res-detail">
            <div style={{ textAlign: "left" }}>
              {" "}
              <h2>{restaurantData?.name}</h2>{" "}
            </div>
            <div>
              <div className="res-detail-child">
                <CalendarOutlined />
                <div>{date}</div>
              </div>
              <div className="res-detail-child">
                <FieldTimeOutlined />
                <div>{time}:00</div>
              </div>
              <div className="res-detail-child">
                <UserOutlined />
                <div>{numberOfSeats} people</div>
              </div>
              {reserveStatus !== "Modify" && (
                <div
                  className="reserve-actions"
                  style={{ textAlign: "left", marginTop: 10 }}
                >
                  <div onClick={() => setReserveStatus("Modify")}>
                    <span className="EditFields">Modify</span>
                  </div>
                  {reserveStatus !== "Pending" && (
                    <div onClick={cancelReservation}>
                      <span className="EditFields" style={{ color: "#625f5f" }}>
                        Cancel
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Col>
        </Row>
        <div style={{ textAlign: "left", marginTop: 10 }}>
          {!userToken && (
            <div>
              <Link to="/login">
                <b>Login</b>
              </Link>{" "}
              to collect points for this reservation
            </div>
          )}
        </div>
        {reserveStatus === "Reserved" && (
          <div className="show-other-info">
            <Link to={`/details/${resId}`}>
              <div className="back-to-res">Back to the restaurant</div>
            </Link>
            <div className="booked-by">
              <b>Booked By: </b>
              {userName}
            </div>
            <div className="special-request">
              <h3>Your Special Request</h3>
              <div>{form.getFieldValue("specialRequest")}</div>
            </div>
          </div>
        )}
        {reserveStatus !== "Reserved" && (
          <Form
            name="basic"
            style={{ marginTop: 20 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            form={form}
          >
            <Row gutter={30} style={{ width: "60%" }}>
              <Col xs={24}>
                <Form.Item label="" name="extraServiceId">
                  <Select
                    placeholder="Select extra service"
                    className="ddstyle"
                    style={{ width: "100%" }}
                    disabled={reserveStatus === "Reserved"}
                  >
                    {allExtraServices?.data.map((service, index) => {
                      return (
                        <Select.Option key={index} value={service.id}>
                          {service.value}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name="specialRequest">
                  <TextArea
                    rows={3}
                    placeholder="Special Request"
                    disabled={reserveStatus === "Reserved"}
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Button
                  htmlType="submit"
                  type="primary"
                  className="reserveBox-btn"
                  disabled={reserveStatus === "Reserved"}
                >
                  {reserveStatus === "Reserved" ? "Modify Reserve" : "Reserve"}
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </div>
    </>
  );
}
