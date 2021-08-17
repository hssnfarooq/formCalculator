var form = document.getElementById("domesticParcel");
var fromData = {};
var toData = {};
var small = false;
var medium = false;
var large = false;
var basePrice = 4.5;
var price = 0;
var totalPrice = 0;
form.addEventListener("submit", () => {
  //event.preventDefault();
  var parcel = Number(document.getElementById("numParcels").value);
  for (let i = 1; i <= parcel; i++) {
    var width = document.getElementById(`${i}-width`).value;
    var height = document.getElementById(`${i}-height`).value;
    var length = document.getElementById(`${i}-length`).value;
    var dimension = width * height * length;
    if (dimension < 8000) {
      small = true;
    }
    if (dimension >= 8000 && dimension <= 64000) {
      medium = true;
    }
    if (dimension > 64000) {
      large = true;
    }
    if (i > 1) {
      price += 1.5;
    }
    calculateParcelPrice();
  }

  totalPrice = basePrice + price;
  fromData = {
    name: document.getElementById("First-Name").value,
    email: document.getElementById("Email").value,
    phone: document.getElementById("Phone").value,
    address: document.getElementById("domesticFromSuburb").value,
  };
  toData = {
    name: document.getElementById("to-name").value,
    phone: document.getElementById("to-phone").value,
    address: document.getElementById("domesticToSuburb").value,
  };
  localStorage.setItem("fromData", JSON.stringify(fromData));
  localStorage.setItem("toData", JSON.stringify(toData));
  localStorage.setItem("totalPrice", totalPrice);
});

function calculateParcelPrice() {
  if (small) {
    price += 2;
    small = false;
  }
  if (medium) {
    price += 3.5;
    medium = false;
  }
  if (large) {
    price += 6;
    large = false;
  }
}

function parcelChange(num) {
  var div = document.getElementById("weights");
  div.innerHTML = `
  
  <input name="ItemDimensions[0].Weight" required id="weight" placeholder="Weight (kg)" type="number" min="0.1" step="0.1" max="15" class="half" />

  <input name="ItemDimensions[0].Length" required id="1-length" placeholder="Length (cm)" type="number" min="10" step="1" max="120" class="half" />

  <input name="ItemDimensions[0].Width" required id="1-width" placeholder="Width (cm)" type="number" min="10" step="1" max="60" class="half" />

  <input name="ItemDimensions[0].Height" required id="1-height" placeholder="Height (cm)" type="number" min="1" step="1" max="60" class="half" />`;
  for (let i = 1; i < num; i++) {
    var newDiv = document.createElement("div");
    newDiv.innerHTML = `<h4 style="font-size: 12px">Parcel ${i + 1}</h4>
  
  <input name="ItemDimensions[0].Weight" required id="weight" placeholder="Weight (kg)" type="number" min="0.1" step="0.1" max="15" class="half" />

  <input name="ItemDimensions[0].Length" required id="${
    i + 1
  }-length" placeholder="Length (cm)" type="number" min="10" step="1" max="120" class="half" />

  <input name="ItemDimensions[0].Width" required id="${
    i + 1
  }-width" placeholder="Width (cm)" type="number" min="10" step="1" max="60" class="half" />

  <input name="ItemDimensions[0].Height" required id="${
    i + 1
  }-height" placeholder="Height (cm)" type="number" min="1" step="1" max="60" class="half" />`;
    newDiv.className = "weight";
    div.appendChild(newDiv);
  }
}
