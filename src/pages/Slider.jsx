import React, { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Spinner from '../components/Spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import { useNavigate } from "react-router";

export default function Slider() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function getListings() {
            const listingRef = collection(db, "listings");
            const q = query(listingRef, orderBy("time", "desc"), limit(5));
            const docSnap = await getDocs(q);
            let listings = [];
            docSnap.forEach((doc) => {
                listings.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });
            setListings(listings);
            setLoading(false);
        }
        getListings();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    // Skip the first two listings
    const listingsToShow = listings.slice(4);

    return (
        listingsToShow && (
            <>
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, Autoplay]}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                >
                    {listingsToShow.map(({ data, id }) => (
                        <SwiperSlide key={id}>
                            <div style={{ background: `url(${data.imgUrl[0]}) center, no-repeat`, backgroundSize: "cover" }}
                                className="w-full h-[300px] overflow-hidden relative">
                            </div>
                            <p className="text-white absolute left-1 top-3 bg-[#457b9d] rounded-br-3xl p-2">{data.name}</p>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </>
        )
    );
}
