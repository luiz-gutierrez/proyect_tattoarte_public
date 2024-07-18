const express = require('express'); // Importa Express para crear el servidor
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql'); // Importa mysql para interactuar con la base de datos
const cors = require('cors'); // Importa cors para permitir solicitudes desde diferentes dominios

const app = express(); // Crea una instancia de la aplicación Express
const port = 3001; // Define el puerto en el que el servidor escuchará

// Middleware
app.use(cors()); // Habilita CORS para permitir solicitudes de diferentes orígenes
app.use(express.json()); // Permite manejar datos en formato JSON
app.use(bodyParser.urlencoded({ extended: true }));


// Configuración de multer para guardar archivos en la carpeta 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost', // Dirección del servidor de la base de datos
    user: 'root',      // Usuario de la base de datos
    password: '',      // Contraseña de la base de datos
    database: 'tattoarte' // Nombre de la base de datos
});

// Conexión a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err); // Muestra error de conexión
        return;
    }
    console.log('Connected to the database'); // Mensaje de éxito en la conexión
});

// Ruta de autenticación
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
  
    const adminQuery = 'SELECT * FROM administradores WHERE adm_email = ?';
    db.query(adminQuery, [email], (err, adminResults) => {
        if (err) {
            return res.status(500).send(err);
        }
  
        if (adminResults.length > 0) {
            const admin = adminResults[0];
  
            if (password === admin.adm_password) {
                return res.status(200).json({ 
                    message: 'Autenticación exitosa', 
                    userType: 'admin', 
                    adminName: admin.adm_nombre 
                });
            } else {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }
        } else {
            const tatuadorQuery = 'SELECT * FROM tatuadores WHERE email = ?';
            db.query(tatuadorQuery, [email], (err, tatuadorResults) => {
                if (err) {
                    return res.status(500).send(err);
                }
  
                if (tatuadorResults.length > 0) {
                    const tatuador = tatuadorResults[0];
  
                    if (password === tatuador.password) {
                        return res.status(200).json({ 
                            message: 'Autenticación exitosa', 
                            userType: 'tatuador', 
                            tatuaName: tatuador.nombre, 
                            idName: tatuador.Id 
                        });
                    } else {
                        return res.status(401).json({ message: 'Contraseña incorrecta' });
                    }
                } else {
                    const viewerQuery = 'SELECT * FROM viewers WHERE viw_email = ?';
                    db.query(viewerQuery, [email], (err, viewerResults) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
  
                        if (viewerResults.length > 0) {
                            const viewer = viewerResults[0];
  
                            if (password === viewer.viw_password) {
                                return res.status(200).json({ 
                                    message: 'Autenticación exitosa', 
                                    userType: 'viewer', 
                                    viewerName: viewer.viw_nombre, 
                                    viewerId: viewer.viw_id 
                                });
                            } else {
                                return res.status(401).json({ message: 'Contraseña incorrecta' });
                            }
                        } else {
                            return res.status(404).json({ message: 'Usuario no encontrado' });
                        }
                    });
                }
            });
        }
    });
});


// Ruta para manejar la carga de imágenes
app.post('/api/upload', upload.single('image'), (req, res) => {
    const { id_tat, esp_id } = req.body;
    const ima_url = req.file.filename; // Nombre generado por multer para la imagen subida
  
    // Inserta la imagen en la tabla imagenes_pru
    const sql = 'INSERT INTO imagenes_pru (id_tat, esp_id, ima_url) VALUES (?, ?, ?)';
    db.query(sql, [id_tat, esp_id, ima_url], (err, result) => {
      if (err) {
        console.error('Error saving image:', err);
        res.status(500).json({ error: 'Error saving image' });
      } else {
        console.log('Image saved successfully');
        res.status(200).json({ message: 'Image saved successfully' });
      }
    });
  });
  


//aciones de viewers

// Ruta para obtener datos de la tabla viewers
app.get('/api/viewers', (req, res) => {
    const sql = 'SELECT * FROM viewers'; // Consulta para obtener todos los registros

    // Ejecuta la consulta para obtener datos
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send(err); // En caso de error, responde con el error
        }
        res.json(result); // Responde con los datos en formato JSON
    });
});



// Ruta para insertar datos en la tabla viewers
app.post('/api/viewers', (req, res) => {
    const { viw_nombre, viw_apellido, viw_telefono, viw_email, viw_password } = req.body;
    const query = 'INSERT INTO viewers (viw_nombre, viw_apellido, viw_telefono, viw_email, viw_password) VALUES (?, ?, ?, ?, ?)';

    // Ejecuta la consulta para insertar datos
    db.query(query, [viw_nombre, viw_apellido, viw_telefono, viw_email, viw_password], (err, result) => {
        if (err) {
            console.error('Error al insertar en la base de datos:', err);
            return res.status(500).send(err); // En caso de error, responde con el error
        }
        console.log('Nuevo usuario registrado:', result.insertId);
        res.status(200).send('Registro exitoso'); // Mensaje de éxito al insertar
    });
});

