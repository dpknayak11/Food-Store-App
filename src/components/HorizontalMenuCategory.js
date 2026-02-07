// "use client";
// import { useState, useMemo } from "react";
// import Stack from "react-bootstrap/Stack";
// import Button from "react-bootstrap/Button";

// function HorizontalMenuCategory({ data = [], onCategorySelect, selectedCategory }) {
//   const [showAll, setShowAll] = useState(false);

//   // 🔥 Make categories unique
//   const uniqueCategories = useMemo(() => {
//     const seen = new Set();
//     return data.filter(item => {
//       if (seen.has(item.category)) return false;
//       seen.add(item.category);
//       return true;
//     });
//   }, [data]);

//   const categories = showAll ? uniqueCategories : uniqueCategories.slice(0, 6);
// console.log("categories",categories);

//   return (
//     <div className="container my-4">
//       <Stack
//         direction="horizontal"
//         gap={2}
//         className="flex-wrap justify-content-center"
//       >
//         {categories.map((item, index) => (
//           <div
//             key={index}
//             className={`category-item ${
//               selectedCategory === item.category ? "active" : ""
//             }`}
//             onClick={() => onCategorySelect?.(item.category)}
//           >
//             {item.category}
//           </div>
//         ))}

//         {uniqueCategories.length > 6 && (
//           <Button
//             variant="outline-primary"
//             onClick={() => setShowAll(!showAll)}
//             className="ms-2"
//           >
//             {showAll ? "➖ Less" : "➕ More"}
//           </Button>
//         )}
//       </Stack>

//       {selectedCategory && (
//         <Button
//           size="sm"
//           variant="outline-info"
//           onClick={() => onCategorySelect("")}
//           className="mt-3"
//         >
//           ✕ Clear Filter
//         </Button>
//       )}
//     </div>
//   );
// }

// export default HorizontalMenuCategory;


"use client";
import { useState, useMemo } from "react";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";

// 🍽️ Smart Icon Finder
const getCategoryIcon = (category = "") => {
  const name = category.toUpperCase();

  if (name.includes("BURGER")) return "🍔";
  if (name.includes("PIZZA")) return "🍕";
  if (name.includes("DRINK")) return "🥤";
  if (name.includes("DESSERT") || name.includes("SWEET")) return "🍰";
  if (name.includes("BIRYANI") || name.includes("RICE")) return "🍛";
  if (name.includes("CHINESE") || name.includes("NOODLE")) return "🥡";
  if (name.includes("FRIES") || name.includes("SNACK")) return "🍟";
  if (name.includes("PASTA")) return "🍝";
  if (name.includes("SANDWICH") || name.includes("WRAP")) return "🥪";

  return "🍽️"; // default
};

function HorizontalMenuCategory({ data = [], onCategorySelect, selectedCategory }) {
  const [showAll, setShowAll] = useState(false);

  const uniqueCategories = useMemo(() => {
    const seen = new Set();
    return data.filter((item) => {
      const cat = item.category?.toUpperCase();
      if (seen.has(cat)) return false;
      seen.add(cat);
      return true;
    });
  }, [data]);

  const categories = showAll ? uniqueCategories : uniqueCategories.slice(0, 6);

  return (
    <div className="container my-4">
      <Stack direction="horizontal" gap={2} className="flex-wrap justify-content-center">
        {categories.map((item, index) => {
          const isActive = selectedCategory === item.category;
          const icon = getCategoryIcon(item.category);

          return (
            <div
              key={index}
              onClick={() => onCategorySelect?.(item.category)}
              style={{
                cursor: "pointer",
                padding: "8px 14px",
                borderRadius: "30px",
                background: isActive ? "#e23744" : "#fff",
                color: isActive ? "#fff" : "#e23744",
                border: "1px solid #e23744",
                minWidth: "85px",
                textAlign: "center",
                boxShadow: isActive ? "0 4px 10px rgba(226,55,68,0.3)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ fontSize: "18px" }}>{icon}</div>
              <div style={{ fontSize: "11px", marginTop: "2px", fontWeight: 500 }}>
                {item.category}
              </div>
            </div>
          );
        })}

        {uniqueCategories.length > 6 && (
          <Button
            variant="outline-danger"
            onClick={() => setShowAll(!showAll)}
            className="ms-2 rounded-pill"
            size="sm"
          >
            {showAll ? "Less" : "More"}
          </Button>
        )}
      </Stack>

      {selectedCategory && (
        <div className="text-center">
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => onCategorySelect("")}
            className="mt-3 rounded-pill"
          >
            Clear Filter
          </Button>
        </div>
      )}
    </div>
  );
}

export default HorizontalMenuCategory;
