import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserChannelProfile } from "../services/authService";
import { toggleSubscription } from "../services/subscriptionService";
import { getAllVideos } from "../services/videoService";
import VideoCard from "../components/VideoCard/VideoCard";

function Channel() {
  const { username } = useParams();
  const [subscribed, setSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [subscriptionsCount, setSubscriptionsCount] = useState(0);
  const [videos, setVideos] = useState([]);

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    try {
      const response = await toggleSubscription(channel._id);

      const isNowSubscribed = response.data.subscribed;

      setSubscribed(isNowSubscribed);

      setSubscribersCount((prev) =>
        isNowSubscribed ? prev + 1 : prev - 1
      );
    } catch (err) {
      console.error("Subscription failed:", err);
    }
  };

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const response = await getUserChannelProfile(username);

        setChannel(response.data);

        const videoResponse = await getAllVideos("", response.data._id);
        setVideos(videoResponse);

        setSubscribed(response.data.isSubscribed || false);

        setSubscribersCount(
          response.data.subscribersCount || 0
        );

        setSubscriptionsCount(
          response.data.subscriptionsCount || 0
        );
      } catch (err) {
        console.error(err);
        setError("Failed to fetch channel");
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [username]);

  if (loading) {
    return (
      <h2 className="text-center text-xl mt-10 text-gray-900 dark:text-white">
        Loading channel...
      </h2>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 mt-10">
        {error}
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">

      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full overflow-hidden rounded-b-xl">
        {channel.coverImage ? (
          <img
            src={channel.coverImage}
            alt="Channel cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-800" />
        )}
      </div>

      {/* Channel Info */}
      <div className="px-6">

        <div className="flex items-center gap-5 mt-6">

          {/* Avatar */}
          {channel.avatar ? (
            <img
              src={channel.avatar}
              alt={channel.username}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white flex items-center justify-center text-2xl font-bold">
              {channel.username?.[0]?.toUpperCase()}
            </div>
          )}

          {/* Name */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {channel.fullName}
            </h1>

            <p className="text-gray-600 dark:text-gray-400">
              @{channel.username}
            </p>

            <div className="flex gap-5 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <button
                onClick={() =>
                  navigate(`/channel/${channel._id}/subscribers`)
                }
                className="hover:underline"
              >
                {subscribersCount} subscribers
              </button>

              <button
                onClick={() =>
                  navigate(`/channel/${channel._id}/subscriptions`)
                }
                className="hover:underline"
              >
                {subscriptionsCount} subscriptions
              </button>
            </div>
          </div>

        </div>

        {/* Subscribe Button */}
        <div className="mt-5">

          <button
            onClick={handleSubscribe}
            className={`px-6 py-2 rounded-full font-semibold ${
              subscribed
                ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                : "bg-black text-white dark:bg-white dark:text-black"
            }`}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </button>

        </div>

        {/* Channel Videos */}
        <div className="px-6 mt-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Videos
          </h2>

          {videos.length > 0 ? (
            <div className="grid gap-8 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
              {videos.map((video) => (
                <VideoCard
                  key={video._id}
                  videoId={video._id}
                  title={video.title}
                  channel={video.owner?.username}
                  views={video.views}
                  thumbnail={video.thumbnail?.url}
                  duration={video.duration}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              This channel hasn't uploaded any videos yet.
            </p>
          )}
        </div>

      </div>

    </div>
  );
}

export default Channel;