// Ruta para actualizar un viewer por su ID
app.put('/api/viewers/:id', (req, res) => {
    const { id } = req.params;
    const { viw_nombre, viw_apellido, viw_telefono, viw_email } = req.body;
    const query = 'UPDATE viewers SET viw_nombre = ?, viw_apellido = ?, viw_telefono = ?, viw_email = ? WHERE viw_id = ?';

    db.query(query, [viw_nombre, viw_apellido, viw_telefono, viw_email, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar en la base de datos:', err);
            return res.status(500).send(err); // En caso de error, responde con el error
        }
        console.log('Viewer actualizado:', id);
        res.status(200).send(req.body); // Devuelve los datos actualizados
    });
});

// Ruta para eliminar un viewer por su ID
app.delete('/api/viewers/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM viewers WHERE viw_id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar en la base de datos:', err);
            return res.status(500).send(err); // En caso de error, responde con el error
        }
        console.log('Viewer eliminado:', id);
        res.status(200).send('Eliminación exitosa'); // Mensaje de éxito al eliminar
    });
});

//aciones de tatuadores
// Ruta para obtener datos de la tabla tatuadores
app.get('/api/tatuadores', (req, res) => {
    const sql = 'SELECT * FROM tatuadores'; // Consulta para obtener todos los registros

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send(err); // En caso de error, responde con el error
        }
        res.json(result); // Responde con los datos en formato JSON
    });
});

//Acciones de especialidades
// Ruta para obtener todas las especialidades
app.get('/api/especialidades', (req, res) => {
    const query = 'SELECT * FROM especialidades';
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});
// Nueva ruta para actualizar el estado activo de las especialidades
app.post('/api/especialidades/update', (req, res) => {
    const { id_tat, id_ima, id_esp, activo } = req.body;
    const query = 'UPDATE tatuadores_ima_esp SET esp_activo = ? WHERE id_tat = ? AND id_ima = ? AND id_esp = ?';
    db.query(query, [activo, id_tat, id_ima, id_esp], (error) => {
        if (error) {
            return res.status(500).send('Error updating status');
        }
        res.send('Status updated successfully');
    });
});



//aciones de planes
// Ruta para obtener datos de la tabla planes
app.get('/api/planes', (req, res) => {
    const sql = 'SELECT * FROM planes'; // Consulta para obtener todos los registros

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send(err); // En caso de error, responde con el error
        }
        res.json(result); // Responde con los datos en formato JSON
    });
});

// Endpoint para actualizar un plan por su ID
app.put('/api/planes/:id', (req, res) => {
    const { id } = req.params;
    const { pla_nombre, pla_descripcion } = req.body;
    const query = 'UPDATE planes SET pla_nombre = ?, pla_descripcion = ? WHERE pla_id = ?';
    
    db.query(query, [pla_nombre, pla_descripcion, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar en la base de datos:', err);
            return res.status(500).send(err);
        }
    });
});

// Ruta para insertar un nuevo plan
app.post('/api/planes', (req, res) => {
    const { pla_nombre, pla_descripcion } = req.body;
    const query = 'INSERT INTO planes (pla_nombre, pla_descripcion) VALUES (?, ?)';

    db.query(query, [pla_nombre, pla_descripcion], (err, result) => {
        if (err) {
            console.error('Error al insertar en la base de datos:', err);
            return res.status(500).send(err);
        }
        console.log('Nuevo plan creado:', result.insertId);
        res.status(200).send('Plan creado exitosamente');
    });
});

// Ruta para eliminar un plan por ID
app.delete('/api/planes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM planes WHERE pla_id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar en la base de datos:', err);
            return res.status(500).send(err); // En caso de error, responde con el error
        }
        console.log('Viewer eliminado:', id);
        res.status(200).send('Eliminación exitosa'); // Mensaje de éxito al eliminar
    });
});
//-------------------------------------------------------------------
app.get('/api/imagenes_pru', (req, res) => {
    const sql = 'SELECT * FROM imagenes_pru'; // Consulta para obtener todos los registros

    // Ejecuta la consulta para obtener datos
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send(err); // En caso de error, responde con el error
        }
        res.json(result); // Responde con los datos en formato JSON
    });
});
// Configuración de archivos estáticos
app.use('/uploads', express.static('uploads'));

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`); // Mensaje al iniciar el servidor
});
