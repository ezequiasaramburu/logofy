"use client";
import dynamic from "next/dynamic";
import ClientOnly from "@/components/client-only";
import Buttons from "@/components/buttons-control";
import Header from "@/components/header";
import MaxWidth from "@/components/max-width";
import Preview from "@/components/preview";
import { UpdateStorageContext } from "@/context/update-storage-context";
import { useState, useEffect } from "react";

// Dynamically import components that use localStorage with ssr disabled
const DynamicIconController = dynamic(
  () => import("@/components/icon-controller"),
  { ssr: false }
);
const DynamicBackgroundController = dynamic(
  () => import("@/components/back-controller"),
  { ssr: false }
);
const DynamicTextController = dynamic(
  () => import("@/components/text-controller"),
  { ssr: false }
);

export default function Home() {
  const [activeTab, setActiveTab] = useState("icon");
  const [updateStorage, setUpdateStorage] = useState({});
  const [downloadIcon, setDownloadIcon] = useState();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <UpdateStorageContext.Provider value={{ updateStorage, setUpdateStorage }}>
      <MaxWidth className="overflow-hidden">
        <Header DownloadIcon={setDownloadIcon} />

        <main className="flex mt-16 h-[calc(100vh-4rem)]">
          <div className="w-40 fixed">
            <Buttons activeTab={activeTab} setActiveTab={handleTabChange} />
          </div>
          <div className="ml-40 flex-1 flex">
            <div className="w-1/4 h-[calc(100vh-4rem)] overflow-y-auto relative">
              <ClientOnly>
                <div className="absolute inset-0">
                  <div
                    className={`absolute inset-0 ${
                      activeTab === "icon"
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <DynamicIconController />
                  </div>
                  <div
                    className={`absolute inset-0 ${
                      activeTab === "text"
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <DynamicTextController />
                  </div>
                  <div
                    className={`absolute inset-0 ${
                      activeTab === "background"
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <DynamicBackgroundController />
                  </div>
                </div>
              </ClientOnly>
            </div>
            <div
              className="w-3/4 px-4 flex items-center justify-center"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: "10px 10px",
                backgroundPosition: "-0.5px -0.5px",
                backgroundColor: "#f5f5f5",
              }}
            >
              <Preview downloadIcon={downloadIcon} />
            </div>
          </div>
        </main>
      </MaxWidth>
    </UpdateStorageContext.Provider>
  );
}
