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
  size: 6,
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
    <div className="flex ">
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
          <div className="columns-1 sm:columns-2 lg:columns-3 py-2 px-5 sm:px-3">
            {posts.map((post) => (
              <div key={post.id} className="break-inside-avoid mb-6">
                <PostCard post={post} key={post.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
