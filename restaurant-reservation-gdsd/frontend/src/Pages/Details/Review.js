import React, { useState } from "react";
import "./details.css";
import { Rate, Divider, Button, Form, Input, message } from "antd";
import ReviewComment from "./ReviewComment";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getRestaurantReviews,
  postReview,
  editReview,
  deleteReview,
} from "../../query/review";
import { isEmpty } from "lodash";

const { TextArea } = Input;
export default function Review({ restaurantDetails }) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  const [selectedReview, setSelectedReview] = useState(null);

  const { id } = useParams();
  const { data: restaurantReviews } = useQuery(
    ["restaurant-Reviews", { id }],
    () => getRestaurantReviews(id)
  );

  const postReviewMutation = useMutation((body) => postReview(id, body));
  const editReviewMutation = useMutation((body) => editReview(id, body));
  const deleteReviewMutation = useMutation((reviewId) =>
    deleteReview(id, reviewId)
  );

  const hasUserRating =
    restaurantReviews?.data?.filter(
      (review) => review.userID === parseInt(userId)
    )?.length > 0
      ? true
      : false;

  const onFinish = (values) => {
    const body = {
      ...values,
      ...(selectedReview?.id && { reviewId: selectedReview?.id }),
    };
    !isEmpty(selectedReview)
      ? editReviewMutation.mutate(body, {
          onSuccess: () => {
            queryClient.invalidateQueries(["restaurant-Reviews", { id }]);
            queryClient.invalidateQueries(["restaurant-listings", { id }]);
            message.success("Restaurant edited successfully");
            form.resetFields();
            setSelectedReview(null);
          },
          onError: (data) => {
            const errorMessage = data?.response?.data?.msg;
            message.error(errorMessage);
          },
        })
      : postReviewMutation.mutate(body, {
          onSuccess: () => {
            queryClient.invalidateQueries(["restaurant-Reviews", { id }]);
            queryClient.invalidateQueries(["restaurant-listings", { id }]);
            message.success("Restaurant reviewed successfully");
            form.resetFields();
          },
          onError: (data) => {
            const errorMessage = data?.response?.data?.msg;
            message.error(errorMessage);
          },
        });
  };

  const onEditReview = (review) => {
    setSelectedReview(review);
    form.setFieldsValue({
      rating: review?.rating,
      description: review?.descriptionReview,
    });
  };

  const onDeleteReview = (review) => {
    setSelectedReview(review);
    deleteReviewMutation.mutate(review?.id, {
      onSuccess: () => {
        queryClient.invalidateQueries(["restaurant-Reviews", { id }]);
        message.success("Restaurant deleted successfully");
        setSelectedReview(null);
      },
      onError: (data) => {
        const errorMessage = data?.response?.data?.msg;
        message.error(errorMessage);
      },
    });
  };

  return (
    <>
      {token && (!hasUserRating || !isEmpty(selectedReview)) && (
        <>
          <h2 className="RestOverviewHeading" style={{ paddingBottom: 15 }}>
            Write Review
          </h2>
          <Form
            name="basic"
            layout="vertical"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: 800 }}
            autoComplete="off"
            onFinish={onFinish}
            form={form}
          >
            <Form.Item name="rating" label="Rating" wrapperCol={{ span: 5 }}>
              <Rate defaultValue={0} className="RestOverviewRate" />
            </Form.Item>
            <Form.Item label="Review" name="description">
              <TextArea
                rows={4}
                placeholder="Share your experience and help others make better choices!"
              />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 1 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          <Divider
            style={{
              borderWidth: 1,
              borderColor: "#C3c9cb",
            }}
          />
        </>
      )}
      {!!restaurantReviews?.data?.length && (
        <>
          <h2 className="RestOverviewHeading">
            What {restaurantReviews?.data?.length} people are saying
          </h2>
          <Divider
            style={{
              borderWidth: 1,
              borderColor: "#C3c9cb",
            }}
          />
        </>
      )}
      <h3 className="RestOverviewHeading">Overall rating and reviews</h3>
      <div className="ReviewTabContainer">
        <div className="ReviewTabContainerLeft">
          <p style={{ paddingBottom: 2, fontSize: 16 }}>
            Reviews can only be made by diners who have eaten at this restaurant
          </p>
          <Rate
            allowHalf
            value={parseFloat(restaurantDetails?.rating)}
            className="RestOverviewRate"
            disabled
          />
          <span style={{ paddingLeft: 15, fontSize: 12 }}>
            Based on {restaurantReviews?.data?.length} reviews
          </span>
        </div>
        <div className="ReviewTabContainerRight"></div>
      </div>
      <Divider
        style={{
          borderWidth: 1,
          borderColor: "#C3c9cb",
          marginBottom: 0,
        }}
      />
      {restaurantReviews?.data?.map((review, i) => {
        return (
          <ReviewComment
            review={review}
            onEditReview={onEditReview}
            onDeleteReview={onDeleteReview}
            key={i}
          />
        );
      })}
    </>
  );
}
