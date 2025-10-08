import { useState, useEffect, useMemo } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, RefreshCw, AlertCircle } from "lucide-react";
import ConnectedAccounts from "./ConnectedAccounts";
import GoogleSignInButton from "./GoogleSignInButton";

const localizer = momentLocalizer(moment);

const API_URL = "http://localhost:3000";
export default function CalendarView() {
  const entityId = "default_user";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(
        "[CalendarView] Fetching events with connectedAccountId:",
        connectedAccountId
      );

      const response = await fetch(
        `${API_URL}/api/calendar/events?entityId=${entityId}&connectedAccountId=${connectedAccountId}`
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
    console.log("%c Line:53 🍔 connections", "color:#4fff4B", connections);
    console.log(
      "%c Line:53 🍯 connectedAccountId",
      "color:#7f2b82",
      connectedAccountId
    );
    setIsConnected(connections[0]?.id);
    setConnectedAccountId(connections[0]?.id);

    if (!connectedAccountId) {
      setEvents([]);
    }
  };

  // Fetch events when connectedAccountId changes
  useEffect(() => {
    if (connectedAccountId) {
      fetchEvents();
    }
  }, [connectedAccountId]);

  // Transform Google Calendar events to react-big-calendar format
  const calendarEvents = useMemo(() => {
    return events.map((event) => {
      console.log("%c Line:76 🧀 event", "color:#42b983", event);
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
                  Your Calendar
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
                      console.log(
                        "%c Line:196 🍋 event",
                        "color:#7f2b82",
                        event
                      );
                      if (event?.resource?.htmlLink) {
                        window.open(event?.resource?.htmlLink, "_blank");
                      }
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
