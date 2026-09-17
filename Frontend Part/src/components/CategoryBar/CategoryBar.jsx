const categories = [
  "All",
  "Music",
  "Gaming",
  "React",
  "Programming",
  "Live",
  "AI",
  "News",
];

function CategoryBar({ selectedCategory, setSelectedCategory }) {
  return (
    <div className="sticky top-16 z-20 bg-white dark:bg-gray-950 py-2 md:py-4 mb-4 md:mb-6">
     <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-3 scrollbar-hide">
        {categories.map((category) => (
       <button
         key={category}
         onClick={() => setSelectedCategory(category)}
         className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
          selectedCategory === category
           ? "bg-black text-white dark:bg-white dark:text-black"
           : "bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          }`}
        >
          {category}
        </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryBar;