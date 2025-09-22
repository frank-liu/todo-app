#!/bin/bash

# Web Vitals Monitoring Stack Setup Script
# This script sets up Prometheus + Grafana + Todo App backend for Web Vitals monitoring

set -e

echo "🚀 Setting up Web Vitals Monitoring Stack..."

# Function to start Docker Desktop on macOS
start_docker_desktop() {
    echo "🐳 Starting Docker Desktop..."
    open -a Docker
    
    # Wait for Docker to start (max 90 seconds)
    echo "⏳ Waiting for Docker Desktop to start..."
    local count=0
    while ! docker info > /dev/null 2>&1; do
        if [ $count -ge 90 ]; then
            echo ""
            echo "❌ Docker Desktop failed to start within 90 seconds"
            echo "   Please start Docker Desktop manually and try again"
            echo "   You can start it by:"
            echo "   • Press Cmd+Space, type 'Docker Desktop', press Enter"
            echo "   • Or open Applications folder and double-click Docker Desktop"
            exit 1
        fi
        sleep 3
        count=$((count + 3))
        echo -n "."
    done
    echo ""
    echo "✅ Docker Desktop is now running"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "🔍 Docker is not running. Attempting to start Docker Desktop..."
    start_docker_desktop
else
    echo "✅ Docker is already running"
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Build the backend
echo "🔨 Building Todo App backend..."
cd backend
npm run build
cd ..

# Start the monitoring stack
echo "🐳 Starting Prometheus and Grafana containers..."
docker-compose up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Monitoring stack is running!"
    echo ""
    echo "📊 Services available at:"
    echo "   • Prometheus: http://localhost:9090"
    echo "   • Grafana:    http://localhost:3001 (admin/admin)"
    echo "   • Todo App:   http://localhost:3000 (when frontend is running)"
    echo ""
    echo "🎯 Next steps:"
    echo "   1. Start the Todo App backend: cd backend && npm start"
    echo "   2. Start the Todo App frontend: npm start"
    echo "   3. Open Grafana at http://localhost:3001"
    echo "   4. View the pre-configured Web Vitals dashboard"
    echo ""
    echo "🔍 To verify Prometheus is scraping metrics:"
    echo "   • Open http://localhost:9090"
    echo "   • Go to Status > Targets"
    echo "   • Check that 'todo-app-backend' target is UP"
else
    echo "❌ Some services failed to start. Check with: docker-compose logs"
    exit 1
fi

echo "🎉 Setup complete!"