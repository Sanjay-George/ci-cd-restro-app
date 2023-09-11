import React from "react";
import { Rate } from "antd";
import "./details.css";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getRestaurantReviews } from "../../query/review";

export default function Overview({ restaurantDetails }) {
  const { id } = useParams();

  const { data: restaurantReviews } = useQuery(
    ["restaurant-Reviews", { id }],
    () => getRestaurantReviews(id)
  );
  return (
    <>
      <h2 className="RestOverviewHeading">{restaurantDetails?.name}</h2>
      <div className="OverviewSubSec">
        <Rate
          allowHalf
          value={parseFloat(restaurantDetails?.rating)}
          disabled
          className="RestOverviewRate"
        />
        <span style={{ paddingLeft: 15, fontSize: 12 }}>
          Based on {restaurantReviews?.data?.length} reviews
        </span>
      </div>
      <p className="RestOverviewDesc">{restaurantDetails?.restaurantNote}</p>
    </>
  );
}
