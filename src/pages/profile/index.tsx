import React, { useState } from "react";
import { useAuth, logout, editUser } from "../../data/authentication";
import {
  AiFillEdit,
  AiFillLock,
  AiOutlineLogout,
  AiFillCustomerService,
  AiFillDelete,
  AiFillCamera,
  AiFillCloseCircle,
} from "react-icons/ai";
import ChangePasswordModal from "./change-password";
import AccountSettingsModal from "./account-settings";
import { ConfirmPasswordModal } from "./confirm-password";
import { ContactSupportModal } from "./contact-support";
import { useShallow } from "zustand/shallow";
import { ConfirmActionModal } from "../../components/confirm-action-modal";
import blankProfilePic from "../../assets/blank-profile-picture.png";

export const Profile: React.FC = () => {
  const { user } = useAuth(
    useShallow((state) => ({
      user: state.user,
    }))
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConfirmActionModalOpen, setIsConfirmActionModalOpen] =
    useState(false);

  const openConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    if (user?._id) await editUser(user?._id, formData);
  };

  const handleRemoveProfilePic = async () => {
    if (user?._id) await editUser(user?._id, { profilePic: "" });
  };

  return (
    <div className="flex flex-col flex-1 pt-2 pb-14 px-5 gap-10 overflow-y-auto text-beige entrance-anim">
      <h1 className="page-title">Profile</h1>

      <div className="flex gap-4 items-center border-b-2 border-green pb-4">
        <div className="relative group">
          {user?.profilePic !== blankProfilePic ? (
            <AiFillCloseCircle
              className="absolute -top-0.5 -right-0.5 bg-beige rounded-full text-red text-2xl cursor-pointer z-10 
            opacity-0 group-hover:opacity-100 
            pointer-events-none group-hover:pointer-events-auto
            transition-opacity duration-300"
              onClick={() => {
                setIsConfirmActionModalOpen(true);
              }}
            />
          ) : null}

          <ConfirmActionModal
            isOpen={isConfirmActionModalOpen}
            setIsOpen={setIsConfirmActionModalOpen}
            action={handleRemoveProfilePic}
          />
          <label className="block cursor-pointer">
            <div className="relative rounded-full h-20 w-20 overflow-hidden max-h-20 max-w-20">
              <img
                src={`${user?.profilePic}?v=${Math.floor(
                  1000 + Math.random() * 9000
                )}`}
                className="w-full h-full object-cover rounded-full"
                alt="User profile pic"
              />
              <div className="absolute inset-0 bg-gray opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-full" />
            </div>
            <AiFillCamera className="absolute inset-0 m-auto text-beige text-4xl cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <input type="file" className="hidden" onChange={onFileChange} />
          </label>
        </div>

        <div className="flex flex-col flex-1 gap-1 whitespace-nowrap overflow-hidden">
          <p className="text-2xl overflow-hidden text-ellipsis">{user?.name}</p>
          <p className="text-base overflow-hidden text-ellipsis">
            {user?.email}
          </p>
        </div>

        <AccountSettingsModal
          {...{
            userId: user?._id,
            modalTrigger: <AiFillEdit className="text-4xl cursor-pointer" />,
          }}
        />
      </div>

      <div className="flex flex-col gap-6 text-2xl">
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
