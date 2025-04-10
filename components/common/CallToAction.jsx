// components/common/CallToAction.jsx
import Link from 'next/link';

const CallToAction = ({ text, buttonText, href, onClick }) => {
  return (
    <div className="bg-white bg-opacity-10 p-6 rounded-lg flex flex-col md:flex-row items-center justify-between">
      <p className="text-lg text-white mb-4 md:mb-0">{text}</p>
      {href ? (
        <Link href={href}>
          <a className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-colors">
            {buttonText}
          </a>
        </Link>
      ) : (
        <button
          onClick={onClick}
          className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-colors"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default CallToAction;
