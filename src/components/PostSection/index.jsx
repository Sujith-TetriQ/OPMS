import CreatePost from "@components/CreatePost";
import RecentPost from "@components/RecentPost";

const PostSection = ({ recentPosts }) => {
  return (
     <div className="row">
      {/* CreatePost */}
      <div className="col-12 mb-3">
        <div className="card createPostCard">
          <CreatePost />
        </div>
      </div>

      {/* RecentPost */}
      <div className="col-12">
        <div className="card recentPost-cardContainer">
          <RecentPost recentPosts={recentPosts} />
        </div>
      </div>
    </div>
  );
};

export default PostSection;
