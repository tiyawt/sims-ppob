import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { fetchBalance } from "../store/balanceSlice";
import UserSummary from "../components/UserSummary";
import BalanceCard from "../components/BalanceCard";
import banner1 from "../assets/Banner 1.png";
import banner2 from "../assets/Banner 2.png";
import banner4 from "../assets/Banner 4.png";
import banner5 from "../assets/Banner 5.png";
import pbbIcon from "../assets/PBB.png";
import listrikIcon from "../assets/Listrik.png";
import voucherGameIcon from "../assets/Game.png";
import kurbanIcon from "../assets/Kurban.png";
import musikIcon from "../assets/Musik.png";
import paketDataIcon from "../assets/Paket Data.png";
import pulsaIcon from "../assets/Pulsa.png";
import televisiIcon from "../assets/Televisi.png";
import pdamIcon from "../assets/PDAM.png";
import pgnIcon from "../assets/PGN.png";
import zakatIcon from "../assets/Zakat.png";
import voucherMakananIcon from "../assets/Voucher Makanan.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Home() {
  const dispatch = useDispatch();
  const { value: balanceState, isLoading: isBalanceLoading } = useSelector(
    (s) => s.balance
  );

  
  const [showBalance, setShowBalance] = useState(false);
  const [banners, setBanners] = useState([]);

  const services = useMemo(
    () => [
      { title: "PBB", icon: pbbIcon },
      { title: "Listrik", icon: listrikIcon },
      { title: "Pulsa", icon: pulsaIcon },
      { title: "PDAM", icon: pdamIcon },
      { title: "PGN", icon: pgnIcon },
      { title: "TV Langganan", icon: televisiIcon },
      { title: "Musik", icon: musikIcon },
      { title: "Voucher Game", icon: voucherGameIcon },
      { title: "Voucher Makanan", icon: voucherMakananIcon },
      { title: "Kurban", icon: kurbanIcon },
      { title: "Zakat", icon: zakatIcon },
      { title: "Paket Data", icon: paketDataIcon },
    ],
    []
  );

  const fallbackBanners = useMemo(
    () => [
      { id: 1, image: banner1 },
      { id: 2, image: banner2 },
      { id: 4, image: banner4 },
      { id: 5, image: banner5 },
    ],
    []
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/banner`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBanners(res.data?.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBanners();
    dispatch(fetchBalance());
  }, [dispatch]);

  const resolvedBanners = banners.length ? banners : fallbackBanners;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        {/* Top row - User info & Balance */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          {/* Left - User Summary */}
          <UserSummary />

          {/* Right - Balance Card */}
          <BalanceCard
            balanceState={balanceState}
            isLoading={isBalanceLoading}
            showBalance={showBalance}
            onToggle={() => setShowBalance((p) => !p)}
            className="col-span-2"
          />
        </div>

        {/* Services Grid */}
        <div className="mb-12">
          <div className="grid grid-cols-12 gap-6">
            {services.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center text-center cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-16 h-16 flex items-center justify-center mb-2">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-gray-700 leading-tight max-w-[70px]">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Promo Banners Section */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Temukan promo menarik
          </h2>

          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            slidesPerView={4.5}
            spaceBetween={20}
            loop={true}
            className="banner-swiper"
          >
            {resolvedBanners.map((banner, idx) => {
              const imgSrc = banner.banner_image || banner.image || banner.url;
              return (
                <SwiperSlide key={banner.id || imgSrc || idx}>
                  <img
                    src={imgSrc}
                    alt={banner.banner_name || "Promo"}
                    className="w-full object-cover rounded-xl"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = banner1;
                    }}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
}