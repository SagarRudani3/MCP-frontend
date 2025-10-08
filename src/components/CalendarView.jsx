import { useState, useEffect, useMemo } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, RefreshCw, AlertCircle, Filter, X } from "lucide-react";
import ConnectedAccounts from "./ConnectedAccounts";
import GoogleSignInButton from "./GoogleSignInButton";

const localizer = momentLocalizer(moment);

const API_URL =
  "https://mcp-backend-s0np.onrender.com" || "http://localhost:3000";

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState(null);
  const [entityId, setEntityId] = useState("default_user");

  // Filter parameters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxResults, setMaxResults] = useState(50);
  const [showFilters, setShowFilters] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams({
        entityId,
        connectedAccountId,
      });

      if (startDate) {
        params.append("startDate", startDate);
      }
      if (endDate) {
        params.append("endDate", endDate);
      }
      if (maxResults) {
        params.append("maxResults", maxResults.toString());
      }

      const response = await fetch(
        `${API_URL}/api/calendar/events?${params.toString()}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch events");
      }

      const data = await response.json();
      console.log("[CalendarView] Events:", data.events);

      setEvents(data.events || []);
    } catch (err) {
      console.error("[CalendarView] Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectionChange = ({ connections, connectedAccountId }) => {
    console.log(
      "%c Line:70 🍌 connectedAccountId",
      "color:#7f2b82",
      connectedAccountId
    );
    setIsConnected(!!connectedAccountId);
    setConnectedAccountId(connectedAccountId);

    if (!connectedAccountId) {
      setEvents([]);
    }
  };

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/composio/connectedAccounts?entityId=${entityId}`
        );

        console.log("%c Line:88 🍉 response", "color:#ffdd4d", response);
        if (response.ok) {
          const data = await response.json();
          console.log("%c Line:89 🍕 data", "color:#7f2b82", data);
          const connections = data.connections || [];

          setIsConnected(true);
          setConnectedAccountId(connections[0]?.id);
        }
      } catch (err) {
        console.error("[CalendarView] Error checking connection:", err);
      }
    };

    checkConnection();
  }, []);

  // Fetch events when connectedAccountId changes
  useEffect(() => {
    if (connectedAccountId) {
      fetchEvents();
    }
  }, [connectedAccountId]);

  // Transform Google Calendar events to react-big-calendar format
  const calendarEvents = useMemo(() => {
    return events.map((event) => {
      const startDate = event.start?.dateTime || event.start?.date;
      const endDate = event.end?.dateTime || event.end?.date;

      return {
        id: event.id,
        title: event.summary || "Untitled Event",
        start: new Date(startDate),
        end: new Date(endDate),
        allDay: !event.start?.dateTime,
        resource: {
          description: event.description,
          location: event.location,
          htmlLink: event?.hangoutLink || event?.location,
        },
      };
    });
  }, [events]);

  // Custom event style
  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: "#3b82f6",
      borderRadius: "5px",
      opacity: 0.8,
      color: "white",
      border: "0",
      display: "block",
    };
    return { style };
  };

  // Custom event component
  const EventComponent = ({ event }) => (
    <span>
      <strong>{event.title}</strong>
      {event.resource?.location && (
        <div className="text-xs">📍 {event.resource.location}</div>
      )}
    </span>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
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
          {!isConnected ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <AlertCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to Google Calendar
              </h2>
              <p className="text-gray-600 mb-6">
                Sign in with Google to view and manage your calendar events
              </p>
              <GoogleSignInButton entityId={entityId} />
            </div>
          ) : (
            <>
              <ConnectedAccounts
                entityId={entityId}
                onConnectionChange={handleConnectionChange}
              />
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Your Calendar
                  </h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      {showFilters ? (
                        <>
                          <X className="w-4 h-4" />
                          Hide Filters
                        </>
                      ) : (
                        <>
                          <Filter className="w-4 h-4" />
                          Filters
                        </>
                      )}
                    </button>
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
                </div>

                {showFilters && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Filter Events
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Results
                        </label>
                        <input
                          type="number"
                          value={maxResults}
                          onChange={(e) =>
                            setMaxResults(parseInt(e.target.value) || 50)
                          }
                          min="1"
                          max="500"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={fetchEvents}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        Apply Filters
                      </button>
                      <button
                        onClick={() => {
                          setStartDate("");
                          setEndDate("");
                          setMaxResults(50);
                          fetchEvents();
                        }}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-4 text-red-600 bg-red-50 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>Error: {error}</span>
                  </div>
                )}

                {loading && events.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="ml-3 text-gray-600">
                      Loading events...
                    </span>
                  </div>
                ) : (
                  <div className="h-[700px]">
                    <BigCalendar
                      localizer={localizer}
                      events={calendarEvents}
                      startAccessor="start"
                      endAccessor="end"
                      style={{ height: "100%" }}
                      eventPropGetter={eventStyleGetter}
                      components={{
                        event: EventComponent,
                      }}
                      views={["month", "week", "day", "agenda"]}
                      defaultView="month"
                      popup
                      selectable
                      onSelectEvent={(event) => {
                        if (event?.resource?.htmlLink) {
                          window.open(event?.resource?.htmlLink, "_blank");
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
