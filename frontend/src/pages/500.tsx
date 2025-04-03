import Link from 'next/link';

export default function ServerError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">500 - Server Error</h1>
        <p className="text-gray-600 mb-4">
          Something went wrong on our end. Please try again later.
        </p>
        <Link
          href="/"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
} 