#!/bin/bash

# Ramay Humour Academy - Development Server Startup
# Starts both frontend and backend servers in parallel

echo "🎭 Starting Ramay Humour Academy..."
echo ""

# Check if backend is already running
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 8000 is already in use. Backend server may already be running."
else
    echo "🔧 Starting Laravel backend on port 8000..."
    cd backend
    php artisan serve &
    BACKEND_PID=$!
    echo "   Backend PID: $BACKEND_PID"
    cd ..
fi

# Check if frontend is already running
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 5173 is already in use. Frontend server may already be running."
else
    echo "📦 Starting Vite frontend on port 5173..."
    npm run dev &
    FRONTEND_PID=$!
    echo "   Frontend PID: $FRONTEND_PID"
fi

echo ""
echo "✅ Servers starting..."
echo ""
echo "🌐 Frontend:  http://localhost:5173"
echo "🔌 Backend:   http://localhost:8000"
echo "📚 API Docs:  http://localhost:8000/api"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for interruption
wait
