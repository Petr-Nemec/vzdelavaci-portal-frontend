// components/common/LoadingSpinner.jsx
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
