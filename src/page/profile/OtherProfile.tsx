import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetUserProfileQuery } from "@/store/api/profileApi";
import { ChevronLeft, Copy, Flag, Search } from "lucide-react";
import ProfileAvatar from "@/components/profile/profile-avatar";
import Loader from "@/components/shared/loader";
import OtherStats from "@/components/profile/other-stats";
import VideoTab2 from "@/components/profile/video-tab2";
import FollowStatusBtn from "@/components/profile/follow-status-btn";
import MaleSVG from "@/assets/profile/male";
import FemaleSVG from "@/assets/profile/female";
import defaultCover from "@/assets/cover.jpg";
import { useEffect, useRef, useState } from "react";
import ScrollHeader from "@/components/profile/scroll-header";
import OscrollHeader from "@/components/profile/oscroll-header";
import SettingBtn2 from "@/components/profile/setting-btn2";
import { useSelector } from "react-redux";
import share from "@/assets/profile/share.svg";

const decryptImage = (arrayBuffer, key = 0x12, decryptSize = 4096) => {
  const data = new Uint8Array(arrayBuffer);
  const maxSize = Math.min(decryptSize, data.length);
  for (let i = 0; i < maxSize; i++) {
    data[i] ^= key;
  }
  // Decode the entire data as text.
  return new TextDecoder().decode(data);
};

