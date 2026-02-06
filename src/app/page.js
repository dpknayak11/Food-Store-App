"use client";
import Navbar from "@/components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";
import { httpPost } from "@/services/api";
import { toast } from "react-toastify";
import { setMenu } from "@/redux/slices/menuSlice";
import { useEffect, useState } from "react";
import HorizontalMenuCategory from "@/components/HorizontalMenuCategory";
import ItemCard from "@/components/ItemCard";
import { Button } from "react-bootstrap";

export default function Home() {
  const dispatch = useDispatch();
  const menu = useSelector((state) => state.menu?.menu);
  const [selectedCategory, setSelectedCategory] = useState("");

  const onCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSubmit = async () => {
    const res = await httpPost("/menu");
    // console.log("API RES 👉", res);
    if (!res.error) {
      dispatch(setMenu(res.data));
    } else {
      toast.error(res.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (menu?.length > 0) return; // Agar menu already loaded hai to API call mat karo{
    handleSubmit();
  }, []);

  let filteredMenu =
    selectedCategory !== ""
      ? menu.filter((item) => item.category === selectedCategory)
      : menu;
  return (
    <>
      <Navbar />
      {/* https://www.pexels.com/video/a-person-serving-food-5657164/ */}
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
