import { FaAngleRight } from "react-icons/fa";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGender } from "@/store/slices/persistSlice";
import { useChangeGenderMutation } from "@/store/api/profileApi";
import Loader from "../shared/loader";

const EditGender = () => {
  const gender = useSelector((state: any) => state.persist.gender);

  const dispatch = useDispatch();
  // const [gender, setGender] = useState("Other");
  const [isOpen, setIsOpen] = useState(false);
    const closeRef = useRef<HTMLButtonElement>(null);
  
  const [changeGender, { data, isLoading }] = useChangeGenderMutation();

  return (
    <Drawer>
      <div className="text-[14px] flex items-center justify-between">
        <h1>Gender</h1>
        <DrawerTrigger asChild>
          <p className="flex items-center gap-1 text-[#888]">
            {gender} <FaAngleRight />
          </p>
        </DrawerTrigger>
      </div>
      <DrawerContent className="border-0 bg-[#121012]">
        {/* {isLoading ? <Loader /> : <></>} */}
        <div className="w-full px-5 py-7">
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center gap-2">
              <h1
                onClick={async () => {
                  dispatch(setGender("Other"));
                  await changeGender({ gender: "Other" });
                  closeRef.current?.click();
                }}
                className={`${
                  gender == "Other" ? "text-white" : "text-[#999]"
                } text-[16px]`}
              >
                Other
              </h1>
              <span
                className={`w-[6px] h-[6px] rounded-full gradient-bg ${
                  gender == "Other" ? "block" : "hidden"
                }`}
              ></span>
            </div>
            <div className="flex items-center gap-2">
              <h1
                onClick={async () => {
                  dispatch(setGender("Male"));
                  await changeGender({ gender: "Male" });
                  closeRef.current?.click();
                }}
                className={`${
                  gender == "Male" ? "text-white" : "text-[#999]"
                } text-[16px]`}
              >
                Male
              </h1>
              <span
                className={`w-[6px] h-[6px] rounded-full gradient-bg ${
                  gender == "Male" ? "block" : "hidden"
                }`}
              ></span>
            </div>
            <div className="flex items-center gap-2">
              <h1
                onClick={async () => {
                  dispatch(setGender("Female"));
                  await changeGender({ gender: "Female" });
                  closeRef.current?.click();
                }}
                className={`${
                  gender == "Female" ? "text-white" : "text-[#999]"
                } text-[16px]`}
              >
                Female
              </h1>
              <span
                className={`w-[6px] h-[6px] rounded-full gradient-bg ${
                  gender == "Female" ? "block" : "hidden"
                }`}
              ></span>
            </div>
            <DrawerClose asChild>
              <Button className="w-full rounded-lg bg-[#FFFFFF0A] hover:bg-[#FFFFFF0A]">
                Cancel
              </Button>
            </DrawerClose>
          </div>
          <DrawerClose ref={closeRef} className="hidden" />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditGender;
