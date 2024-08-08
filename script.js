const imageUrlInput = document.getElementById("image-url");
const imageTitleInput = document.getElementById("image-title");
const addImageButton = document.getElementById("add-image");
const imageContainer = document.querySelector(".image-container");
const paginationContainer = document.querySelector(".pagination");
const modalInfo = document.querySelector(".modal");

let currentPage = 1; // Página actual de la galería (inicia en 1)
const imagesPerPage = 10; // Cantidad de imágenes por página

// Muestra las imágenes en la página actual
function displayImages(pageNumber) {
  imageContainer.innerHTML = "";

  const totalImages = images.length;
  const totalPages = Math.ceil(totalImages / imagesPerPage);

  // Ajustar la página actual si es mayor que el total de páginas
  if (pageNumber > totalPages) {
    currentPage = totalPages > 0 ? totalPages : 1;
  } else {
    currentPage = pageNumber;
  }

  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = Math.min(startIndex + imagesPerPage, totalImages); // Calcula la cantidad total de páginas

  // Ajusta la página actual si es mayor que el total de páginas
  for (let i = startIndex; i < endIndex; i++) {
    if (images[i]) {
      imageContainer.appendChild(images[i]);
    }
  }

  updatePagination(); // Actualiza la paginación
}

// Actualiza la paginación de acuerdo a la cantidad de imágenes
function updatePagination() {
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(images.length / imagesPerPage);

  if (totalPages > 1) {
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      pageButton.classList.add("page-button");
      if (i === currentPage) {
        pageButton.classList.add("active");
      }

      pageButton.addEventListener("click", () => {
        currentPage = i;
        displayImages(currentPage);
      });

      paginationContainer.appendChild(pageButton);
    }
  }
}

let images = []; // Array para almacenar las imágenes

// Agrega una nueva imagen al principio del array y la muestra
addImageButton.addEventListener("click", () => {
  const imageUrl = imageUrlInput.value;
  const imageTitle = imageTitleInput.value;

  const newImage = document.createElement("div");

  if (imageUrl !== "" && imageTitle !== "") {
    newImage.classList.add("image");
    newImage.innerHTML = `
        <img style="border-radius:5px" src="${imageUrl}" alt="${imageTitle}">
        <h3>${imageTitle}</h3>
        <div class="botones">
            <button id="delete-image">Eliminar imagen</button>
            <button id="see-image">Ver detalles</button>
        </div>
        `;

    images.unshift(newImage); // Agrega la nueva imagen al inicio del array
    currentPage = 1; // Reinicia la página actual para mostrar la imagen recién agregada
    displayImages(currentPage); // Muestra las imágenes de la página actual

    //Estilos que se le da a la nueva imagen
    newImage.style.opacity = 0;
    newImage.style.transform = "scale(0.9)";

    //Se le otorga un tiempo prolongado para realizar animación y estilos a la imagen
    setTimeout(() => {
      newImage.style.opacity = 1;
      newImage.style.transform = "scale(1)";
    }, 10);

    // Limpiar los Inputs después de agregar nueva imagen
    imageUrlInput.value = "";
    imageTitleInput.value = "";
  }
});

//Sección de eventos del contenedor de imágenes
imageContainer.addEventListener("click", (event) => {
  //Si se dio click al button de eliminar, se hace la acción de eliminar
  //Se pregunta si se desea eliminar la imagen
  if (
    event.target.tagName.toLowerCase() === "button" &&
    event.target.id === "delete-image"
  ) {
    const opcion = prompt(
      "¿Estás seguro de editar? (Escoge un número)\n1.Aceptar\n2.Cancelar"
    );

    if (opcion === "1") {
      const imageElement = event.target.parentElement.parentElement;
      images = images.filter((img) => img !== imageElement);
      displayImages(currentPage);
    } else if (opcion !== "1" && opcion !== "2" && opcion !== null) {
      alert("Debes seleccionar una opción");
    }
    //Si se dio click al button de ver detalles, se activa el modal
  } else if (
    event.target.tagName.toLowerCase() === "button" &&
    event.target.id === "see-image"
  ) {
    const imageElement = event.target.parentElement.parentElement;
    const imageUrl = imageElement.querySelector("img").src;
    const imageTitle = imageElement.querySelector("h3").textContent;

    const info = document.createElement("div");
    info.classList.add("modal-container");
    info.innerHTML = `
        <h2>Detalles de la imagen</h2>
        <img src="${imageUrl}" alt="">
        <input type="text" id="modal-image-url" placeholder="Ingrese la URL de la imagen" value="${imageUrl}" />
        <input type="text" id="modal-image-title" placeholder="Ingrese el título de la imagen" value="${imageTitle}" />
        <div class="botones_info">
          <button id="edit-image">Editar Imagen</button>
          <button id="close">Cancelar</button>
        </div>
    `;

    modalInfo.innerHTML = "";
    modalInfo.appendChild(info);
    modalInfo.style.display = "flex";

    const modalImageUrlInput = document.getElementById("modal-image-url");
    const modalImageTitleInput = document.getElementById("modal-image-title");
    const editImageButton = document.getElementById("edit-image");
    const closeButton = document.getElementById("close");

    //Cierra el modal con el button cancelar
    closeButton.addEventListener("click", () => {
      modalInfo.style.display = "none";
    });

    //Si se dio click al button de editae, se hace la acción de editar
    //Acciona al tener al menos un campo editado
    //Se pregunta si se desea editar la imagen
    editImageButton.addEventListener("click", () => {
      const newImageUrl = modalImageUrlInput.value;
      const newImageTitle = modalImageTitleInput.value;

      if (newImageUrl === imageUrl && newImageTitle === imageTitle) {
        alert("Debe cambiar al menos un dato para editar la imagen.");
      } else {
        const opcion = prompt(
          "¿Estás seguro de editar? (Escoge un número)\n1.Aceptar\n2.Cancelar"
        );

        if (opcion === "1") {
          imageElement.querySelector("img").src = newImageUrl;
          imageElement.querySelector("h3").textContent = newImageTitle;
          modalInfo.style.display = "none";

          modalImageUrlInput.value = "";
          modalImageTitleInput.value = "";
        } else if (opcion !== "2" && opcion !== "1"  && opcion !== null) {
          alert("Debes seleccionar una opción");
        }
      }
    });
  }
});

//Cierra el modal
modalInfo.addEventListener("click", (event) => {
  if (event.target === modalInfo) {
    modalInfo.style.display = "none";
  }
});

displayImages(currentPage); // Muestra las imágenes de la página actual
