import { useEffect, useState } from "react";
import { getSubscribedChannels } from "../services/subscriptionService";
import { useNavigate } from "react-router-dom";

function Subscriptions() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await getSubscribedChannels();

        setChannels(response.data.subscribedChannels || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (loading) {
    return (
      <h2 className="text-center text-xl mt-10 text-gray-900 dark:text-white">
        Loading subscriptions...
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
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Subscriptions
      </h1>

      {channels.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          You haven't subscribed to any channels yet.
        </p>
      ) : (
        <div className="space-y-4">
          {channels.map((subscription) => {
            const channel = subscription.channel;

            return (
              <div
                key={subscription._id}
                onClick={() => navigate(`/channel/${channel.username}`)}
                className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                {/* Avatar */}
                {channel.avatar ? (
                  <img
                    src={channel.avatar}
                    alt={channel.username}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white flex items-center justify-center font-bold text-lg">
                    {channel.username?.[0]?.toUpperCase()}
                  </div>
                )}

                {/* Channel information */}
                <div>
                  <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {channel.fullName}
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400">
                    @{channel.username}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Subscriptions;