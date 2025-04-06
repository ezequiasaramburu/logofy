"use client";
import dynamic from "next/dynamic";
import ClientOnly from "@/components/client-only";
import Buttons from "@/components/buttons-control";
import Header from "@/components/header";
import MaxWidth from "@/components/max-width";
import Preview from "@/components/preview";
import { UpdateStorageContext } from "@/context/update-storage-context";
import { useState } from "react";

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

  return (
    <UpdateStorageContext.Provider value={{ updateStorage, setUpdateStorage }}>
      <MaxWidth className="overflow-hidden">
        <Header DownloadIcon={setDownloadIcon} />

        <main className="flex mt-16">
          <div className="w-64 fixed">
            <Buttons activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <div className="ml-64 flex-1 flex">
            <div className="w-4/12 mb-16 overflow-y-auto">
              <ClientOnly>
                {activeTab === "icon" ? (
                  <DynamicIconController />
                ) : activeTab === "text" ? (
                  <DynamicTextController />
                ) : (
                  <DynamicBackgroundController />
                )}
              </ClientOnly>
            </div>
            <div className="w-8/12 px-4">
              <Preview downloadIcon={downloadIcon} />
            </div>
          </div>
        </main>
      </MaxWidth>
    </UpdateStorageContext.Provider>
  );
}
