import { useState } from "react";
import FilterSidebar from "./FilterSidebar";
import PostCard from "./PostCard";

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
  const [posts, setPosts] = useState(null);
  const [filterParams, setFilterParams] = useState(initialFilterParams);

  const resetFilters = () => {
    setFilterParams(initialFilterParams);
  };

  const getPosts = async () => {
    const { sort, ...requestFilterParams } = filterParams;
    requestFilterParams.minimumRating = filterParams.minimumRating * 2;

    const url = new URL("http://localhost:8081/api/logtoon/post/posts");
    url.search = new URLSearchParams(requestFilterParams).toString();

    try {
      const response = await fetch(url);

      const res = await response.json();
      if (response.ok) {
        alert("Sorted by: " + sort);
        setPosts(res.content);
        console.log(res);
      } else throw new Error(res.message + "\n" + " status: " + res.status);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="flex gap-6 ">
      <FilterSidebar
        filterParams={filterParams}
        setFilterParams={setFilterParams}
        resetFilters={resetFilters}
        getPosts={getPosts}
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
