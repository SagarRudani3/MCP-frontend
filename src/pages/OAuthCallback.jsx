import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const connected = searchParams.get('connected');
    const error = searchParams.get('error');

    console.log('[OAuthCallback] Connected:', connected);
    console.log('[OAuthCallback] Error:', error);

    if (error) {
      setStatus('error');
      setTimeout(() => {
        navigate('/');
      }, 5000);
    } else if (connected === 'true') {
      setStatus('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setStatus('error');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <RefreshCw className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Completing Authentication...
            </h1>
            <p className="text-gray-600">
              Please wait while we connect your Google account
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Successfully Connected!
            </h1>
            <p className="text-gray-600 mb-4">
              Your Google Calendar has been connected successfully
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Connection Failed
            </h1>
            <p className="text-gray-600 mb-4">
              {searchParams.get('error') || 'Something went wrong during authentication'}
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to home page...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
