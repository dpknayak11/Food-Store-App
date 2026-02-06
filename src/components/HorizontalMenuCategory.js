"use client";
import { useState, useMemo } from "react";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";

function HorizontalMenuCategory({ data = [], onCategorySelect, selectedCategory }) {
  const [showAll, setShowAll] = useState(false);

  // 🔥 Make categories unique
  const uniqueCategories = useMemo(() => {
    const seen = new Set();
    return data.filter(item => {
      if (seen.has(item.category)) return false;
      seen.add(item.category);
      return true;
    });
  }, [data]);

  const categories = showAll ? uniqueCategories : uniqueCategories.slice(0, 6);

  return (
    <div className="container my-4">
      <Stack
        direction="horizontal"
        gap={2}
        className="flex-wrap justify-content-center"
      >
        {categories.map((item, index) => (
          <div
            key={index}
            className={`category-item ${
              selectedCategory === item.category ? "active" : ""
            }`}
            onClick={() => onCategorySelect?.(item.category)}
          >
            {item.category}
          </div>
        ))}

        {uniqueCategories.length > 6 && (
          <Button
            variant="outline-primary"
            onClick={() => setShowAll(!showAll)}
            className="ms-2"
          >
            {showAll ? "➖ Less" : "➕ More"}
          </Button>
        )}
      </Stack>

      {selectedCategory && (
        <Button
          size="sm"
          variant="outline-info"
          onClick={() => onCategorySelect("")}
          className="mt-3"
        >
          ✕ Clear Filter
        </Button>
      )}
    </div>
  );
}

export default HorizontalMenuCategory;
