import { ClockIcon, CheckCircleIcon, ExclamationCircleIcon, ShoppingCartIcon } from '@heroicons/react/outline';

const activities = [
  {
    id: 1,
    type: 'success',
    title: 'Order completed',
    description: 'Order #1234 has been completed',
    time: '2 min ago',
    icon: CheckCircleIcon,
    iconColor: 'text-green-500',
  },
  {
    id: 2,
    type: 'warning',
    title: 'New order received',
    description: 'New order #1235 from John Doe',
    time: '10 min ago',
    icon: ShoppingCartIcon,
    iconColor: 'text-yellow-500',
  },
  {
    id: 3,
    type: 'error',
    title: 'Payment failed',
    description: 'Payment failed for order #1233',
    time: '25 min ago',
    icon: ExclamationCircleIcon,
    iconColor: 'text-red-500',
  },
  {
    id: 4,
    type: 'info',
    title: 'New user registered',
    description: 'New user Jane Smith registered',
    time: '1 hour ago',
    icon: CheckCircleIcon,
    iconColor: 'text-blue-500',
  },
];

const RecentActivity = () => {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, activityIdx) => {
          const Icon = activity.icon;
          return (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== activities.length - 1 ? (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${activity.iconColor}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {activity.title}{' '}
                        <span className="font-medium text-gray-900 dark:text-white">{activity.description}</span>
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                      <time dateTime={activity.time}>{activity.time}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentActivity;