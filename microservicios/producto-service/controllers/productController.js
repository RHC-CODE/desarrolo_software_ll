const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Ruta al archivo productos.json desde el controller
const dataPath = path.join(__dirname, '..', 'data', 'productos.json');

// Leer productos desde el archivo
const readData = () => {
  if (!fs.existsSync(dataPath)) return [];
  const jsonData = fs.readFileSync(dataPath);
  return JSON.parse(jsonData);
};

// Guardar productos en el archivo
const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Función para llamar al servicio Python y calcular valor total
const calcularValorTotal = async (precio, cantidad) => {
  const response = await axios.post('http://calculo-service:4000/calcular', {
    precio,
    cantidad
  });
  return response.data.valorTotal;
};

exports.registrarProducto = async (req, res) => {
  try {
    const productos = readData();
    const nuevoProducto = req.body;

    const producto = productos.find(p => p.codigo === nuevoProducto.codigo);
    if (producto) {
      return res.status(404).json({ mensaje: 'Producto ya existe.' });
    }

    // Validar datos básicos
    if (!nuevoProducto.codigo || !nuevoProducto.nombre || nuevoProducto.precio == null || nuevoProducto.cantidad == null) {
      return res.status(400).json({ mensaje: 'Faltan datos del producto.' });
    }

    // Calcular valor total usando el servicio externo
    nuevoProducto.valorTotal = await calcularValorTotal(nuevoProducto.precio, nuevoProducto.cantidad);

    productos.push(nuevoProducto);
    writeData(productos);

    res.status(201).json({ mensaje: 'Producto registrado correctamente.', producto: nuevoProducto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar el producto.' });
  }
};

exports.obtenerProducto = (req, res) => {
  const productos = readData();
  const producto = productos.find(p => p.codigo === req.params.codigo);
  if (!producto) {
    return res.status(404).json({ mensaje: 'Producto no encontrado.' });
  }
  res.json(producto);
};

exports.actualizarProducto = async (req, res) => {
  try {
    const productos = readData();
    const index = productos.findIndex(p => p.codigo === req.params.codigo);
    if (index === -1) {
      return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    }

    const datosActualizados = req.body;

    // Actualizar campos relevantes
    productos[index] = { ...productos[index], ...datosActualizados };

    // Si cambió precio o cantidad, recalcular el valor total
    const { precio, cantidad } = productos[index];
    productos[index].valorTotal = await calcularValorTotal(precio, cantidad);

    writeData(productos);

    res.json({ mensaje: 'Producto actualizado correctamente.', producto: productos[index] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el producto.' });
  }
};
