import Stats from "@/components/profile/stats";
import { Person } from "@/assets/profile";
import defaultCover from "@/assets/cover.jpg";
import center from "@/assets/profile/center3.png";
import VideoTabs from "@/components/profile/video-tabs";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useGetMyProfileQuery } from "@/store/api/profileApi";
import { useSelector } from "react-redux";
import { PenIcon as UserPen, Bell, X, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import SettingBtn from "@/components/profile/setting-btn";
import ProfileAvatar from "@/components/profile/profile-avatar";
import phoneImg from "@/assets/profile/phone-img.png";
import { useEffect, useRef, useState } from "react";
import Loader from "@/components/shared/loader";
import MaleSVG from "@/assets/profile/male";
import FemaleSVG from "@/assets/profile/female";
import EditCover from "@/components/profile/edit-cover";
import AuthDrawer from "@/components/profile/auth/auth-drawer";
import ScrollHeader from "@/components/profile/scroll-header";

const Profile = () => {
  const headerRef = useRef<any>(null);

  const [showHeader, setShowHeader] = useState(false);
  const { data, isLoading, refetch } = useGetMyProfileQuery("");
  const [show, setShow] = useState(false);
  const user = useSelector((state: any) => state?.persist?.user);
  const gender = useSelector((state: any) => state?.persist?.gender);
  const region = useSelector((state: any) => state?.persist?.region);
  const [isCopied, setIsCopied] = useState(false); // State for feedback

  const handleCopy = (text: any) => {
    navigator?.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true); // Show feedback
        setTimeout(() => setIsCopied(false), 2000); // Hide feedback after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };
  // console.log(data);
  useEffect(() => {
    refetch();
  }, []);
  useEffect(() => {
    refetch();
  }, [data]);
  useEffect(() => {
    refetch();
  }, [user]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the header is not intersecting (i.e., it's sticky at the top),
        // we set showHeader to true
        // setShowHeader(!entry.isIntersecting);
      },
      {
        // This rootMargin ensures the callback triggers right as the element
        // reaches the top of the viewport
        rootMargin: "-1px 0px 0px 0px",
        threshold: [1],
      }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, []);

  console.log(showHeader);

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="gradient-overlay"></div>
      <img
        src={
          user?.token
            ? data?.data?.cover_photo
              ? data?.data?.cover_photo
              : defaultCover
            : defaultCover
        }
        alt=""
        className={`absolute top-0 left-0 w-full h-[23vh] object-cover object-center`}
      />
      {isCopied ? (
        <div className="w-full absolute top-[80vh] flex justify-center">
          <p className="text-[14px] bg-[#FFFFFF14] px-2 py-1 rounded-lg w-[83px] text-center">
            已复制 ID
          </p>
        </div>
      ) : (
        ""
      )}
      <div className={`z-[1200] max-h-screen no-scrollbar profile-bg `}>
        {show ? (
          <div className="absolute top-0 z-[1500] left-0 w-full h-full mx-auto flex flex-col justify-center items-center bg-black/80">
            <div className="z-[1200] px-10">
              <div className="z-[1200] h-[250px] gradient-b  rounded-lg relative">
                <img
                  src={center || "/placeholder.svg"}
                  className=" absolute h-[250px h-full w-full "
                  alt=""
                />
                <div className="z-[1200] w-full absolute -top-20 flex justify-center items-center">
                  <img
                    src={phoneImg || "/placeholder.svg"}
                    className={`w-[180px] z-[1200] `}
                    alt=""
                  />
                </div>
              </div>
              <div className="z-[1200] flex flex-col justify-center items-center gap-4 bg-[#161619] p-5 rounded-bl-lg rounded-br-lg">
                <h1 className="z-[1200] text-[18px] font-semibold text-white">
                  创作者中心
                </h1>
                <p className="z-[1200] text-[14px] text-center text-[#FFFFFFCC]">
                  查看创作者排名，洞察顶尖创作者的风采，观看最受欢迎视频，掌握流行趋势，发现精彩瞬间，探索全新内容。
                </p>
                <Button className="z-[1200] mt-2 mb-4 rounded-[16px] px-[26px] py-[12px] bg-[#FFFFFF14] hover:bg-[#FFFFFF14]">
                  即将上线，敬请期待！
                </Button>
              </div>
            </div>
            <div
              onClick={() => setShow(false)}
              className="z-[1200] bg-[#FFFFFF29] p-2 rounded-full mt-5"
            >
              <X />
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="z-[1200] flex my-5 justify-between items-center px-5">
          {user?.token ? <EditCover /> : <div></div>}
          <div className="z-[1200] flex gap-3 items-center">
            <Link
              to={paths.noti}
              className="z-[1200] bg-[#FFFFFF12] w-10 h-10 rounded-full flex items-center justify-center"
            >
              <Bell />
            </Link>
            <SettingBtn setShow={setShow} />
          </div>
        </div>
        {!showHeader ? (
          <div className="w-full flex flex-col px-5">
            <div className="z-[1200] w-full flex items-center gap-3 py-5">
              {!user?.token ? (
                <div className="z-[1200] w-[58px] h-[58px] rounded-full bg-[#FFFFFF12] flex justify-center items-center p-2">
                  <Person />
                </div>
              ) : (
                <ProfileAvatar
                  progress={data?.data?.level_progress}
                  levelImage={data?.data?.level}
                  photo={data?.data?.profile_photo}
                />
              )}
              {!user?.token ? (
                <AuthDrawer />
              ) : (
                <div className="z-[1200] flex-1 flex flex-col gap-0.5">
                  <p className="z-[1200] text-[18px] flex items-center gap-1">
                    {data?.data?.nickname}
                    <span>{gender == "Male" ? <MaleSVG /> : <></>}</span>
                    <span>{gender == "Feale" ? <FemaleSVG /> : <></>}</span>
                  </p>
                  <p className="z-[1200] text-[14px] text-[#BBBBBB] flex gap-1 items-center">
                    B号 : {data?.data?.user_code}
                    <Copy
                      onClick={() => handleCopy(data?.data?.user_code)}
                      size={14}
                    />
                  </p>
                  {data?.data?.share_region == "on" && region ? (
                    <div className="z-[1200] flex">
                      <div className="z-[1200] text-[12px] flex items-center gap-1 text-[#BBBBBB] bg-[#FFFFFF1F] px-3 py-1 rounded-full justify-center shrink-0">
                        {!region?.city?.length && !region?.province?.length ? (
                          <span>未知</span>
                        ) : (
                          <>
                            <span>{region?.provinceName}</span>:
                            <span>{region?.city}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="z-[1200] flex">
                      <div className="z-[1200] text-[12px] flex items-center gap-1 text-[#BBBBBB] bg-[#FFFFFF1F] px-3 py-1 rounded-full justify-center shrink-0">
                        <span>未知</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="z-[1200]">
              {data?.data?.hide_bio == "on" ? (
                <></>
              ) : user?.token ? (
                data?.data?.bio ? (
                  <div className="text-[12px] text-[#888] mb-5 italic">
                    {data?.data?.bio ? data?.data?.bio : ""}
                  </div>
                ) : (
                  <Link
                    to={paths.add_bio}
                    className="text-[12px] text-[#FFFFFFCC] bg-[#FFFFFF14] px-2 py-1 w-[91px] text-center rounded-full"
                  >
                    + 个人简介
                  </Link>
                )
              ) : (
                <></>
              )}
            </div>
          </div>
        ) : (
          <ScrollHeader
            photo={data?.data?.profile_photo}
            name={data?.data?.nickname}
          />
        )}

        <div className={`px-5 ${showHeader ? "opacity-0" : "opacity-1"}`}>
          <Stats />
        </div>
        <div
          ref={headerRef}
          className="w-full top-0 z-[1500] py-1 h-[1px]"
        ></div>
        <div className="px-5">
          {user?.token ? (
            <Link to={paths.profileDetail}>
              <Button
                className={`${
                  showHeader ? "opacity-0" : "opacity-1"
                } z-[1200] w-full bg-[#FFFFFF0F] hover:bg-[#FFFFFF0F] relative rounded-[12px]`}
              >
                <UserPen /> 编辑资料
              </Button>
            </Link>
          ) : (
            <></>
          )}
        </div>
        <div className="top-[100px] z-[1200]">
          <div className="z-[1200] relative px-5">
            <VideoTabs showHeader={showHeader} login={user?.token} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
