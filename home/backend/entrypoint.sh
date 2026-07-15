#!/bin/sh
set -e

echo "Ejecutando migraciones..."
python manage.py migrate --noinput

echo "Recolectando archivos estaticos..."
python manage.py collectstatic --noinput 2>/dev/null || true

echo "Iniciando servidor..."
exec python manage.py runserver 0.0.0.0:8000
