import React, { useEffect, useState } from "react";

import uiLeft from "../../../assets/explore/uiLeftt.svg";
import { CiHeart } from "react-icons/ci";
import "../explore.css";
import { useNavigate } from "react-router-dom";
import personE from "../../../assets/explore/personE.svg";
import {
  useGetExploreListQuery,
  useGetExploreTagQuery,
} from "@/store/api/explore/exploreApi";
import { Person } from "@/assets/profile";
import { useDispatch } from "react-redux";
import { setDetails, setTitle } from "@/store/slices/exploreSlice";
import { paths } from "@/routes/paths";
import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
import { FaHeart } from "react-icons/fa";

interface RecommandProps {
  title: string;
  list_id: string;
  // setshow : any
}

const Recommand: React.FC<RecommandProps> = ({ title, list_id }) => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [imgError, setImgError] = useState(false);
  const { data, isLoading, refetch } = useGetExploreListQuery({
    id: list_id,
  });
  useEffect(() => {
    if (data?.data) {
      setList(data?.data);
    }
  }, [data, list]);
  // console.log(" this is mf", list);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState<boolean>(false);
  const refreshCard = async () => {
    setRefresh(true); // Show loading animation
    await refetch(); // Refetch data
    setRefresh(false); // Hide loading animation after refetch
  };
  const showDetailsVod = (file: any) => {
    dispatch(setDetails(file));
    navigate(paths.vod_details);
  };

  const showMore = (tt: any) => {
    dispatch(setTitle(tt));
    navigate(paths.recommand_more, { state: { tt } });
  };

  function formatDuration(duration: any) {
    const hours = Math.floor(duration / 3600); // Get the hours
    const minutes = Math.floor((duration % 3600) / 60); // Get the remaining minutes
    const seconds = duration % 60; // Get the remaining seconds

    // Ensure all values are padded to 2 digits
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    if (hours > 0) {
      const formattedHours = hours.toString().padStart(2, "0");
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
      return `${formattedMinutes}:${formattedSeconds}`;
    }
  }

  const calculateHeight = (width: number, height: number) => {
    // console.log(width,height)
    if (width > height) {
      return 112; // Portrait
    }
    if (width < height) {
      return 240; // Landscape
    }
    return 200;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return num;
  };

  // console.log(list);
  return (
    <div className=" pb-[20px] px-[10px]">
      {isLoading ? (
        <div className=" flex flex-col w-full">
          <div className="py-[12px]">
            <div className=" w-full h-[20px] rounded-lg shadow-lg bg-white/20 animate-pulse mb-4"></div>
          </div>
          <div className=" w-full grid grid-cols-2 justify-center items-center  gap-[12px]">
            <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
            <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
            <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
            <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
          </div>
        </div>
      ) : (
        <>
          {list?.map((ll: any, index) => (
            <div key={index} className="flex flex-col w-full items-center">
              {/* header */}
              <div className=" flex w-full justify-between items-center py-[12px] px-[10p]">
                <h1 className=" text-white text-[14px] font-[500] leading-[20px]">
                  {ll.title}
                </h1>
                <div
                  // onClick={() => navigate(paths.recommand_more, { state: { title } })}
                  onClick={() => showMore(ll.title)}
                  className="rec_exp_more_btn"
                >
                  <img src={uiLeft} alt="" />
                </div>
              </div>{" "}
              {/* content */}
              <div className=" py-[12px] w-full grid grid-cols-2 justify-center items-center  gap-[10px]">
                <>
                  {ll.posts.map((card: any) => (
                    <div
                      key={card.post_id}
                      className="max-w-full pb-[12px chinese_photo h-[320px]"
                    >
                      <div
                        onClick={() => showDetailsVod(card)}
                        className=" relative flex justify-center items-center bg-[#010101] rounded-t-[4px] overflow-hidden  h-[240px]"
                      >
                        <ImageWithPlaceholder
                          src={card?.preview_image}
                          alt={card.title || "Video"}
                          width={"100%"}
                          // height={240}
                          height={
                            card?.files[0]?.height &&
                            calculateHeight(
                              card?.files[0]?.width,
                              card?.files[0]?.height
                            )
                          }
                          className=" object-cover h-full w-full rounded-none"
                        />

                        <div className=" absolute hidden left-0 mx-auto right-0 bottom-0 fle justify-around items-center w-full max-w-[175px] bg-blac">
                          <div className=" flex w-full  justify-between px-2">
                            <span className=" text-white text-[11px]  left-">
                              {card?.view_count} 次观看
                            </span>
                            <span className=" text-white text-[11px]  right-0">
                              {formatDuration(card?.files[0].duration)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* <h1 className="text-white w-full text-[12px] font-[400] px-[6px] pt-[6px] leading-[20px] break-words"> */}
                      <h1 className="search_text font-cnFont line-clamp-2 text-left text-[12px] font-[400] px-[6px] pt-[6px]">
                        {card.title.length > 50
                          ? `${card.title.slice(0, 50)}...`
                          : card.title}
                      </h1>
                      <div className=" flex w-full p-[6px] justify-between">
                        <div className=" flex justify-cente  items-center gap-[4px]">
                          {card.user.avatar ? (
                            <img
                              // onError={() => console.log("gg")}
                              className=" w-[20px] h-[20px] rounded-full"
                              src={card.user.avatar}
                              onError={(e) => (e.currentTarget.src = personE)}
                              alt=""
                            />
                          ) : (
                            <img
                              src={personE}
                              className=" w-[20px] h-[20px] rounded-full"
                              alt=""
                            />
                          )}
                          <h1 className=" text-[#888] text-[12px] font-[400] leading-[20px]">
                            {card.user.name}
                            {/* {card?.files[0]?.width} & {card?.files[0]?.height} {} */}
                          </h1>
                        </div>
                        <div className=" flex justify-center items-center gap-[4px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="12"
                            viewBox="0 0 13 12"
                            fill="none"
                          >
                            <path
                              d="M8.56675 1.13281C7.53401 1.13281 6.6298 1.57692 6.06616 2.32759C5.50253 1.57692 4.59832 1.13281 3.56557 1.13281C2.74349 1.13374 1.95535 1.46072 1.37405 2.04202C0.792751 2.62332 0.46577 3.41146 0.464844 4.23354C0.464844 7.73437 5.65557 10.568 5.87662 10.6851C5.93488 10.7164 6.00001 10.7328 6.06616 10.7328C6.13232 10.7328 6.19745 10.7164 6.25571 10.6851C6.47676 10.568 11.6675 7.73437 11.6675 4.23354C11.6666 3.41146 11.3396 2.62332 10.7583 2.04202C10.177 1.46072 9.38883 1.13374 8.56675 1.13281Z"
                              stroke="#BBBBBB"
                              stroke-width="0.8"
                            />
                          </svg>
                          {/* <FaHeart /> */}
                          <h1 className=" text-[#888] text-[12px] font-[400] leading-[20px]">
                            {formatNumber(card?.like_count)}
                          </h1>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              </div>{" "}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Recommand;
