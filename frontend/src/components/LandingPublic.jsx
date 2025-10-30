import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api";

export default function LandingPublic() {
  const { shareId } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("schools");
  const [contactModal, setContactModal] = useState(false);
  const [tourModal, setTourModal] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await axios.get(`/api/landing-pages/share/${shareId}`);
        setPageData(res.data);
        // Set active tab to first available tab
        if (res.data.editable_tabs && res.data.editable_tabs.length > 0) {
          setActiveTab(res.data.editable_tabs[0].id);
        }
      } catch (err) {
        console.error("Error loading shared page:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading your page...</p>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Page not found</h2>
          <p className="text-gray-400">This page is unavailable or has been removed.</p>
        </div>
      </div>
    );
  }

  // Extract data from pageData - handle both snake_case (from backend) and camelCase
  const title = pageData.title || "";
  const address = pageData.address || "";
  const details = pageData.details || "";
  const price = pageData.price || "";
  const description = pageData.description || "";
  const highlights = pageData.highlights || [];
  const property_details = pageData.property_details || pageData.propertyDetails || {};
  const features = pageData.features || {};
  const property_images = pageData.property_images || pageData.propertyImages || {};
  const editable_tabs = pageData.editable_tabs || pageData.editableTabs || [];
  const highlights_image = pageData.highlights_image || pageData.highlightsImage || "";
  const editable_details = pageData.editable_details || pageData.editableDetails || {};
  const room = pageData.room || {};
  const construction = pageData.construction || {};
  const tax = pageData.tax || {};



  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-auto bg-black text-white font-sans scroll-smooth">
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#050505] via-[#0f0f0f] to-black text-white px-6 lg:px-20 py-20 overflow-hidden">
        {/*  Background Glow */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-teal-700/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-700/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto space-y-10 z-10">
          {/*  Image Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 relative group rounded-3xl overflow-hidden shadow-2xl hover:shadow-teal-500/20 transition-all duration-500">
              {property_images.main ? (
                <img
                  src={property_images.main}
                  alt="Main House"
                  className="w-full h-[520px] object-cover rounded-3xl transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="w-full h-[520px] flex items-center justify-center bg-gray-800 rounded-3xl">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>

            {/*  Side Images */}
            <div className="grid grid-cols-2 gap-4">
              {["img1", "img2", "img3", "img4"].map((key) => (
                <div
                  key={key}
                  className="relative group rounded-2xl overflow-hidden shadow-md hover:shadow-purple-500/20 transition-all duration-300"
                >
                  {property_images[key]?.trim() ? (
                    <img
                      src={property_images[key]}
                      alt={key}
                      className="w-full h-[245px] object-cover rounded-2xl transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="w-full h-[245px] flex items-center justify-center bg-gray-800 rounded-2xl">
                      <span className="text-gray-600 text-xs">No image</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/*  Property Info */}
          <div className="mt-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-t border-gray-800 pt-8">
            <div className="flex-1 space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight text-white">
                {title}
              </h1>
              <p className="text-gray-400">{address}</p>
              <p className="text-gray-500 text-sm">{details}</p>
            </div>

            {/*  Price & CTA */}
            <div className="flex flex-col items-end gap-4">
              <div className="text-4xl font-bold text-teal-400 tracking-tight">
                {price}
              </div>

              <div className="flex flex-wrap justify-end gap-4">
                <button
                  onClick={() => setContactModal(true)}
                  className="border border-white text-white px-6 py-3 rounded-lg font-medium backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300 shadow-md hover:shadow-white/30"
                >
                  Get in Touch
                </button>
                <button
                  onClick={() => setTourModal(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-6 py-3 rounded-lg font-medium shadow-lg shadow-orange-600/30 hover:shadow-red-500/40 transition-all duration-300"
                >
                  Schedule a Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESCRIPTION SECTION */}
      <section className="relative bg-gradient-to-br from-[#fafbff] via-[#f5f6fa] to-[#eef1f7] text-gray-900 py-24 px-6 md:px-20 overflow-hidden">
        {/* Ambient Background Light Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-[-100px] w-[400px] h-[400px] bg-indigo-300/10 rounded-full blur-[140px]"></div>
          <div className="absolute bottom-[-120px] right-[-80px] w-[500px] h-[500px] bg-purple-300/10 rounded-full blur-[160px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* LEFT SIDE */}
          <div className="md:col-span-2 flex flex-col gap-10">
            {/*  Description Card */}
            <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-[0_8px_35px_rgba(0,0,0,0.05)] p-8 transition-all duration-500 hover:shadow-[0_8px_45px_rgba(0,0,0,0.08)] hover:translate-y-[-2px]">
              <h2 className="text-3xl font-semibold text-gray-800 mb-4 tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
                Public Remarks
              </h2>
              <p className="text-gray-700 leading-relaxed text-[17px] whitespace-pre-line tracking-wide">
                {description}
              </p>
            </div>

            {/*  Property Details */}
            <div className="bg-gradient-to-br from-white to-[#f9fafc] rounded-3xl p-8 border border-gray-200 shadow-[0_6px_30px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:translate-y-[-2px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800 tracking-tight">
                  Property Details
                </h3>
                <div className="w-14 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-12">
                {[
                  { label: "Property Type", key: "type" },
                  { label: "Bedrooms", key: "bedrooms" },
                  { label: "Bathrooms", key: "bathrooms" },
                  { label: "Exterior Stories", key: "stories" },
                  { label: "Total Area (sq.ft)", key: "area" },
                  { label: "Pool", key: "pool" },
                ].map((item, index) => (
                  <div
                    key={item.key}
                    className={`${
                      index % 2 === 0 ? "animate-fadeInUp" : "animate-fadeIn"
                    } transition-transform duration-300`}
                  >
                    <p className="text-gray-500 text-sm font-medium tracking-wide">
                      {item.label}
                    </p>
                    <p className="font-semibold text-[15px] mt-1 text-gray-800">
                      {property_details[item.key] || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/*  RIGHT SIDE: Contact Card */}
          <div className="relative bg-white/90 backdrop-blur-md border border-gray-200 rounded-3xl shadow-[0_8px_35px_rgba(0,0,0,0.05)] p-10 flex flex-col items-center text-center hover:shadow-[0_8px_45px_rgba(0,0,0,0.08)] hover:translate-y-[-2px] transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-3xl"></div>

            <h3 className="text-2xl font-semibold mb-5 text-gray-900">
              Request More Information
            </h3>

            <p className="text-gray-600 text-sm mb-3 text-left w-full font-medium">
              Message
            </p>

            <textarea
              readOnly
              value={`"Please send me more information about this property."`}
              className="w-full border border-gray-300 p-3 rounded-xl text-sm mb-6 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 shadow-inner transition-all"
            />

            <button className="w-full py-3 font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300">
              Request Info
            </button>

            {/* Divider */}
            <div className="flex items-center justify-center gap-4 my-8">
              <div className="flex-1 h-[1px] bg-gray-300"></div>
              <p className="text-gray-500 text-sm font-medium">OR</p>
              <div className="flex-1 h-[1px] bg-gray-300"></div>
            </div>

            {/* Agent Info */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src="https://static.wixstatic.com/media/a94025_3332239ee13049cd8e6c796b043e78a9~mv2.jpg/v1/crop/x_296,y_0,w_1292,h_1325/fill/w_88,h_91,fp_0.50_0.50,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Michael-2_edited.jpg"
                  alt="Agent"
                  className="w-[95px] h-[95px] rounded-full object-cover shadow-lg border-2 border-white"
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="mt-4">
                <p className="font-semibold text-[16px] text-gray-900">
                  Michael Karabatsos
                </p>
                <p className="text-gray-600 text-lg font-medium mt-1">
                  (602) 892 - 4939
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS SECTION */}
      <section className="relative bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white py-24 px-6 md:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Vertical Title */}
          <div className="hidden md:flex md:col-span-1 justify-center items-center relative">
            <h2 className="text-[70px] font-serif rotate-[-90deg] whitespace-nowrap tracking-widest text-white-800/70 select-none">
              Highlights
            </h2>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1px] bg-gradient-to-b from-gray-600/30 via-gray-700/60 to-transparent"></div>
          </div>

          {/* Image/Video */}
          <div className="md:col-span-6 relative flex justify-center">
            <div className="relative w-full group">
              {highlights_image ? (
                highlights_image.endsWith(".mp4") ||
                highlights_image.endsWith(".mov") ||
                highlights_image.endsWith(".webm") ? (
                  <video
                    src={highlights_image}
                    controls
                    className="rounded-2xl shadow-2xl w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <img
                    src={highlights_image}
                    alt="Highlights Media"
                    className="rounded-2xl shadow-2xl w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                )
              ) : property_images.img1 ? (
                <img
                  src={property_images.img1}
                  alt="Highlights"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="w-full h-[520px] flex items-center justify-center border-2 border-dashed border-gray-600 rounded-2xl">
                  <span className="text-gray-400 text-sm">No highlight media</span>
                </div>
              )}
            </div>
          </div>

          {/* Highlights Text Content */}
          <div className="md:col-span-5 space-y-10 md:pl-10">
            {highlights.map((item, index) => (
              <div
                key={item.id}
                className="flex gap-6 items-start group transition-all duration-300 hover:translate-x-1"
              >
                <h3 className="text-5xl font-serif text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
                  {String(index + 1).padStart(2, "0")}
                </h3>
                <div className="space-y-1">
                  <h4 className="font-bold text-xl mb-1 text-white tracking-wide group-hover:text-gray-200 transition">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-[15px] leading-relaxed max-w-md">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Background Accent */}
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-gradient-to-t from-gray-600/20 to-transparent rounded-full blur-3xl opacity-30 pointer-events-none"></div>
      </section>

      {/* PROPERTY DETAILS TABLE SECTION */}
      <section className="relative bg-gradient-to-b from-gray-50 via-white to-gray-100 py-28 px-6 md:px-20 text-black overflow-hidden">
        {/* Subtle ambient gradient glow */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-30%] right-[-10%] w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[150px]"></div>

        <div className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.08)] border border-gray-200/80 backdrop-blur-md bg-white/90">
          {/* Section Header */}
          <div className="text-center py-12 border-b border-gray-200">
            <h2 className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent tracking-tight">
              Property Specifications
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              Detailed overview of property features, structure, and financing.
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            
            {/*  Column 1 — Features */}
            <div className="p-10 bg-gradient-to-b from-white via-gray-50 to-gray-100 hover:shadow-lg transition-all duration-300 rounded-none">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800 tracking-tight border-b border-gray-200 pb-3">
                Features
              </h3>
              <div className="space-y-4">
                {Object.entries(editable_details).map(([key, val]) => (
                  <div key={key} className="group">
                    <p className="text-gray-500 text-sm font-medium">{key}</p>
                    <p className="font-semibold text-[15px] mt-1 text-gray-800 group-hover:text-violet-600 transition-colors duration-200">
                      {val || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/*  Column 2 — Room Details */}
            <div className="p-10 bg-gradient-to-b from-white via-gray-50 to-gray-100 hover:shadow-lg transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800 tracking-tight border-b border-gray-200 pb-3">
                Room Details
              </h3>
              <div className="space-y-4">
                {Object.entries(room).map(([key, val]) => (
                  <div key={key} className="group">
                    <p className="text-gray-500 text-sm font-medium">{key}</p>
                    <p className="font-semibold text-[15px] mt-1 text-gray-800 group-hover:text-violet-600 transition-colors duration-200">
                      {val || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/*  Column 3 — Construction & Utilities */}
            <div className="p-10 bg-gradient-to-b from-white via-gray-50 to-gray-100 hover:shadow-lg transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800 tracking-tight border-b border-gray-200 pb-3">
                Construction & Utilities
              </h3>
              <div className="space-y-4">
                {Object.entries(construction || {}).map(([key, val]) => (
                  <div key={key} className="group">
                    <p className="text-gray-500 text-sm font-medium">{key}</p>
                    <p className="font-semibold text-[15px] mt-1 text-gray-800 group-hover:text-violet-600 transition-colors duration-200">
                      {val || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/*  Column 4 — Tax & Financing */}
            <div className="p-10 bg-gradient-to-b from-white via-gray-50 to-gray-100 hover:shadow-lg transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800 tracking-tight border-b border-gray-200 pb-3">
                County, Tax & Financing
              </h3>
              <div className="space-y-4">
                {Object.entries(tax || {}).map(([key, val]) => (
                  <div key={key} className="group">
                    <p className="text-gray-500 text-sm font-medium">{key}</p>
                    <p className="font-semibold text-[15px] mt-1 text-gray-800 group-hover:text-violet-600 transition-colors duration-200">
                      {val || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEIGHBORHOOD SECTION */}
      <section className="relative bg-gradient-to-b from-white via-gray-50 to-gray-100 text-black py-28 px-6 md:px-20 transition-all duration-500 overflow-hidden">
        {/*  Ambient Background Glow */}
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-violet-200/30 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[450px] h-[450px] bg-indigo-200/30 blur-[130px] rounded-full"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center z-10">
          {/*  Section Title */}
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
            Know Your Neighborhood
          </h2>
          <p className="text-gray-500 text-lg mb-14">
            Explore insights about the surrounding community, schools, and location details.
          </p>

          {/*  Tabs */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-14 border-b border-gray-300 pb-5">
            {editable_tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative text-lg font-semibold transition-all duration-300 pb-2 px-2 group ${
                  activeTab === tab.id
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.title}
                {activeTab === tab.id && (
                  <span className="absolute left-0 bottom-[-2px] w-full h-[3px] rounded-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 transition-all duration-500"></span>
                )}
              </button>
            ))}
          </div>

          {/*  Tab Content */}
          <div className="mt-14 text-left md:text-center max-w-3xl mx-auto">
            <div className="relative bg-white/70 border border-gray-200 backdrop-blur-md rounded-2xl p-8 text-gray-700 text-[17px] leading-relaxed shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 rounded-t-2xl"></div>
              {editable_tabs.find((t) => t.id === activeTab)?.content || (
                <p className="text-gray-400 italic">No content available for this tab.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="relative bg-gradient-to-b from-gray-100 via-white to-gray-100 py-24 px-6 md:px-20 flex flex-col items-center text-center">
        {/* Map Container */}
        <div className="relative w-full max-w-6xl h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 hover:shadow-gray-400/50 transition-all duration-500 ease-out group">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-gray-200 opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          {/* Map */}
          <iframe
            title="Google Map - Phoenix Home Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.9336157845593!2d-111.97169472363773!3d33.46626617338757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b0a50a66b13e3%3A0x4cb41dc8cfe9a6b5!2s4714%20E%20Lewis%20Ave%2C%20Phoenix%2C%20AZ%2085008!5e0!3m2!1sen!2sin!4v1715727155651!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="group-hover:scale-[1.03] transition-transform duration-700 ease-in-out"
          ></iframe>
        </div>
        {/* Optional Contact CTA under map */}
        <div className="mt-10 text-gray-600 text-sm">
          <p>
            📍 {address} &nbsp;|&nbsp;
            <a
              href="https://goo.gl/maps/dh6ix6x7U3S2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-200"
            >
              Open in Google Maps
            </a>
          </p>
        </div>
      </section>

      {/* AGENT SECTION */}
      <section className="bg-gradient-to-b from-black via-gray-900 to-black text-white py-24 px-6 md:px-20 transition-all duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* LEFT: Agent Image */}
          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#ffffff1a] to-transparent rounded-3xl blur-3xl opacity-30"></div>
            <img
              src="https://static.wixstatic.com/media/a94025_22da67a870ca42bc8d913704b296b788~mv2.png/v1/fill/w_1070,h_836,fp_0.48_0.22,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Michael-2_heic.png"
              alt="Michael Karabatsos"
              className="w-full max-w-lg rounded-2xl shadow-2xl object-cover z-10 hover:scale-[1.03] transition-transform duration-300"
            />
          </div>
          {/* RIGHT: Text Section */}
          <div className="space-y-7 z-20">
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Your Trusted Guide in Arizona's Elite Real Estate Market
            </h2>
            <p className="text-gray-300 leading-relaxed text-[17px] tracking-wide">
              At AZ Signature Homes, we don't just sell real estate—we deliver
              exceptional outcomes. Whether you're buying, selling, or relocating, we
              offer a high-touch, high-performance experience rooted in market
              expertise, smart technology, and personalized service.
            </p>
            <p className="text-gray-400 text-[16px] italic">
              Serving <b>Scottsdale, Paradise Valley, Phoenix, Fountain Hills</b> and
              other regions of Arizona.
            </p>
            {/* Divider */}
            <div className="border-t border-gray-600 w-full my-8 opacity-50"></div>
            {/* Agent Info */}
            <div>
              <p className="text-xl font-semibold tracking-wide">Michael Karabatsos</p>
              <p className="text-gray-400 text-sm uppercase tracking-wider">
                Founder of Arizona Signature Homes
              </p>
            </div>
            {/* Social Icons */}
            <div className="flex gap-6 mt-5">
              {[
                {
                  href: "https://www.instagram.com/azsignaturehomes/",
                  src: "https://static.wixstatic.com/media/11062b_603340b7bcb14e7785c7b65b233cd9f9~mv2.png/v1/fill/w_43,h_43,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_603340b7bcb14e7785c7b65b233cd9f9~mv2.png",
                  alt: "Instagram",
                },
                {
                  href: "https://www.facebook.com/profile.php?id=61555614735183",
                  src: "https://static.wixstatic.com/media/11062b_f4e3e7f537ff4762a1914aa14e3e36b9~mv2.png/v1/fill/w_88,h_88,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_f4e3e7f537ff4762a1914aa14e3e36b9~mv2.png",
                  alt: "Facebook",
                },
                {
                  href: "https://www.youtube.com/@azsignaturehomes",
                  src: "https://static.wixstatic.com/media/11062b_c67939a99eaf442d95d3f851857ceedf~mv2.png/v1/fill/w_88,h_88,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_c67939a99eaf442d95d3f851857ceedf~mv2.png",
                  alt: "YouTube",
                },
                {
                  href: "https://www.tiktok.com/@azsignaturehomes?_t=ZP-8x8VokuruLH&_r=1",
                  src: "https://static.wixstatic.com/media/11062b_7edd292d29b34c309100535a26dc5033~mv2.png/v1/fill/w_88,h_88,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_7edd292d29b34c309100535a26dc5033~mv2.png",
                  alt: "TikTok",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform transform hover:scale-125 duration-300"
                >
                  <img
                    src={social.src}
                    alt={social.alt}
                    className="w-9 h-9 rounded-full shadow-lg hover:shadow-white/30 transition-shadow duration-300"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SIGNATURE ADVANTAGE SECTION */}
      <section className="bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white py-24 px-6 md:px-16 text-center">
        <div className="max-w-6xl mx-auto space-y-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 tracking-wide bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Our Signature Advantage
            </h2>
            <p className="text-gray-300 text-[17px] leading-relaxed max-w-2xl mx-auto">
              We go beyond listings. Here's how we make your journey seamless and successful.
            </p>
          </div>

          {/* 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            {[
              {
                title: "Discovery & Customization",
                text: "We take time to understand your vision—whether you're a first-time buyer or looking to sell a legacy estate. Every recommendation is curated to your lifestyle and goals.",
              },
              {
                title: "Exclusive Market Access",
                text: "Get access to pre-market listings and private opportunities in Arizona's most desirable neighborhoods — giving you the first-mover advantage in a fast-moving market.",
              },
              {
                title: "Skilled Negotiation",
                text: "With deep market insight and proven tactics, we negotiate every deal to protect your best interest — whether you're buying your dream home or selling at the right price.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-[#111111] hover:bg-[#181818] rounded-2xl p-8 shadow-xl hover:shadow-gray-800/50 transition-all duration-300"
              >
                <div className="border-t-2 border-gray-600 w-3/4 mb-6 group-hover:w-full transition-all duration-500"></div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-gray-100">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-[15px] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-gray-400 text-center py-10 text-sm border-t border-gray-800">
        <div className="space-x-6 mb-4">
          <a href="#" className="hover:underline">
            Accessibility Statement
          </a>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms & Conditions
          </a>
        </div>

        <p className="text-gray-500 text-[13px]">
          © {new Date().getFullYear()} by Arizona Signature Homes. Custom Websites Designed by Rickey Singh.
        </p>
      </footer>
    </div>
  );
}