const express = require('express'); // Importa Express para crear el servidor
const multer = require('multer'); // Importa Multer para manejar la carga de archivos
const path = require('path'); // Importa Path para trabajar con rutas de archivos
const bodyParser = require('body-parser'); // Importa Body-Parser para procesar datos de formularios
const mysql = require('mysql'); // Importa MySQL para interactuar con la base de datos
const cors = require('cors'); // Importa CORS para permitir solicitudes desde diferentes dominios

const app = express(); // Crea una instancia de la aplicación Express
const port = 3001; // Define el puerto en el que el servidor escuchará

// Middleware
app.use(cors()); // Habilita CORS para permitir solicitudes de diferentes orígenes
app.use(express.json()); // Permite manejar datos en formato JSON
app.use(bodyParser.urlencoded({ extended: true })); // Permite manejar datos de formularios URL-encoded

// Configuración de multer para guardar archivos en la carpeta 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
});

const upload = multer({ storage }); // Configura Multer con la configuración de almacenamiento

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
    console.log('Conectado a la base de datos'); // Mensaje de éxito en la conexión
});

// Ruta de autenticación
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Consulta para buscar en la tabla de administradores
    const adminQuery = 'SELECT * FROM administradores WHERE adm_email = ?';
    db.query(adminQuery, [email], (err, adminResults) => {
        if (err) {
            return res.status(500).send(err); // En caso de error, responde con el error
        }

        if (adminResults.length > 0) {
            const admin = adminResults[0];

            if (password === admin.adm_password) {
                console.log('Admin encontrado:', admin);
                return res.status(200).json({ 
                    message: 'Autenticación exitosa', 
                    userType: 'admin', 
                    adminName: admin.adm_nombre 
                });
            } else {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }
        } else {
            // Si no se encuentra en administradores, busca en tatuadores
            const tatuadorQuery = 'SELECT * FROM tatuadores WHERE email = ?';
            db.query(tatuadorQuery, [email], (err, tatuadorResults) => {
                if (err) {
                    return res.status(500).send(err); // En caso de error, responde con el error
                }

                if (tatuadorResults.length > 0) {
                    const tatuador = tatuadorResults[0];

                    if (password === tatuador.password) {
                        console.log('Tatuador encontrado:', tatuador);
                        return res.status(200).json({ 
                            message: 'Autenticación exitosa', 
                            userType: 'tatuador', 
                            tatuaId: tatuador.Id,
                            tatuaName: tatuador.nombre, 
                            tatuaApellido: tatuador.apellido, 
                            tatuaTelefono: tatuador.telefono
                        });
                    } else {
                        return res.status(401).json({ message: 'Contraseña incorrecta' });
                    }
                } else {
                    // Si no se encuentra en tatuadores, busca en viewers
                    const viewerQuery = 'SELECT * FROM viewers WHERE viw_email = ?';
                    db.query(viewerQuery, [email], (err, viewerResults) => {
                        if (err) {
                            return res.status(500).send(err); // En caso de error, responde con el error
                        }

                        if (viewerResults.length > 0) {
                            const viewer = viewerResults[0];

                            if (password === viewer.viw_password) {
                                console.log('Viewer encontrado:', viewer);
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
// app.post('/api/upload', upload.single('image'), (req, res) => {
//     const { id_tat, esp_id } = req.body;
//     const ima_url = req.file.filename; // Nombre generado por multer para la imagen subida

//     // Inserta la imagen en la tabla imagenes_pru
//     const sql = 'INSERT INTO imagenes_pru (id_tat, esp_id, ima_url) VALUES (?, ?, ?)';
//     db.query(sql, [id_tat, esp_id, ima_url], (err, result) => {
//       if (err) {
//         console.error('Error saving image:', err); // Muestra error al guardar imagen
//         res.status(500).json({ error: 'Error saving image' });
//       } else {
//         console.log('Image saved successfully'); // Mensaje de éxito al guardar imagen
//         res.status(200).json({ message: 'Image saved successfully' });
//       }
//     });
// });

// Rutas relacionadas con viewers
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
            console.error('Error al insertar en la base de datos:', err); // Muestra error al insertar en la base de datos
            return res.status(500).send(err); // En caso de error, responde con el error
        }
        console.log('Nuevo usuario registrado:', result.insertId); // Mensaje de éxito al insertar
        res.status(200).send('Registro exitoso'); // Mensaje de éxito al insertar
    });
});

// Ruta para actualizar un viewer por su ID
app.put('/api/viewers/:id', (req, res) => {
    const { id } = req.params;
    const { viw_nombre, viw_apellido, viw_telefono, viw_email } = req.body;
    const query = 'UPDATE viewers SET viw_nombre = ?, viw_apellido = ?, viw_telefono = ?, viw_email = ? WHERE viw_id = ?';

    // Ejecuta la consulta para actualizar datos
    db.query(query, [viw_nombre, viw_apellido, viw_telefono, viw_email, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar en la base de datos:', err); // Muestra error al actualizar en la base de datos
            return res.status(500).send(err); // En caso de error, responde con el error
        }
        console.log('Viewer actualizado:', id); // Mensaje de éxito al actualizar
        res.status(200).send(req.body); // Devuelve los datos actualizados
    });
});

// Ruta para eliminar un viewer por su ID
app.delete('/api/viewers/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM viewers WHERE viw_id = ?';
    
    // Ejecuta la consulta para eliminar un registro
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar en la base de datos:', err); // Muestra error al eliminar en la base de datos
            return res.status(500).send(err); // En caso de error, responde con el error
        }
        console.log('Viewer eliminado:', id); // Mensaje de éxito al eliminar
        res.status(200).send('Eliminación exitosa'); // Mensaje de éxito al eliminar
    });
});

