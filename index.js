const apiBaseUrl = "https://crudcrud.com/api/da7803b954a146fcb7183153fa1f3ae1/inventory";

function handleFormSubmit(event) {
  event.preventDefault();

  const itemDetails = {
    name: event.target.name.value,
    description: event.target.description.value,
    quantity: parseInt(event.target.quantity.value, 10),
    price: parseFloat(event.target.price.value),
  };

  // POST data to the API
  axios
    .post(apiBaseUrl, itemDetails)
    .then((response) => displayItemOnScreen(response.data))
    .catch((error) => console.error(error));

  // Clear form fields
  event.target.reset();
}

// Display an item on the screen
function displayItemOnScreen(item) {
  const list = document.getElementById("user-list");

  const listItem = document.createElement("li");
  listItem.setAttribute("data-id", item._id);

  // Structure listItem content
  listItem.innerHTML = `
    <strong class="name">${item.name}</strong> - 
    <span class="description">${item.description}</span> |
    Quantity: <span class="quantity">${item.quantity}</span> |
    Price: &#8377;<span class="price">${item.price}</span>
  `;

  // Add Buy buttons
  for (let i = 1; i <= 5; i++) {
    const buyBtn = document.createElement("button");
    buyBtn.textContent = `Buy${i}`;
    buyBtn.addEventListener("click", () => handleBuyClick(item._id, i, listItem));
    listItem.appendChild(buyBtn);
  }

  // Add Edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => handleEditClick(item, listItem));
  listItem.appendChild(editBtn);

  list.appendChild(listItem);
}

// Fetch all items and display them on the screen
document.addEventListener("DOMContentLoaded", () => {
  axios
    .get(apiBaseUrl)
    .then((response) => {
      response.data.forEach((item) => displayItemOnScreen(item));
    })
    .catch((error) => console.error(error));
});

// Handle Buy button click
function handleBuyClick(itemId, quantityToBuy, listItem) {
  const quantityElement = listItem.querySelector(".quantity");
  const currentQuantity = parseInt(quantityElement.textContent, 10);

  if (currentQuantity >= quantityToBuy) {
    const updatedQuantity = currentQuantity - quantityToBuy;

    const updatedItem = {
      name: listItem.querySelector(".name").textContent,
      description: listItem.querySelector(".description").textContent,
      quantity: updatedQuantity,
      price: parseFloat(listItem.querySelector(".price").textContent),
    };

    // Update quantity in the API
    axios
      .put(`${apiBaseUrl}/${itemId}`, updatedItem)
      .then(() => {
        // Update quantity in the DOM
        quantityElement.textContent = updatedQuantity;
      })
      .catch((error) => console.error(error));
  } else {
    alert("Not enough stock!");
  }
}

// Handle Edit button click
function handleEditClick(item, listItem) {
  const newQuantity = prompt("Enter new quantity:", item.quantity);
  const newPrice = prompt("Enter new price:", item.price);

  if (newQuantity !== null && newPrice !== null) {
    const updatedItem = {
      name: item.name,
      description: item.description,
      quantity: parseInt(newQuantity, 10),
      price: parseFloat(newPrice),
    };

    // Update item in the API
    axios
      .put(`${apiBaseUrl}/${item._id}`, updatedItem)
      .then(() => {
        listItem.querySelector(".quantity").textContent = updatedItem.quantity;
        listItem.querySelector(".price").textContent = updatedItem.price;
      })
      .catch((error) => console.error(error));
  }
}
