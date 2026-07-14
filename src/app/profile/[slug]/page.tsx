"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { authClient } from "../../../lib/auth-client";
import { fetchUserProfile, UserProfile } from "../../../lib/actions/profile";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function DynamicProfilePage({ params }: PageProps) {
  // Unwrap the params promise using React.use()
  const { slug } = use(params);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  async function handleProfileUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!profile) return;

    const nextName = displayName.trim();
    const nextImage = profileImage.trim();

    if (!nextName) {
      setSaveMessage("Display name is required.");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    try {
      const updatePayload: { name: string; image?: string } = { name: nextName };

      if (nextImage) {
        updatePayload.image = nextImage;
      }

      await authClient.updateUser(updatePayload);

      setProfile((current) =>
        current
          ? {
              ...current,
              name: nextName,
              image: nextImage || current.image,
            }
          : current,
      );

      setSaveMessage("Profile updated successfully.");
    } catch (error) {
      setSaveMessage("Unable to update your profile right now.");
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    async function loadData() {
      if (!slug) {
        setErrorMsg("No user identifier specified in the URL.");
        setLoading(false);
        return;
      }

      try {
        // Fetch the user profile using the dynamic slug parameter
        const res = await fetchUserProfile(slug);

        if (res.success && res.data) {
          setProfile(res.data);
          setDisplayName(res.data.name ?? "");
          setProfileImage(res.data.image ?? "");
        } else {
          setErrorMsg(res.message || "Failed to load profile parameters.");
        }
      } catch (err: any) {
        setErrorMsg("Something went wrong while retrieving profile details.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  const getFormattedDate = (dateVal: any) => {
    if (!dateVal) return "N/A";
    const parsedDate = typeof dateVal === "object" && dateVal.$date ? dateVal.$date : dateVal;
    return new Date(parsedDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const profileImageSrc = profile?.image?.trim();
  const hasProfileImage = Boolean(profileImageSrc);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf5ee] text-[#3a302a] flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40">
          <Icon icon="line-md:loading-twotone-loop" className="text-[#c2652a] text-5xl mb-4" />
          <p className="font-serif italic text-lg text-[#605850]">Retrieving your craft profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf5ee] text-[#3a302a] font-sans selection:bg-[#fbe8d8] selection:text-[#401a08]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-16">
        {errorMsg ? (
          <div className="bg-[#fce4e0] border border-[#7a1a10]/20 rounded-xl p-6 text-center my-12">
            <Icon icon="material-symbols:error-outline" className="text-[#c0392b] text-4xl mx-auto mb-3" />
            <p className="text-[#7a1a10] font-medium">{errorMsg}</p>
            <Link href="/" className="mt-4 inline-block text-sm text-[#c2652a] hover:underline font-bold">
              Return Home
            </Link>
          </div>
        ) : (
          profile && (
            <div className="space-y-8">
              
              {/* Profile Card */}
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_2px_16px_rgba(58,48,42,0.04)] border border-[#d8d0c8]/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#c2652a]" />
                
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#faf5ee] shadow-md bg-[#ece6dc]">
                    {hasProfileImage ? (
                      <Image
                        src={profileImageSrc}
                        alt={profile.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#f2ece4] to-[#e7ddcf] text-[#8a7061]">
                        <span className="font-serif text-3xl italic font-bold">
                          {profile.name
                            .split(" ")
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((part) => part[0]?.toUpperCase())
                            .join("") || "U"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-center md:text-left space-y-2 flex-1">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                      <h1 className="font-serif text-3xl md:text-4xl italic font-bold">
                        {profile.name}
                      </h1>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${
                        profile.role === "admin" 
                          ? "bg-[#fce0e0] text-[#2e1515]" 
                          : profile.role === "recruiter" 
                          ? "bg-[#eae2da] text-[#504840]" 
                          : "bg-[#fbe8d8] text-[#401a08]"
                      }`}>
                        {profile.role}
                      </span>
                    </div>
                    <p className="text-[#605850] text-lg font-light">{profile.email}</p>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-[#78706a] pt-1">
                      <span className="flex items-center gap-1">
                        <Icon icon="material-symbols:verified-user" className="text-emerald-600 text-base" />
                        {profile.emailVerified ? "Verified Account" : "Unverified"}
                      </span>
                      <span className="h-1 w-1 bg-[#9a9088] rounded-full" />
                      <span>Member since {getFormattedDate(profile.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Form Column */}
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl p-8 border border-[#d8d0c8]/30 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
                    <h3 className="font-serif text-2xl italic mb-6">Profile Settings</h3>
                    
                    <form className="space-y-6" onSubmit={handleProfileUpdate}>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#78706a] mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg bg-[#faf5ee] border border-[#d8d0c8]/60 focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#78706a] mb-2">
                          Profile Image URL
                        </label>
                        <input
                          type="url"
                          value={profileImage}
                          onChange={(e) => setProfileImage(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-3 rounded-lg bg-[#faf5ee] border border-[#d8d0c8]/60 focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#78706a] mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          disabled
                          value={profile.email}
                          className="w-full px-4 py-3 rounded-lg bg-[#f6f0e8] text-[#78706a] border border-[#d8d0c8]/40 cursor-not-allowed outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-[#c2652a] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#e08850] transition-all text-sm"
                      >
                        {isSaving ? "Updating..." : "Update Craft details"}
                      </button>
                      {saveMessage ? (
                        <p className="text-sm text-[#7a1a10]">{saveMessage}</p>
                      ) : null}
                    </form>
                  </div>
                </div>

                {/* Sidebar Quick Workspace Navigation */}
                <div className="space-y-6">
                  <div className="bg-[#f2ece4] rounded-2xl p-6 border border-[#d8d0c8]/30">
                    <h4 className="font-serif text-xl italic mb-4">Quick Workspace</h4>
                    <div className="space-y-3">
                      {profile.role === "applicant" && (
                        <>
                          <Link href="/dashboard/applicant" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-[#faf5ee] transition-all group">
                            <Icon icon="material-symbols:dashboard-customize-outline" className="text-[#c2652a] text-xl" />
                            <span className="text-sm font-medium group-hover:translate-x-1 transition-transform">Applicant Board</span>
                          </Link>
                          <Link href="/dashboard/applicant/jobs/saved" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-[#faf5ee] transition-all group">
                            <Icon icon="material-symbols:bookmark-outline" className="text-[#c2652a] text-xl" />
                            <span className="text-sm font-medium group-hover:translate-x-1 transition-transform">Saved Listings</span>
                          </Link>
                        </>
                      )}

                      {profile.role === "recruiter" && (
                        <>
                          <Link href="/dashboard/recruiter/jobs/new" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-[#faf5ee] transition-all group">
                            <Icon icon="material-symbols:post-add" className="text-[#c2652a] text-xl" />
                            <span className="text-sm font-medium group-hover:translate-x-1 transition-transform">Post a New Job</span>
                          </Link>
                          <Link href="/dashboard/recruiter" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-[#faf5ee] transition-all group">
                            <Icon icon="material-symbols:analytics-outline" className="text-[#c2652a] text-xl" />
                            <span className="text-sm font-medium group-hover:translate-x-1 transition-transform">Recruitment Board</span>
                          </Link>
                        </>
                      )}

                      {profile.role === "admin" && (
                        <Link href="/dashboard/admin" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-[#faf5ee] transition-all group">
                          <Icon icon="material-symbols:admin-panel-settings-outline" className="text-[#c2652a] text-xl" />
                          <span className="text-sm font-medium group-hover:translate-x-1 transition-transform">Admin Controls</span>
                        </Link>
                      )}

                      <Link href="/support" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-[#faf5ee] transition-all group">
                        <Icon icon="material-symbols:help-outline" className="text-[#c2652a] text-xl" />
                        <span className="text-sm font-medium group-hover:translate-x-1 transition-transform">Help Center</span>
                      </Link>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )
        )}
      </main>

      <Footer />
    </div>
  );
}