import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChannelSubscribers } from "../services/subscriptionService";

function ChannelSubscribers() {
  const { channelId } = useParams();

  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await getChannelSubscribers(channelId);

        setSubscribers(response.data.subscribers);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch subscribers");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [channelId]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-900 dark:text-white">
        Loading subscribers...
      </p>
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
    <div className="max-w-3xl mx-auto px-6 py-8">

      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Subscribers
      </h1>

      {subscribers.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">
          No subscribers yet.
        </p>
      ) : (
        <div className="space-y-4">

          {subscribers.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
            >

              {item.subscriber?.avatar?.url ? (
                <img
                  src={item.subscriber.avatar.url}
                  alt={item.subscriber.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white flex items-center justify-center font-semibold">
                  {item.subscriber?.username?.[0]?.toUpperCase()}
                </div>
              )}

              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {item.subscriber?.fullName}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{item.subscriber?.username}
                </p>
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default ChannelSubscribers;