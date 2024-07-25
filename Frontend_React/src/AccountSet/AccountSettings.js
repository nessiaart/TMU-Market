import React, { useState } from "react";
import "./AccountSettings.css";
import ProfileInfo from "./ProfileInfo";

function AccountSettings() {
  const [showProfileInfo] = useState(true);

  return (
    <div className="section account-settings">
      {showProfileInfo && <ProfileInfo />}
    </div>
  );
}

export default AccountSettings;
