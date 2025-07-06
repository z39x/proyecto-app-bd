# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

SCRIPT PARA PEGAR EN MONGODB



use Empresa

db.cliente.insertOne({identificadorCli: "FOS4", nombre: "Marcelo", apellidos: "Quezada Riveros", direccion: {calle: "Lago Llanquihue", numero: 5422, ciudad: "Talcahuano"}, fechaRegistro: "03-07-2025"})


db.productos.insertOne({codProducto: 234872, nombre: "Taza", precio: 10000, stock: 15, estado: "Activo"})


db.pedidos.insertOne({codigoPedido: "GLB7", codigoCliente: "FOS4", fechaPedido: "03-07-2025", productos: {codProducto: 234872, nombre: "Taza", cantidad: 1, precioUnitario: 10000, totalComprado: 10000}, totalCompra: 10000, metodoPago: "Débito"})
