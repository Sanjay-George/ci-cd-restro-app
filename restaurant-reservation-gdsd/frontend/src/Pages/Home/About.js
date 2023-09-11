import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <header>
        <h2>Software Engineering Class GDSD</h2>
        <h3>Winter 2022</h3>
        <h3>Team 1</h3>
      </header>

      <section className="team-members">
        <Link to={`/contributors/utsav-shrestha`} className="members">
          Utsav Shrestha
        </Link>
        <Link to={`/contributors/sanjay-george`} className="members">
          Sanjay George
        </Link>
        <Link to={`/contributors/omer-zogubi`} className="members">
          Ömer Zogubi
        </Link>
        <Link to={`/contributors/muhammad-bilal`} className="members">
          Muhammad Bilal
        </Link>
        <Link to={`/contributors/parthiv-jani`} className="members">
          Parthiv Yogeshkumar Jani
        </Link>
        <Link to={`/contributors/kikolazeski`} className="members">
          Kristijan Lazessi(AI)
        </Link>
      </section>
    </div>
  );
};

export default Home;
