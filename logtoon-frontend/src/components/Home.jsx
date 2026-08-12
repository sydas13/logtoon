import { useEffect, useState } from "react";
import FilterSidebar from "./FilterSidebar";
import PostCard from "./PostCard";
import { usePostRelated } from "./PostRelatedContext";

const initialFilterParams = {
  cuisines: [],
  categories: [],
  tags: [],
  minimumRating: 0,
  page: 0,
  size: 5,
  sort: "newest",
  sortBy: "createdAt",
  sortDirection: "desc",
};

export default function Home() {
  const { getFilteredPosts } = usePostRelated();
  const [posts, setPosts] = useState(null);
  const [filterParams, setFilterParams] = useState(initialFilterParams);

  useEffect(() => {
    const loadInitialafailteredPosts = async () => {
      const data = await getFilteredPosts(filterParams);
      setPosts(data.content);
      console.log(data.content);
    };

    loadInitialafailteredPosts();
  }, []);

  const resetFilters = () => {
    setFilterParams(initialFilterParams);
  };

  const loadFilteredPosts = async () => {
    const data = await getFilteredPosts(filterParams);
    setPosts(data.content);
  };

  return (
    <div className="flex gap-6 ">
      <FilterSidebar
        filterParams={filterParams}
        setFilterParams={setFilterParams}
        resetFilters={resetFilters}
        handleFilter={loadFilteredPosts}
      />
      <div className="">
        {!posts ? (
          "loading"
        ) : (
          <div className="grid grid-cols-1 gap-4 px-4 sm:px-8 md:px-16 lg:px-20 pb-8 md:grid-cols-2">
            {posts.map((post) => (
              <div key={post.id} className="break-inside-avoid">
                <PostCard post={post} key={post.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
