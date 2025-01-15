// Seleccionar la base de datos (se crea automáticamente si no existe)
db = db.getSiblingDB('microtask');

// Crear usuarios
db.createUser({
  user: 'admin',
  pwd: '1234',
  roles: [
    {
      role: 'readWrite',
      db: 'microtask',
    },
  ],
});

// Crear colecciones
// db.createCollection('task');
print('Inicialización de base de datos completa.');