import "./Filter.css";
import { Rate, Radio } from "antd";
import SearchField from "../../Pages/Home/SearchField";
import VerticalCard from "../Cards/VerticalCard";
import { Divider } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";

import { searchRestaurants } from "../../query/restaurant";
import { getAllCuisines, getAllExtraServices } from "../../query/searchFilters";
import { isArray } from "lodash";
import { useState } from "react";

const Filter = () => {
  let [searchParams] = useSearchParams();
  const [filterParams, setFilterParams] = useState({
    cuisine: "",
    rating: "",
    extraService: "",
    term: searchParams.get("search"),
  });

  const { data: searchRestaurantsData } = useQuery(
    ["search-restaurants", filterParams],
    () => searchRestaurants(filterParams)
  );

  const { data: allCuisines } = useQuery("all-cuisines", getAllCuisines);
  const { data: allExtraServices } = useQuery(
    "all-extra-service",
    getAllExtraServices
  );

  return (
    <>
      <SearchField />
      <Divider
        style={{
          borderWidth: 1,
          borderColor: "#C3c9cb",
        }}
      />
      <div className="FilterAndSearchResultsContainer">
        <div className="FilterSection">
          <div className="sider">
            <div className="filter">
              <h3>Cuisine</h3>
              <Radio.Group
                onChange={(e) =>
                  setFilterParams({ ...filterParams, cuisine: e.target.value })
                }
              >
                {allCuisines?.data?.values?.map((service, i) => {
                  return (
                    <div className="filteroption" key={i}>
                      <Radio value={service} name="cuisine">
                        {" "}
                        {service}{" "}
                      </Radio>{" "}
                    </div>
                  );
                })}
              </Radio.Group>
            </div>
            <div className="filter">
              <h3>Extra services</h3>
              <Radio.Group
                onChange={(e) =>
                  setFilterParams({ ...filterParams, cuisine: e.target.value })
                }
              >
                {allExtraServices?.data?.map((service, i) => {
                  return (
                    <div className="filteroption" key={i}>
                      <Radio value={service?.value} name="extraService">
                        {" "}
                        {service?.value}{" "}
                      </Radio>{" "}
                    </div>
                  );
                })}
              </Radio.Group>
            </div>
            <div className="filter">
              <h3>Rating</h3>
              <Rate
                allowHalf
                className="RateIcons"
                onChange={(value) =>
                  setFilterParams({ ...filterParams, rating: value })
                }
              />
            </div>
          </div>
        </div>
        <div className="SearchResultsSection">
          <h2>Search Results for "{filterParams.term}"</h2>
          <p>{searchRestaurantsData?.data?.length} Restaurants found</p>
          {isArray(searchRestaurantsData?.data)
            ? searchRestaurantsData?.data?.map((data, i) => (
                <Link to={`/details/${data?.id}`} key={i}>
                  <VerticalCard
                    name={data?.name}
                    address={data?.address}
                    city={data?.city}
                    restaurantNote={data?.restaurantNote}
                    maxCapacity={data?.maxCapacity}
                    images={data?.images}
                    rating={data?.rating}
                  />
                </Link>
              ))
            : "No Restaurants Found"}
        </div>
      </div>
    </>
  );
};

export default Filter;