const OtherProfile = () => {
  const { id } = useParams();
  const user = useSelector((state: any) => state?.persist?.user) || "";

  const [isCopied, setIsCopied] = useState(false);
  const headerRef = useRef<any>(null);
  const [showHeader, setShowHeader] = useState(false);
  const navigate = useNavigate();
  const {
    data: userData,
    isLoading: userLoading,
    refetch,
    isFetching,
  } = useGetUserProfileQuery(id || "");
  const [decryptedCover, setDecryptedCover] = useState(defaultCover);
  const [decryptedPhoto, setDecryptedPhoto] = useState("");

    useEffect(() => {
    const loadAndDecryptCover = async () => {
      if (!user?.token || !userData?.data?.cover_photo) {
        setDecryptedCover(defaultCover);
        return;
      }

      try {
        const coverUrl = userData.data.cover_photo;

        // If it's not a .txt file, assume it's already a valid URL
        if (!coverUrl.endsWith(".txt")) {
          setDecryptedCover(coverUrl);
          return;
        }

        // Fetch the encrypted image data
        const response = await fetch(coverUrl);
        const arrayBuffer = await response.arrayBuffer();

        // Decrypt the first 4096 bytes and decode the entire file as text.
        const decryptedStr = decryptImage(arrayBuffer);

        // Set the decrypted cover image source
        setDecryptedCover(decryptedStr);
      } catch (error) {
        console.error("Error loading cover photo:", error);
        setDecryptedCover(defaultCover);
      }
    };

    loadAndDecryptCover();
  }, [userData?.data?.cover_photo]);

    useEffect(() => {
      const loadAndDecryptPhoto = async () => {
        if (!user?.token || !data?.data?.profile_photo) {
          setDecryptedPhoto("");
          return;
        }
  
        try {
          const photoUrl = data.data.profile_photo;
  
          // If it's not a .txt file, assume it's already a valid URL
          if (!photoUrl.endsWith(".txt")) {
            setDecryptedPhoto(photoUrl);
            return;
          }
  
          // Fetch encrypted image data
          const response = await fetch(photoUrl);
          const arrayBuffer = await response.arrayBuffer();
  
          // Decrypt the first 4096 bytes and decode as text.
          const decryptedStr = decryptImage(arrayBuffer);
          console.log("Decrypted profile photo string is =>", decryptedStr);
  
          // Set the decrypted profile photo source
          setDecryptedPhoto(decryptedStr);
        } catch (error) {
          console.error("Error loading profile photo:", error);
          setDecryptedPhoto("");
        }
      };
  
      loadAndDecryptPhoto();
    }, [userData?.data?.profile_photo]);

  const handleCopy = (text: any) => {
    navigator?.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        // console.log(rect);

        if (rect.top <= 100) {
          setShowHeader(true);
        } else {
          setShowHeader(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Clean up on unmount
    };
  }, []);

  useEffect(() => {
    refetch();
  }, [id]);

  if (userLoading || isFetching) return <Loader />;
  return (
    <div className="h-screen flex flex-col hide-sb">
      {showHeader ? (
        <>
          <div className="gradient-overlay2"></div>
          <img
            src={decryptedCover ? decryptedCover : defaultCover}
            alt=""
            className={`fixed top-0 z-[1500] left-0 w-full h-[155px] object-cover object-center`}
          />
        </>
      ) : (
        <>
          <div className="gradient-overlay"></div>
          <img
            src={decryptedCover ? decryptedCover : defaultCover}
            alt=""
            className="fixed top-0 left-0 w-full h-[23vh] object-cover object-center"
          />
        </>
      )}
      {isCopied ? (
        <div className="w-full z-[1300] absolute top-[80vh] flex justify-center">
          <p className="text-[14px] bg-[#FFFFFF14] px-2 py-1 rounded-lg w-[83px] text-center">
            已复制 ID
          </p>
        </div>
      ) : (
        ""
      )}
      <div className="flex-1">
        <div
          className={`px-5 fixed ${
            showHeader ? "opacity-1" : "opacity-0"
          } top-0 w-full z-[1600] py-5`}
        >
          <OscrollHeader
            photo={decryptedPhoto}
            name={userData?.data?.nickname}
            visibility={userData?.data?.content_visibility}
            id={id}
            dphoto={userData?.data?.cover_photo}
          />
        </div>
        {/* {showHeader ? (
          <div className="px-5 fixed top-0 w-full z-[1600] py-5">
            <OscrollHeader
              photo={userData?.data?.profile_photo}
              name={userData?.data?.nickname}
              visibility={userData?.data?.content_visibility}
              id={id}
              dphoto={userData?.data?.cover_photo}
            />
          </div>
        ) : (
          <></>
        )} */}
        <div className="z-[1900] relative px-5 w-full flex gap-3 my-5 justify-between items-center">
          <ChevronLeft onClick={() => navigate(-1)} />
          <div className="flex gap-3 z-[1500] items-center">
            {/* <div className="bg-[#FFFFFF1F] w-10 h-10 flex justify-center items-center p-2 rounded-full">
                <Search size={18} />
              </div> */}
            <div
              onClick={() => handleCopy("Copied Link")}
              className="bg-[#FFFFFF1F] w-10 h-10 flex justify-center items-center p-2 rounded-full"
            >
              <img src={share} alt="" />
            </div>
            <Link
              to={`/reports/profile/${id}`}
              className="bg-[#FFFFFF1F] w-10 h-10 flex justify-center items-center p-2 rounded-full"
            >
              <Flag size={18} />
            </Link>
          </div>
        </div>
        <div className="w-full flex items-center gap-3 pb-5 px-5">
          <ProfileAvatar
            progress={userData?.data?.level_progress}
            levelImage={userData?.data?.level}
            photo={decryptedPhoto}
          />
          <div className="z-[1900] flex-1 flex flex-col gap-0.5">
            <p className="z-[1900] text-[18px] flex items-center gap-1">
              {userData?.data?.nickname}
              <span>
                {userData?.data?.gender == "Male" ? <MaleSVG /> : <></>}
              </span>
              <span>
                {userData?.data?.gender == "Female" ? <FemaleSVG /> : <></>}
              </span>
              {/* <span>
                <BsPatchCheckFill className="z-[1200] text-[#888]" />
              </span>{" "} */}
            </p>
            <p className="z-[1900] text-[14px] text-[#BBBBBB] flex items-center gap-2">
              B号 : {userData?.data?.user_code}{" "}
              <Copy
                onClick={() => handleCopy(userData?.data?.user_code)}
                size={14}
              />
            </p>
            {userData?.data?.city &&
            userData?.data?.province &&
            userData?.data?.share_region == "on" ? (
              <div className="z-[1900] flex">
                <div className="z-[1900] text-[12px] flex items-center gap-1 text-[#BBBBBB] bg-[#FFFFFF1F] px-3 pt-1 rounded-full justify-center shrink-0">
                  <span>{userData?.data?.province}</span>:
                  <span>{userData?.data?.city}</span>
                </div>
              </div>
            ) : (
              <div className="z-[1900] flex">
                <div className="z-[1900] text-[12px] flex items-center gap-1 text-[#BBBBBB] bg-[#FFFFFF1F] px-3 py-1 rounded-full justify-center shrink-0">
                  <span>未知</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <h1 className="text-[12px] text-[#888] mb-5 italic px-5 z-[1900] relative">
          {userData?.data?.bio && userData?.data?.hide_bio == "off"
            ? userData?.data?.bio
            : ""}
        </h1>
        <div className={`${showHeader ? "opacity-0" : "opacity-1"}`}>
          <OtherStats
            followers={userData?.data?.followers_count}
            followings={userData?.data?.following_count}
            likes={userData?.data?.likes_sum_count}
            id={userData?.data?.id}
          />
        </div>
        {user?.id == id ? (
          <></>
        ) : (
          <div
            className={`px-5 z-[1900] relative ${
              showHeader ? "opacity-0" : "opacity-1"
            }`}
          >
            <FollowStatusBtn
              userData={userData}
              id={id}
              refetch={refetch}
              userLoading={userLoading}
            />
          </div>
        )}
        <div ref={headerRef} className="sticky z-[1500] top-0">
          {/* {showHeader ? "Show" : "Hide"} */}
        </div>
        <div className="px-5">
          <VideoTab2
            id={id}
            showHeader={false}
            visibility={userData?.data?.content_visibility}
          />
        </div>
      </div>
    </div>
  );
};

export default OtherProfile;
