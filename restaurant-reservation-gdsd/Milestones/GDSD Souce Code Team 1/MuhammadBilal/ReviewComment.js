import "./details.css";
import { Rate, Divider, Dropdown, Space } from "antd";
import { EditOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";

export default function ReviewComment({
  review,
  setSelectedReview,
  onEditReview,
  onDeleteReview,
}) {
  const userId = localStorage.getItem("id");

  const items = [
    {
      key: "1",
      icon: <EditOutlined />,
      label: <div onClick={onEditReview}>Edit</div>,
    },
    {
      key: "2",
      label: <div onClick={onDeleteReview}>Delete</div>,
      icon: <DeleteOutlined />,
    },
  ];
  return (
    <>
      <div>
        <div style={{ display: "flex" }}>
          <div className="UserReviewContainer">
            <div className="UserReviewImgContainer">
              <img
                src="/images/User-avatar.png"
                className="UserReviewImg"
                alt=""
              />
            </div>
            <div className="UserReviewSec">
              <Rate
                allowHalf
                value={review?.rating}
                className="RestOverviewRate"
              />
              <div
                style={{
                  color: "#9e9d9d",
                  fontWeight: 400,
                  fontSize: 11,
                }}
              >
                by {review?.firstName} {review?.lastName}
              </div>
              <p className="UserReviewDesc">{review?.descriptionReview}</p>
            </div>
          </div>
          {userId && parseInt(userId) === review?.userID && (
            <div className="user-review-action">
              <Dropdown menu={{ items }} trigger={["click"]}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space onClick={() => setSelectedReview(review)}>
                    <MoreOutlined />
                  </Space>
                </a>
              </Dropdown>
            </div>
          )}
        </div>
        <Divider
          style={{
            borderWidth: 1,
            borderColor: "#C3c9cb",
          }}
        />
      </div>
    </>
  );
}
