#!/bin/bash

# Installation script for Clinic Digital Project
# Instala automáticamente todas las dependencias y configura el proyecto

set -e

echo "================================"
echo "🏥 Clínica Digital - Instalador"
echo "================================"

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Backend Setup
echo -e "\n${BLUE}[1/4]${NC} Instalando dependencias del backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Crear .env desde ejemplo
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Archivo .env creado. Actualiza con tus credenciales de WhatsApp${NC}"
fi

cd ..

# 2. Database Setup
echo -e "\n${BLUE}[2/4]${NC} Inicializando base de datos..."
mkdir -p database
touch database/clinic.db

# 3. Frontend Setup
echo -e "\n${BLUE}[3/4]${NC} Preparando frontend..."
cd frontend
echo -e "${GREEN}✓${NC} Frontend listo"
cd ..

# 4. Project Structure
echo -e "\n${BLUE}[4/4]${NC} Verificando estructura del proyecto..."
mkdir -p logs
mkdir -p uploads
mkdir -p cache

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}✓ Instalación completada!${NC}"
echo -e "${GREEN}================================${NC}"

echo -e "\n${BLUE}Próximos pasos:${NC}"
echo "1. Actualiza el archivo 'backend/.env' con tus credenciales de WhatsApp"
echo "2. Inicia el servidor backend: cd backend && source venv/bin/activate && python app.py"
echo "3. En otra terminal, inicia el servidor frontend: cd frontend && python -m http.server 8000"
echo "4. Abre http://localhost:8000 en tu navegador"

echo -e "\n${YELLOW}Para más información, lee SETUP.md${NC}"
