import { useState, useEffect } from 'react';
import { RefreshCw, Trash2, CheckCircle, XCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ConnectedAccounts({ entityId = 'default_user', onConnectionChange }) {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [disconnecting, setDisconnecting] = useState(null);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[ConnectedAccounts] Fetching connections...');

      const response = await fetch(
        `${API_URL}/api/composio/connectedAccounts?entityId=${entityId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch connections');
      }

      const data = await response.json();
      console.log('[ConnectedAccounts] Connections:', data.connections);

      setConnections(data.connections || []);

      if (onConnectionChange) {
        onConnectionChange(data.connections || []);
      }
    } catch (err) {
      console.error('[ConnectedAccounts] Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (connectionId) => {
    if (!confirm('Are you sure you want to disconnect this account?')) {
      return;
    }

    try {
      setDisconnecting(connectionId);

      console.log('[ConnectedAccounts] Disconnecting:', connectionId);

      const response = await fetch(
        `${API_URL}/api/composio/disconnect?entityId=${entityId}&connectionId=${connectionId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to disconnect account');
      }

      console.log('[ConnectedAccounts] Disconnected successfully');
      await fetchConnections();
    } catch (err) {
      console.error('[ConnectedAccounts] Error disconnecting:', err);
      alert(`Failed to disconnect: ${err.message}`);
    } finally {
      setDisconnecting(null);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [entityId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Connected Accounts</h2>
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading connections...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Connected Accounts</h2>
        <button
          onClick={fetchConnections}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">
          Error: {error}
        </div>
      )}

      {connections.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No connected accounts</p>
          <p className="text-sm mt-2">Sign in with Google to connect your calendar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {connection.appName || 'Google Calendar'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {connection.status === 'ACTIVE' ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-600">
                          {connection.status || 'Inactive'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDisconnect(connection.id)}
                disabled={disconnecting === connection.id}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {disconnecting === connection.id ? 'Disconnecting...' : 'Disconnect'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
