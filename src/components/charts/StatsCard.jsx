import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/outline';

const StatsCard = ({ title, value, change, trend }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        <div className={`ml-2 flex items-center text-sm font-medium ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {trend === 'up' ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : (
            <ArrowDownIcon className="h-4 w-4" />
          )}
          <span className="sr-only">{trend === 'up' ? 'Increased' : 'Decreased'} by</span>
          {change}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;