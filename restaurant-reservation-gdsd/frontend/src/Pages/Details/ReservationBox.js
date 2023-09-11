import { useMutation } from "react-query";
import {
  Button,
  Row,
  Col,
  Form,
  Divider,
  Select,
  DatePicker,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";

import "./ReservationBox.css";
import { Persons, Times } from "../../utils/data";
import { checkReservationAvailability } from "../../query/restaurant";
import dayjs from "dayjs";

const ReservationBox = ({ resId }) => {
  const navigate = useNavigate();

  const checkReserveAvailableMutation = useMutation((body) =>
    checkReservationAvailability(resId, body)
  );

  const onFinish = (values) => {
    const body = {
      ...values,
      date: dayjs(values?.date).format("YYYY-MM-DD"),
    };

    checkReserveAvailableMutation.mutate(body, {
      onSuccess: () => {
        message.success("Reservations available, redirecting...");
        setTimeout(() => {
          {
            const queryParams = new URLSearchParams({
              ...body,
              resId,
            });
            navigate(`/reservation?${queryParams.toString()}`);
          }
        }, 1000);
      },
      onError: (data) => {
        const errorMessage = data?.response?.data?.message;
        message.error(errorMessage);
      },
    });
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
  };

  return (
    <>
      <div className="ReserveBox">
        <div className="card_body">
          <h2 className="ReserveBox_title">Make a reservation</h2>
          <Divider
            style={{
              borderWidth: 1,
              borderColor: "#C3c9cb",
              marginTop: 10,
            }}
          />
          <Form
            name="basic"
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Row>
              <Col xs={24}>
                <Form.Item
                  name="numberOfSeats"
                  rules={[{ required: true, message: "Please select people!" }]}
                >
                  <Select
                    placeholder="Select People"
                    className="ddstyle"
                    style={{ width: "100%" }}
                  >
                    {Persons.map((person, index) => {
                      return (
                        <Select.Option key={index} value={index + 1}>
                          {person}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item
                  name="date"
                  rules={[{ required: true, message: "Please set the date!" }]}
                >
                  <DatePicker disabledDate={disabledDate} />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item
                  name="time"
                  rules={[{ required: true, message: "Please select time!" }]}
                >
                  <Select placeholder="Select Time" className="ddstyle">
                    {Times.map((time, index) => {
                      return (
                        <Select.Option key={index} value={time?.value}>
                          {time?.label}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Button htmlType="submit" type="primary" className="reserveBox-btn">
              Check Reservation Available
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ReservationBox;
