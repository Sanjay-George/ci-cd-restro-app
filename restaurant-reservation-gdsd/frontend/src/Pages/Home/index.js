import SearchField from "./SearchField";
import HorzCard from "../../Components/Cards/HorzCard";
import "../../Components/Cards/Card.css";
import { Divider, Button } from "antd";
import { useQuery } from "react-query";
import { trendingRestaurants, allRestaurants } from "../../query/restaurant";
import { isArray } from "lodash";
import { Link } from "react-router-dom";

const Home = () => {
  const { data: trendingRestaurantsData } = useQuery(
    "restaurant-listings",
    trendingRestaurants
  );
  const { data: allRestaurantsData } = useQuery(
    "all-restaurant-listings",
    allRestaurants
  );

  return (
    <div>
      <SearchField />
      <Divider
        style={{
          borderWidth: 1,
          borderColor: "#C3c9cb",
        }}
      />
      <div className="cardHeading">
        <h2>Trending Restaurants</h2>
      </div>
      <div className="cardContainer">
        {isArray(trendingRestaurantsData?.data) &&
          trendingRestaurantsData?.data?.map((restaurant, i) => (
            <Link key={i} to={`/details/${restaurant?.id}`}>
              <HorzCard
                alt="img"
                title={restaurant.name}
                description={restaurant.restaurantNote}
                ratings={restaurant.rating}
                images={restaurant?.images}
              />
            </Link>
          ))}
      </div>
      <Divider
        style={{
          borderWidth: 1,
          borderColor: "#C3c9cb",
        }}
      />
      <div className="cardHeading">
        <h2>All Restaurants</h2>
      </div>
      <div className="cardContainer">
        {isArray(allRestaurantsData?.data) &&
          allRestaurantsData?.data?.map((restaurant, i) => (
            <Link key={i} to={`/details/${restaurant?.id}`}>
              <HorzCard
                alt="img"
                title={restaurant.name}
                description={restaurant.restaurantNote}
                ratings={restaurant.rating}
                images={restaurant?.images}
              />
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Home;
