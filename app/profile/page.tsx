"use client";

import UserProfile from "@/components/UserProfile";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-4">User Profile</h2>
        <p className="">
          Manage your account settings and preferences
        </p>
      </div>
      <UserProfile />
    </div>
  );
}