// Rutas relacionadas con tatuadores
// Ruta para obtener datos de la tabla tatuadores
app.get('/api/tatuadores', (req, res) => {
    const sql = 'SELECT * FROM tatuadores'; // Consulta para obtener todos los registros

    // Ejecuta la consulta para obtener datos
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send(err); // En caso de error, responde con el error
        }
        res.json(result); // Responde con los datos en formato JSON
    });
});

// Endpoint para obtener detalles del tatuador por ID
app.get('/api/tatuador/:id', (req, res) => {
    const id = req.params.id;

    // Consulta SQL para obtener los detalles del tatuador
    const query = 'SELECT nombre, apellido, telefono, email FROM tatuadores WHERE Id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta', err);
            return res.status(500).json({ error: 'Error al obtener los detalles del tatuador' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Tatuador no encontrado' });
        }
        res.json(results[0]); // Devuelve el primer resultado
    });
});

// Actualizar los detalles del tatuador
app.put('/api/tatuador/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, telefono, email } = req.body;
    const query = `
        UPDATE tatuadores
        SET nombre = ?, apellido = ?, telefono = ?, email = ?
        WHERE Id = ?
    `;

    db.query(query, [nombre, apellido, telefono, email, id], (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            return res.status(500).json({ error: 'Error al actualizar los detalles del tatuador' });
        }
        res.status(200).json({ message: 'Detalles actualizados correctamente' });
    });
});




// Rutas relacionadas con especialidades
// Ruta para obtener todas las especialidades
app.get('/api/especialidades', (req, res) => {
    const query = 'SELECT * FROM especialidades';
    
    // Ejecuta la consulta para obtener datos
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err); // En caso de error, responde con el error
        }
        res.json(results); // Responde con los datos en formato JSON
    });
});

// Nueva ruta para actualizar el estado activo de las especialidades
app.post('/api/especialidades/update', (req, res) => {
    const { id_tat, id_ima, id_esp, activo } = req.body;
    const query = 'UPDATE tatuadores_ima_esp SET esp_activo = ? WHERE id_tat = ? AND id_ima = ? AND id_esp = ?';
    
    // Ejecuta la consulta para actualizar el estado activo
    db.query(query, [activo, id_tat, id_ima, id_esp], (error) => {
        if (error) {
            return res.status(500).send('Error updating status'); // En caso de error, responde con el error
        }
        res.send('Status updated successfully'); // Mensaje de éxito al actualizar estado
    });
});

// Rutas relacionadas con planes
// Ruta para obtener datos de la tabla planes
app.get('/api/planes', (req, res) => {
    const sql = 'SELECT * FROM planes'; // Consulta para obtener todos los registros

    // Ejecuta la consulta para obtener datos
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
    
    // Ejecuta la consulta para actualizar datos
    db.query(query, [pla_nombre, pla_descripcion, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar en la base de datos:', err); // Muestra error al actualizar en la base de datos
            return res.status(500).send(err); // En caso de error, responde con el error
        }
    });
});

// Ruta para insertar un nuevo plan
app.post('/api/planes', (req, res) => {
    const { pla_nombre, pla_descripcion } = req.body;
    const query = 'INSERT INTO planes (pla_nombre, pla_descripcion) VALUES (?, ?)';

    // Ejecuta la consulta para insertar datos
    db.query(query, [pla_nombre, pla_descripcion], (err, result) => {
        if (err) {
            console.error('Error al insertar en la base de datos:', err); // Muestra error al insertar en la base de datos
            return res.status(500).send(err); // En caso de error, responde con el error
        }
        console.log('Nuevo plan creado:', result.insertId); // Mensaje de éxito al insertar
        res.status(200).send('Plan creado exitosamente'); // Mensaje de éxito al insertar
    });
});

// Ruta para eliminar un plan por ID
app.delete('/api/planes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM planes WHERE pla_id = ?';
    
    // Ejecuta la consulta para eliminar un registro
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar en la base de datos:', err); // Muestra error al eliminar en la base de datos
            return res.status(500).send(err); // En caso de error, responde con el error
        }
        console.log('Plan eliminado:', id); // Mensaje de éxito al eliminar
        res.status(200).send('Eliminación exitosa'); // Mensaje de éxito al eliminar
    });
});
// --------------------------------------------------------------------------------------------------------------------------------
// Ruta para obtener todos los registros de la tabla imagenes_pru
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
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Permite servir archivos estáticos desde la carpeta 'uploads'

