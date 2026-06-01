#!/bin/bash
echo "Starting LeatherCraft backend..."
cd /home/user/ecommerce/backend
npm run dev &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID) on http://localhost:5000"

echo "Starting LeatherCraft frontend..."
cd /home/user/ecommerce/frontend
npm run dev &
FRONTEND_PID=$!
echo "Frontend started (PID: $FRONTEND_PID) on http://localhost:5173"

echo ""
echo "LeatherCraft is running!"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:5000"
echo ""
echo "Test accounts:"
echo "  Admin: admin@leathergoods.com / admin123"
echo "  User:  john@example.com / user1234"
echo ""
echo "Press Ctrl+C to stop both servers"

wait $BACKEND_PID $FRONTEND_PID
