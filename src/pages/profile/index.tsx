import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { useAuth, userState } from "../../data/authentication";
import {
  AiFillEdit,
  AiFillLock,
  AiOutlineLogout,
  AiFillCustomerService,
  AiFillDelete,
} from "react-icons/ai";
import ChangePasswordModal from "./change-password";
import AccountSettingsModal from "./account-settings";
import { ConfirmPasswordModal } from "./confirm-password";
import { ContactSupportModal } from "./contact-support";

export const Profile: React.FC = () => {
  const [user] = useRecoilState(userState);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { logout } = useAuth();

  const openConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="flex flex-col flex-1 pt-2 pb-14 px-5 gap-10 overflow-y-auto text-beige entrance-anim">
      <h1 className="py-2 text-4xl font-semibold">Profile</h1>

      <div className="flex gap-4 items-center border-b-2 border-green pb-4">
        <div className="bg-green rounded-full h-24 w-24 max-h-24 max-w-24" />

        <div className="flex flex-col flex-1 gap-1 whitespace-nowrap overflow-hidden">
          <p className="text-3xl overflow-hidden text-ellipsis">{user?.name}</p>
          <p className="text-xl overflow-hidden text-ellipsis">{user?.email}</p>
        </div>

        <AccountSettingsModal
          {...{
            userId: user?._id,
            modalTrigger: <AiFillEdit className="text-5xl" />,
          }}
        />
      </div>

      <div className="flex flex-col gap-6 text-3xl">
        <ChangePasswordModal
          {...{
            userId: user?._id,
            modalTrigger: (
              <div className="profile-option">
                <AiFillLock />
                <p className="flex-1">Change password</p>
              </div>
            ),
          }}
        />

        <ContactSupportModal
          {...{
            modalTrigger: (
              <div className="profile-option">
                <AiFillCustomerService />
                <p className="flex-1">Contact support</p>
              </div>
            ),
          }}
        />

        <div className="profile-option" onClick={logout}>
          <AiOutlineLogout />
          <p className="flex-1">Log out</p>
        </div>

        <div className="profile-option text-red" onClick={openConfirmModal}>
          <AiFillDelete />
          <p className="flex-1">Delete account</p>
        </div>
        <ConfirmPasswordModal
          {...{
            isOpen: isConfirmModalOpen,
            close: closeConfirmModal,
            userId: user?._id,
            isDelete: true,
          }}
        />
      </div>
    </div>
  );
};
