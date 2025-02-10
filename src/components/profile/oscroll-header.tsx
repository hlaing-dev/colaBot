import { EllipsisVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SettingBtn2 from "./setting-btn2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaHeart } from "react-icons/fa";
import { MdWatchLater } from "react-icons/md";
import Loader from "@/page/home/vod_loader.gif";
import { NoVideo, Person } from "@/assets/profile";
import { BsPersonLock } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useGetLikedPostQuery } from "@/store/api/profileApi";
import VideoGrid from "./video-grid";
import defaultCover from "@/assets/cover.jpg";

const OscrollHeader = ({ photo, name, id, visibility, dphoto }: any) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [waterfall, setWaterFall] = useState<any[]>([]);
  const { data, isLoading } = useGetLikedPostQuery({ user_id: id, page });

  console.log(data, "data for os");

  useEffect(() => {
    if (data?.data) {
      setWaterFall((prev) => [...prev, ...data.data]);

      const loadedItems =
        data.pagination.current_page * data.pagination.per_page;
      setHasMore(loadedItems < data.pagination.total);
    } else {
      setHasMore(false);
    }
  }, [data]);

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };
  return (
    <div className="flex justify-between items-center w-full z-[1800] relative">
      <div className="flex items-center gap-3">
        {photo ? (
          <img
            className="w-[48px] z-[1500] h-[48px] rounded-full object-cover object-center"
            src={photo}
            alt=""
          />
        ) : (
          <div className="w-[48px] h-[48px] rounded-full bg-[#FFFFFF12] flex justify-center items-center p-2">
            <Person />
          </div>
        )}

        <p className="z-[1500]">{name}</p>
      </div>
      <div className="flex gap-3 z-[1500] items-center">
        <SettingBtn2 id={id} />
      </div>
    </div>
  );
};

export default OscrollHeader;
