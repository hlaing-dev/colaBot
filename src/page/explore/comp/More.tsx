import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import more from "../../../assets/explore/more.png";
import Loader from "../../../page/home/vod_loader.gif";
import "../explore.css";
import { useGetExploreTagQuery } from "@/store/api/explore/exploreApi";
import { useDispatch, useSelector } from "react-redux";
import { setDetails, setMoreTab } from "@/store/slices/exploreSlice";
import VodDetails from "./VodDetails";
import { paths } from "@/routes/paths";
import InfiniteScroll from "react-infinite-scroll-component";
import ImageWithPlaceholder from "@/page/search/comp/imgPlaceholder";
import empty from "../../../page/home/empty.png";

interface MoreProps {}

const More: React.FC<MoreProps> = () => {
  const [show, setshow] = useState<boolean>(false);
  const { title, more_tab } = useSelector((state: any) => state.explore);
  console.log(more_tab);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [list, setList] = useState<any[]>([]);
  const [filter, setFilter] = useState<any[]>([]);
  const [customLoad, setCustomLoad] = useState(false);
  const { data, isLoading, isFetching, refetch } = useGetExploreTagQuery({
    order: more_tab ? more_tab : "created_at",
    tag: title ? title : "Latest Drama",
    page: page,
  });

  useEffect(() => {
    if (data?.data) {
      setFilter(data?.data.filter);
      setList((prev) => {
        const newList = [...prev, ...data.data.list];
        return newList.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.post_id === item.post_id) // Assuming `id` is unique
        );
      });
      const loadedItems =
        data?.pagination?.current_page * data?.pagination?.per_page;
      setHasMore(loadedItems < data?.pagination?.total);
      console.log(loadedItems);
      if (!more_tab) {
        dispatch(setMoreTab(filter[0]?.key));
      }
    } else {
      setHasMore(false);
    }
  }, [data]);

  const popularItems = Array.from({ length: 10 }, (_, i) => ({
    title: `My Boss (2021) - ${i + 1}`,
    views: 3685 + i * 10,
    likes: 1245 + i * 5,
  }));

  const latestItems: any[] = []; // Empty for "Latest"

  const renderItems = more_tab === "Popular" ? popularItems : latestItems; // Change to more_tab

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const showDetailsVod = (file: any) => {
    dispatch(setDetails(file));
    navigate(paths.vod_details);
  };

  const handleTabChange = (ff: any) => {
    setCustomLoad(true);
    dispatch(setMoreTab(ff.key));
    if (isFetching || isLoading) {
      return;
    } else {
      setTimeout(() => {
        setCustomLoad(false);
      }, 1000);
    }
  };

  console.log(data?.data);
  // console.log(list);

  return (
    <>
      <div className="px-[20px] flex flex-col relative min-h-scree bg-[#16131C]">
        {/* Header */}
        <div className=" fixed z-[99] w-full bg-transparent bg-[#16131C]">
          <div className="grid grid-cols-3 justify-between py-[12px] bg-[#16131C] ">
            <ChevronLeft
              onClick={() => navigate("/")}
              className="rec_exp_more_btn px-[2px]"
            />
            <h1 className="w-2/3 text-white text-[18px] text-center font-[500]">
              {title}
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-[8px] bg-[#16131C] pb-[12px]">
            {filter?.map((ff: any, index) => (
              <button
                key={index}
                className={`text-white text-[14px] font-[400] leading-[16px] px-[16px] py-[8px] ${
                  more_tab === ff.key || ff.active
                    ? "more_tabs_buttons_active"
                    : "more_tabs_buttons"
                }`}
                onClick={() => handleTabChange(ff)} // Update more_tab
              >
                {ff.title}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {list?.length === 0 ? (
          <div className=" mt-[80px]">
            <div className={`flex justify-center items-center py-[200px]`}>
              <div className="flex flex-col items-center">
                <img src={empty} className="w-[80px]" alt="" />
                <h1 className="text-center text-white/60">搜索结果为空</h1>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-[20px] flex flex-col gap-[20px] w-full mt-[80px]">
            {isLoading || customLoad ? (
              <div className=" flex justify-center w-screen py-[200px]">
                <div className="">
                  <img
                    src={Loader}
                    className="w-[70px] h-[70px]"
                    alt="Loading"
                  />
                </div>
              </div>
            ) : (
              <>
                {list?.map((item: any, index) => (
                  <div
                    onClick={() => showDetailsVod(item)}
                    key={index}
                    className="flex w-full justify-center items-center gap-[16px]"
                  >
                    <ImageWithPlaceholder
                      src={item.preview_image}
                      alt={item.title || "Video"}
                      width={"100%"}
                      height={"100%"}
                      className=" w-[175px] h-[100px] rounded-[8px] object-cover"
                    />
                    <img
                      className="w-[107px] h-[69px] rounded-[8px] object-cover object-center hidden"
                      src={item.preview_image}
                      alt="More"
                    />
                    <div className="w-2/3 flex flex-col h-[70px] justify-between">
                      <span className="text-white text-[14px] font-[400]">
                        {item.title.length > 20
                          ? `${item.title.slice(0, 30)}...`
                          : item.title}{" "}
                      </span>
                      <div className="flex justify-between text-[#AAA] text-[12px] font-[400] leading-[15px]">
                        <span>
                          {item.view_count ? item.view_count : "11"} 次观看
                        </span>
                        <span>{item.like_count} 人喜欢</span>
                      </div>
                    </div>
                  </div>
                ))}
                <InfiniteScroll
                  className="py-[20px]"
                  dataLength={list.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={
                    <div className=" flex justify-center py-[10px]">
                      <div className="">
                        <img
                          src={Loader}
                          className="w-[70px] h-[70px]"
                          alt="Loading"
                        />
                      </div>
                    </div>
                  }
                  endMessage={
                    <div className="flex hidden bg-whit pt-20 justify-center items-center">
                      <p className="py-10" style={{ textAlign: "center" }}>
                        <b>No video yet!</b>
                      </p>
                    </div>
                  }
                >
                  <></>
                </InfiniteScroll>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default More;
