document.addEventListener("DOMContentLoaded", function() {
    let nbInput = document.getElementById("nbInput");
    let saludar = document.getElementById("saludar");
    let sdOutput = document.getElementById("sdOutput");
    let dpInput = document.getElementById("dpInput");
    let deposito = document.getElementById("deposito");

    let output = document.getElementById("output");
    let productosList = document.getElementById("productosList");
    let buscarInput = document.getElementById("buscarInput");
    let buscarButton = document.getElementById("buscarButton");
    let productoIf = document.getElementById("productoIf");

    let nombre = "";
    let saldo = 0;

    class Producto {
        constructor(producto, precio) {
            this.producto = producto;
            this.precio = precio;
        }

        barato() {
            return this.precio <= 3.00;
        }

        mostrar() {
            const contenedor = document.createElement("div");
            contenedor.innerHTML = `<h3> Producto: ${this.producto}</h3>
                               <p> Precio: $ ${this.precio}</p>`;
            productosList.appendChild(contenedor);
        }
    }

    let productosCP = [];

    if (localStorage.getItem("nombre")) {
        nombre = localStorage.getItem("nombre");
        nbInput.value = nombre;
        saldo = parseFloat(localStorage.getItem("saldo"));
        actualizarSaldo();
    }

    async function cargarProductos() {
        try {
            const response = await fetch('productos.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo JSON.');
            }
            const data = await response.json();

            productosCP = data.map(item => new Producto(item.producto, item.precio));
            mostrarProductos();
        } catch (error) {
            console.error(error);
        }
    }

    function mostrarProductos() {
        productosList.innerHTML = "";
        productosCP.forEach(producto => {
            producto.mostrar();
        });
    }

    cargarProductos();


    buscarButton.addEventListener("click", () => {
        const buscar = buscarInput.value;
        const encontrado = productosCP.find(producto => producto.producto.toLowerCase() === buscar.toLowerCase());

        if (encontrado) {
            const mensaje = encontrado.barato() ? "barato" : "caro";
            productoIf.innerHTML = `${encontrado.producto} está disponible y es ${mensaje}.`;
        } else {
            productoIf.innerHTML = "Producto no encontrado.";
        }
    });

    saludar.addEventListener("click", () => {
        nombre = nbInput.value;
        if (nombre) {
            output.innerHTML = `Hola ${nombre}, ingrese su saldo.`;
            localStorage.setItem("nombre", nombre);
        } else {
            output.innerHTML = "Por favor, ingrese su nombre.";
        }
    });

    deposito.addEventListener("click", () => {
        let monto = parseFloat(dpInput.value);
        if (!isNaN(monto) && monto > 0) {
            saldo += monto;
            actualizarSaldo();
            localStorage.setItem("saldo", saldo.toString());
            output.innerHTML = `Depósito exitoso. Su nuevo saldo es: ${saldo} USD`;
        } else {
            output.innerHTML = "Ingrese un monto válido para poder comprar.";
        }
    });

    function actualizarSaldo() {
        sdOutput.innerHTML = `Su saldo actual es: ${saldo} USD`;
    }
});
