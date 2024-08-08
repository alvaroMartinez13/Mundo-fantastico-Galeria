const imageUrlInput = document.getElementById("image-url");
const imageTitleInput = document.getElementById("image-title");
const addImageButton = document.getElementById("add-image");
const imageContainer = document.querySelector(".image-container");
const paginationContainer = document.querySelector(".pagination");
const modalInfo = document.querySelector(".modal");

let currentPage = 1;
const imagesPerPage = 10;

function displayImages(pageNumber) {
  imageContainer.innerHTML = "";

  const totalImages = images.length;
  const startIndex = (pageNumber - 1) * imagesPerPage;
  const endIndex = Math.min(startIndex + imagesPerPage, totalImages);

  for (let i = startIndex; i < endIndex; i++) {
    if (images[i]) {
      imageContainer.appendChild(images[i]);
    }
  }

  updatePagination();
}

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

function adjustCurrentPage() {
  const totalPages = Math.ceil(images.length / imagesPerPage);
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  if (currentPage < 1) {
    currentPage = 1;
  }
}

let images = [];

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

    images.unshift(newImage); // Add new image at the beginning of the array

    const deleteButton = newImage.querySelector("#delete-image");
    deleteButton.addEventListener("click", () => {
      images = images.filter((image) => image !== newImage);
      adjustCurrentPage();
      displayImages(currentPage);
    });

    const seeImageButton = newImage.querySelector("#see-image");
    seeImageButton.addEventListener("click", () => {
      openModal(newImage, imageUrl, imageTitle);
    });

    imageUrlInput.value = "";
    imageTitleInput.value = "";

    adjustCurrentPage();
    displayImages(currentPage);
  } else {
    alert("Por favor ingrese URL y título de la imagen");
  }
});

function openModal(imageElement, url, title) {
  modalInfo.style.display = "flex";
  modalInfo.innerHTML = `
      <div class="modal-container">
          <img src="${url}" alt="${title}">
          <input id="edit-title" type="text" value="${title}">
          <div class="botones_info">
              <button id="edit-image">Editar</button>
              <button id="close">Cerrar</button>
          </div>
      </div>
  `;

  const editImageButton = modalInfo.querySelector("#edit-image");
  const closeButton = modalInfo.querySelector("#close");
  const editTitleInput = modalInfo.querySelector("#edit-title");

  editImageButton.addEventListener("click", () => {
    const newTitle = editTitleInput.value;
    imageElement.querySelector("h3").textContent = newTitle;
    modalInfo.style.display = "none";
  });

  closeButton.addEventListener("click", () => {
    modalInfo.style.display = "none";
  });
}

adjustCurrentPage();
displayImages(currentPage);
