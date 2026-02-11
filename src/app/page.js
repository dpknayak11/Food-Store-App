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

export default function Home() {
  const dispatch = useDispatch();
  const { menu, loading } = useSelector((state) => state.menu);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const fetchRef = useRef(false);

  const onCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  // console.log("loading", loading);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await httpPost("/menu");
      if (!res.error) {
        dispatch(setMenu(res.data));
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!fetchRef.current && menu?.length === 0) {
      fetchRef.current = true;
      handleSubmit();
    }
  }, []);
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
      ? menu.filter((item) => item.category === selectedCategory)
      : menu;

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
          {menu?.length > 0 && (
            <HorizontalMenuCategory
              data={menu}
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
