#!/bin/sh
set -e

echo "Ejecutando migraciones..."
python manage.py migrate --noinput

if [ -f "fixtures/initial_data.json" ]; then
  COUNT=$(python manage.py shell -c "from apps.users.models import Perfil; print(Perfil.objects.count())" 2>/dev/null || echo "0")
  if [ "$COUNT" = "0" ]; then
    echo "Cargando datos iniciales..."
    python manage.py loaddata fixtures/initial_data.json
  else
    echo "La base de datos ya tiene datos, omitiendo fixture."
  fi
fi

echo "Recolectando archivos estaticos..."
python manage.py collectstatic --noinput 2>/dev/null || true

echo "Iniciando servidor..."
exec python manage.py runserver 0.0.0.0:8000
