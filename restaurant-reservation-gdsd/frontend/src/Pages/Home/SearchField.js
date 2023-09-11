import "./SearchField.css";
import { DatePicker, TimePicker, Input, Select } from "antd";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import dayjs from "dayjs";
import { Persons } from "../../utils/data";
const { Search } = Input;

const SearchField = () => {
  const navigate = useNavigate();
  const [filterParams, setFilterParams] = useState();

  const onSearch = (value) => {
    navigate({
      pathname: "/restaurantlisting",
      search: createSearchParams({
        search: value,
        ...filterParams,
      }).toString(),
    });
  };

  return (
    <div className="search">
      <div>
        <h1>Find your table for any occasion</h1>
      </div>
      <div className="searchfield">
        <div className="searchfieldpadding">
          <DatePicker
            className="datepickerstyle"
            onChange={(value) =>
              setFilterParams({
                ...filterParams,
                date: dayjs(value)?.format("YYYY-MM-DD"),
              })
            }
          />
        </div>
        <div className="searchfieldpadding">
          <TimePicker
            className="datepickerstyle"
            onChange={(value) =>
              setFilterParams({
                ...filterParams,
                time: dayjs(value)?.format("HH:MM"),
              })
            }
          />{" "}
        </div>
        <div className="searchfieldpadding">
          <Select
            placeholder="Select People"
            className="ddstyle"
            onChange={(value) =>
              setFilterParams({
                ...filterParams,
                people: value,
              })
            }
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
        <div>
          <Search
            placeholder="Location, Restaurant"
            allowClear
            enterButton="Let's go"
            onSearch={onSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchField;
