#!/bin/bash

# Run script for Clinic Digital Project
# Inicia todos los servidores necesarios

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}🏥 Clínica Digital - Iniciador${NC}"
echo -e "${BLUE}================================${NC}"

# Check if .env exists
if [ ! -f "$SCRIPT_DIR/backend/.env" ]; then
    echo -e "${RED}✗ Error: archivo .env no encontrado${NC}"
    echo -e "${YELLOW}Copia el archivo .env.example a .env y configúralo${NC}"
    exit 1
fi

# Start backend
echo -e "\n${BLUE}[1/2]${NC} Iniciando servidor backend..."
cd "$SCRIPT_DIR/backend"
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}⚠️  Entorno virtual no encontrado. Ejecuta install.sh primero${NC}"
    exit 1
fi

source venv/bin/activate
python app.py &
BACKEND_PID=$!

echo -e "${GREEN}✓${NC} Backend iniciado (PID: $BACKEND_PID)"
echo -e "   Disponible en: ${BLUE}http://localhost:5000${NC}"

# Start frontend
echo -e "\n${BLUE}[2/2]${NC} Iniciando servidor frontend..."
cd "$SCRIPT_DIR/frontend"
python3 -m http.server 8000 &
FRONTEND_PID=$!

echo -e "${GREEN}✓${NC} Frontend iniciado (PID: $FRONTEND_PID)"
echo -e "   Disponible en: ${BLUE}http://localhost:8000${NC}"

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}✓ Servidores iniciados!${NC}"
echo -e "${GREEN}================================${NC}"

echo -e "\n${BLUE}Para detener los servidores:${NC}"
echo "  kill $BACKEND_PID $FRONTEND_PID"

# Keep the script running
wait
