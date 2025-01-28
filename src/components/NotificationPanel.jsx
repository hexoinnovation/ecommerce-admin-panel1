import React, { useState, useEffect } from "react";

function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);

  // Simulate fetching notifications from an API or server
  useEffect(() => {
    const newNotifications = [
      { id: 1, message: "New order received: Order #12345", type: "order" },
      { id: 2, message: "Order #12345 has been shipped.", type: "status" },
      { id: 3, message: "New order received: Order #12346", type: "order" },
    ];
    setNotifications(newNotifications);
  }, []);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-xl font-semibold text-gray-800">Notifications</h3>
      <div className="mt-4">
        {notifications.length === 0 ? (
          <p>No new notifications</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-2 mb-2 rounded ${
                notification.type === "order" ? "bg-blue-100" : "bg-yellow-100"
              }`}
            >
              <p>{notification.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationPanel;

