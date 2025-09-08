import CreatePost from "@components/CreatePost";
import RecentPost from "@components/RecentPost";

const PostSection = ({ posts, setPosts }) => {
  return (
    <div className="row">
      <div className="col-12 mb-3">
        <div className="card createPostCard">
          <CreatePost setPosts={setPosts} />
        </div>
      </div>

      <div className="col-12">
        <div className="card recentPost-cardContainer">
          <RecentPost posts={posts} setPosts={setPosts} />
        </div>
      </div>
    </div>
  );
};

export default PostSection;

