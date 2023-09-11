import { Image } from "antd";
import { useQuery } from "react-query";
import { getMyProfile } from "../../query/users";
import "./profile.css";

const Profile = () => {
  const { data } = useQuery("my-profile", getMyProfile);
  const profileData = data?.data;
  return (
    <div className="profile">
      <h2>User Info</h2>
      <div className="user-data">
        <div>
          <b>Name:</b> {profileData?.firstName} {profileData?.lastName}
        </div>
        <div>
          <b>Phone:</b> {profileData?.phoneNumber}
        </div>
        <div>
          <b>Email:</b> {profileData?.email}
        </div>
        <div>
          <b>Role:</b> {profileData?.roleName}
        </div>
        <div>
          <b>Reward Points:</b> {profileData?.rewardPoints}
        </div>
      </div>
    </div>
  );
};

export default Profile;
