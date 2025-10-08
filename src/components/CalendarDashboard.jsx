import { useState, useEffect } from "react";
import { Calendar, Clock, RefreshCw, AlertCircle } from "lucide-react";
import ConnectedAccounts from "./ConnectedAccounts";
import GoogleSignInButton from "./GoogleSignInButton";

const API_URL =
  "https://mcp-backend-s0np.onrender.com" || "http://localhost:3000";

export default function CalendarDashboard() {
  const entityId = "default_user";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("[CalendarDashboard] Fetching events...");

      const response = await fetch(
        `${API_URL}/api/calendar/events?entityId=${entityId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch events");
      }

      const data = await response.json();
      console.log("[CalendarDashboard] Events:", data.events);

      setEvents(data.events || []);
    } catch (err) {
      console.error("[CalendarDashboard] Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectionChange = (connections) => {
    const hasActiveConnection = connections.some(
      (conn) =>
        conn.status === "ACTIVE" &&
        conn.appName?.toLowerCase().includes("google")
    );
    setIsConnected(hasActiveConnection);

    if (hasActiveConnection) {
      fetchEvents();
    } else {
      setEvents([]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Calendar className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Google Calendar
            </h1>
          </div>
          <p className="text-gray-600">
            Connect your Google account to view and manage your calendar events
          </p>
        </header>

        <div className="space-y-6">
          <ConnectedAccounts
            entityId={entityId}
            onConnectionChange={handleConnectionChange}
          />

          {!isConnected ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <AlertCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Connect Your Google Account
              </h2>
              <p className="text-gray-600 mb-6">
                Sign in with Google to access your calendar events
              </p>
              <GoogleSignInButton entityId={entityId} />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Upcoming Events
                </h2>
                <button
                  onClick={fetchEvents}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  {loading ? "Loading..." : "Refresh"}
                </button>
              </div>

              {error && (
                <div className="mb-4 text-red-600 bg-red-50 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Error: {error}</span>
                </div>
              )}

              {loading && events.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="ml-3 text-gray-600">Loading events...</span>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-lg font-semibold">No upcoming events</p>
                  <p className="text-sm mt-2">Your calendar is clear!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((event, index) => (
                    <div
                      key={event.id || index}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-16 text-center">
                          <div className="bg-blue-100 rounded-lg p-2">
                            <div className="text-xs font-semibold text-blue-600 uppercase">
                              {
                                formatDate(
                                  event.start?.dateTime || event.start?.date
                                ).split(",")[0]
                              }
                            </div>
                            <div className="text-2xl font-bold text-blue-700">
                              {new Date(
                                event.start?.dateTime || event.start?.date
                              ).getDate()}
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {event.summary || "Untitled Event"}
                          </h3>

                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {event.start?.dateTime
                                ? `${formatTime(event.start.dateTime)}${
                                    event.end?.dateTime
                                      ? ` - ${formatTime(event.end.dateTime)}`
                                      : ""
                                  }`
                                : "All day"}
                            </span>
                          </div>

                          {event.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {event.description}
                            </p>
                          )}

                          {event.location && (
                            <p className="text-sm text-gray-500 mt-1">
                              📍 {event.location}
                            </p>
                          )}

                          {event.htmlLink && (
                            <a
                              href={event.htmlLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
                            >
                              View in Google Calendar →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
