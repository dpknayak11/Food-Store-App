"use client";
import Navbar from "@/components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";
import { httpPost } from "@/services/api";
import { toast } from "react-toastify";
import { setMenu } from "@/redux/slices/menuSlice";
import { useEffect, useState, useRef } from "react";
import HorizontalMenuCategory from "@/components/HorizontalMenuCategory";
import ItemCard from "@/components/ItemCard";
import { Button } from "react-bootstrap";
import GrowSpinner from "@/components/GrowSpinner";
import Prodect from "../../public/Prodect/item.json";


export default function Home() {
  // const dispatch = useDispatch();
  // const { menu, loading } = useSelector((state) => state.menu);
  // const cart = useSelector((state) => state.cart?.items);

  // const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  // const fetchRef = useRef(false);
  // console.log("Prodect",Prodect);
  
  const onCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  // console.log("loading", loading);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 10); // 10 milliseconds

    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) {
    return <GrowSpinner loading={pageLoading} />;
  }

  let filteredMenu =
    selectedCategory !== ""
      ? Prodect.filter((item) => item.category === selectedCategory)
      : Prodect;

  return (
    <>
      <Navbar />
      <div
        className="w-100 "
        style={{ maxHeight: "400px", overflow: "hidden", borderRadius: "12px" }}
      >
        <video
          src="/videos/food.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-100"
          style={{ objectFit: "cover", maxHeight: "400px" }}
        />
      </div>

      <div className="container mt-2">
        <div className="mb-4">
          <h2 className="mb-3">🍽️ Explore Menu</h2>
          {Prodect?.length > 0 && (
            <HorizontalMenuCategory
              data={Prodect}
              onCategorySelect={onCategorySelect}
              selectedCategory={selectedCategory}
            />
          )}
        </div>

        {selectedCategory && (
          <div className="mb-3">
            <p className="text-muted">
              Showing items from <strong>{selectedCategory}</strong>
            </p>
          </div>
        )}

        <ItemCard data={filteredMenu} onMenuItemSelect={onCategorySelect} />
      </div>
    </>
  );
}