app.post('/api/register', (req, res) => {
    const tatuador = req.body;
    const especialidades = tatuador.especialidades; // Este es el array de especialidades
  
    // Insertar tatuador en la tabla `tatuadores`
    const insertTatuadorQuery = 'INSERT INTO tatuadores (nombre, apellido, telefono, email, password) VALUES (?, ?, ?, ?, ?)';
    const tatuadorValues = [tatuador.nombre, tatuador.apellido, tatuador.telefono, tatuador.email, tatuador.password];
  
    db.query(insertTatuadorQuery, tatuadorValues, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error al registrar el tatuador', error: err });
      }
  
      const tatuadorId = result.insertId;
  
      // Insertar dirección en la tabla `direcciones`
      const insertDireccionQuery = 'INSERT INTO direcciones (dir_calle, dir_numero_ext, dir_colonia, dir_cp, dir_municipio, dir_estado, dir_localidad) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const direccionValues = [tatuador.dir_calle, tatuador.dir_numero_ext, tatuador.dir_colonia, tatuador.dir_cp, tatuador.dir_municipio, tatuador.dir_estado, tatuador.dir_localidad];
  
      db.query(insertDireccionQuery, direccionValues, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error al registrar la dirección', error: err });
        }
  
        // Insertar redes sociales en la tabla `redes_sociales`
        const insertRedesQuery = 'INSERT INTO redes_sociales (red_tiktok, red_facebook, red_whatsapp, red_instagram, id_tat) VALUES (?, ?, ?, ?, ?)';
        const redesValues = [tatuador.red_tiktok, tatuador.red_facebook, tatuador.red_whatsapp, tatuador.red_instagram, tatuadorId];
  
        db.query(insertRedesQuery, redesValues, (err) => {
          if (err) {
            return res.status(500).json({ message: 'Error al registrar las redes sociales', error: err });
          }
    
            res.status(201).json({ message: 'Tatuador registrado exitosamente', tatuaId: tatuadorId });
          });

      });
    });
  });
  
  
  
// -----------------------------------------------------------------------------------------------------------------------------------
// Ruta para obtener especialidades y el estado de la imagen
app.get('/api/especialidades/:id_tat', (req, res) => {
    const idTat = req.params.id_tat;
    const query = `
        SELECT esp.*, img.status, img.ima_url 
        FROM especialidades esp 
        LEFT JOIN imagenes_pru img 
        ON esp.esp_id = img.esp_id AND img.id_tat = ?
    `;
    db.query(query, [idTat], (error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).json(results);
        }
    });
});

// Ruta para manejar la carga de imágenes
app.post('/api/upload', upload.single('image'), (req, res) => {
    const { esp_id, id_tat } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (imageUrl) {
        const checkImageQuery = 'SELECT * FROM imagenes_pru WHERE esp_id = ? AND id_tat = ?';
        db.query(checkImageQuery, [esp_id, id_tat], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error checking existing image', error: err });
            }

            if (results.length > 0) {
                const updateImageQuery = 'UPDATE imagenes_pru SET ima_url = ?, status = 1 WHERE esp_id = ? AND id_tat = ?';
                db.query(updateImageQuery, [imageUrl, esp_id, id_tat], (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error updating image URL', error: err });
                    }
                    res.status(200).json({ message: 'Image updated successfully', ima_url: imageUrl });
                });
            } else {
                const insertImageQuery = 'INSERT INTO imagenes_pru (esp_id, ima_url, id_tat, status) VALUES (?, ?, ?, 1)';
                db.query(insertImageQuery, [esp_id, imageUrl, id_tat], (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error inserting image', error: err });
                    }
                    res.status(200).json({ message: 'Image uploaded successfully', ima_url: imageUrl });
                });
            }
        });
    } else {
        res.status(400).json({ message: 'Image upload failed' });
    }
});

// Ruta para eliminar la imagen
app.delete('/api/delete-image', (req, res) => {
    const { esp_id, id_tat } = req.body;

    const deleteImageQuery = 'UPDATE imagenes_pru SET ima_url = NULL, status = 0 WHERE esp_id = ? AND id_tat = ?';
    db.query(deleteImageQuery, [esp_id, id_tat], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting image', error: err });
        }
        res.status(200).json({ message: 'Image deleted successfully' });
    });
});
// -----------------------------------------------------------------------------------------------

// Endpoint para obtener las redes sociales de un tatuador
app.get('/api/tatuadores/:id/redes_sociales', (req, res) => {
    const tatuaId = req.params.id;

    const query = `
        SELECT red_facebook, red_whatsapp, red_tiktok, red_instagram
        FROM redes_sociales
        WHERE id_tat = ?
    `;

    db.query(query, [tatuaId], (err, results) => {
        if (err) {
            console.error('Error fetching social networks:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: 'No social networks found for this tattoo artist' });
            return;
        }

        res.json(results[0]);
    });
});



// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});