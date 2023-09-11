import { useState } from "react";
import "./Header.css";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Modal, DatePicker, TimePicker, Input, Select } from "antd";
import { Link } from "react-router-dom";
import { Persons } from "../../utils/data";

const { Search } = Input;

const Header = () => {
  const [open, setOpen] = useState(false);
  const [navToogle, setNavToggle] = useState("");

  const userData = localStorage.getItem("userName");
  const userToken = localStorage.getItem("token");

  return (
    <>
      <section className="header">
        {userToken ? (
          <div className="navbar">
            <div>
              <Link to="/">
                <img
                  src="/images/RestImages/reserveatLogo.png"
                  width={100}
                  alt="logo"
                  className="Logo"
                />
              </Link>
            </div>

            <div style={{ display: "flex" }}>
              <div className="loginMsg">Welcome, {userData} | </div>{" "}
              <Link
                to="/user-profile"
                style={{ color: "#fff", paddingLeft: 10 }}
              >
                My Profile |
              </Link>{" "}
              <div
                className="logoutText"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userName");
                  localStorage.removeItem("role");
                  localStorage.removeItem("id");
                  window.location.reload();
                }}
              >
                Logout
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="navbar">
              <div>
                <Link to="/">
                  <img
                    src="/images/RestImages/reserveatLogo.png"
                    width={120}
                    alt="logo"
                    className="Logo"
                  />
                </Link>
              </div>
              <div>
                <ul className={`navlist ${navToogle}`} id="navi-list">
                  <li className="listItem">
                    <Link to="/login">
                      <Button
                        type="primary"
                        className="BtnSigninReg"
                        style={{ margin: "3px" }}
                      >
                        Login
                      </Button>
                    </Link>
                  </li>
                  <li className="listItem">
                    <Link to="/register">
                      <Button
                        type="primary"
                        className="BtnSigninReg"
                        style={{ margin: "3px" }}
                      >
                        Register
                      </Button>
                    </Link>
                  </li>
                  <li className="listItem">
                    <Button
                      icon={<SearchOutlined />}
                      className="SearchIconBtn"
                      onClick={() => setOpen(true)}
                    />
                  </li>
                </ul>
                <div
                  className="menu"
                  id="toggle-btn"
                  onClick={() =>
                    setNavToggle(!navToogle ? "activeNavlist" : "")
                  }
                >
                  <div className="menuline"></div>
                  <div className="menuline"></div>
                  <div className="menuline"></div>
                </div>
              </div>
            </div>
          </>
        )}
        <div>
          <>
            <Modal
              title="Find Restaurants"
              centered
              open={open}
              onOk={() => setOpen(false)}
              onCancel={() => setOpen(false)}
              width={900}
              okText="Let's go"
              className="ModalDialog"
            >
              <div className="modal">
                <div className="modalfileds">
                  <DatePicker className="datepickerstyle" />
                </div>
                <div className="modalfileds">
                  {" "}
                  <TimePicker className="datepickerstyle" />
                </div>
                <div className="modalfileds">
                  {" "}
                  <Select
                    placeholder="Select People"
                    className="ddstyle"
                    // onChange={onChange}
                  >
                    {Persons.map((person, index) => {
                      return (
                        <Select.Option key={index} value={index + 1}>
                          {person}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </div>
                <div className="modalfileds">
                  <Search
                    placeholder="Location, Restaurant"
                    allowClear
                    enterButton="Search"
                  />
                </div>
              </div>
            </Modal>
          </>
        </div>
      </section>
    </>
  );
};

export default Header;
