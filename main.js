const apiBaseUrl = "https://crudcrud.com/api/da7803b954a146fcb7183153fa1f3ae1/inventory";

function handleFormSubmit(event){
    event.preventDefault();

    let itemDetails = {
        name: event.target.name.value,
        description : event.target.description.value,
        quantity: parseInt(event.target.quantity.value, 10),
        price: parseFloat(event.target.price.value)
    }

    if(itemDetails){
        axios
        .post(apiBaseUrl, itemDetails)
        // .then((response) => console.log(response.data))
        .then((response) => displayItemOnScreen(response.data))
        .catch((error) => console.log(error));
    }

    event.target.reset();

}

function displayItemOnScreen(item){
    const list = document.getElementById("user-list");

    let listItem = document.createElement("li");
    listItem.setAttribute("data-id", item._id);

    listItem.innerHTML = 
    `Name: ${item.name}, Description: ${item.description}, 
    Quantity: ${item.quantity}, Price: &#8377;${item.price}`

    for(let i=1; i<=5; i++){
        const buyBtn = document.createElement("button");
        buyBtn.textContent = `Buy${i}`;
        buyBtn.addEventListener("click", () => handleBuyClick(item._id, i, listItem));
        listItem.appendChild(buyBtn);
    }

    let editBtn = document.createElement("button");
    editBtn.addEventListener("click", () => handleEdit(item, listItem));
    editBtn.textContent = "Edit";
    listItem.appendChild(editBtn);

    list.appendChild(listItem);
}

document.addEventListener("DOMContentLoaded", () => {
    axios
    .get(apiBaseUrl)
    .then((response) => {
        response.data.foreach((item) => displayItemOnScreen(item))
    })
    .catch((error) => console.log(error));
})