const urlParams = new URLSearchParams(window.location.search);
const showtimeId = urlParams.get("showtime_id");
const userId = localStorage.getItem("user_id");

const seatMapEl = document.getElementById("seat-map");
const snacksListEl = document.getElementById("snacks-list");
const totalPriceEl = document.getElementById("total-price");
const couponInput = document.getElementById("coupon-code");
const paymentSelect = document.getElementById("payment-method");

let selectedSeats = [];
let selectedSnacks = [];
let baseSeatPrice = 0;

async function loadSeats() {
  try {
    const { data: showtimeData } = await api.get(
      `/get_showtimes?id=${showtimeId}`
    );
    const showtime = showtimeData.showtimes[0];
    const auditoriumId = showtime.auditorium_id;

    const { data: seatData } = await api.get(
      `/get_seats?auditorium_id=${auditoriumId}`
    );
    const seats = seatData.seats;
    baseSeatPrice = seatData.base_price || 10;

    seatMapEl.innerHTML = "";

    const screen = document.createElement("div");
    screen.className = "screen";
    screen.textContent = "SCREEN";
    seatMapEl.appendChild(screen);

    const seatRows = {};
    seats.forEach(seat => {
      const row = seat.row_label;
      if (!seatRows[row]) seatRows[row] = [];
      seatRows[row].push(seat);
    });

    Object.keys(seatRows)
      .sort()
      .forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "seat-row";

        seatRows[row].forEach(seat => {
          const seatBtn = document.createElement("button");
          seatBtn.className = "seat-btn";
          seatBtn.textContent = seat.label;
          seatBtn.dataset.label = seat.label;
          seatBtn.disabled = seat.is_booked;

          if (seat.is_booked) seatBtn.classList.add("booked");

          seatBtn.addEventListener("click", () => toggleSeat(seat));
          rowDiv.appendChild(seatBtn);
        });

        seatMapEl.appendChild(rowDiv);
      });

    const legend = document.createElement("div");
    legend.className = "seat-legend";
    legend.innerHTML = `
      <div><span class="seat-box available"></span> Available</div>
      <div><span class="seat-box selected"></span> Selected</div>
      <div><span class="seat-box booked"></span> Booked</div>
    `;
    seatMapEl.appendChild(legend);
  } catch (err) {
    console.error("Failed to load seats:", err);
    seatMapEl.innerHTML = "<p>Error loading seats.</p>";
  }
}

function toggleSeat(seat) {
  const index = selectedSeats.findIndex(s => s.seat_id === seat.id);
  if (index !== -1) {
    selectedSeats.splice(index, 1);
  } else {
    selectedSeats.push({
      seat_id: seat.id,
      label: seat.label,
      price: baseSeatPrice,
    });
  }
  refreshSeatSelection();
  updateTotalPrice();
}

function refreshSeatSelection() {
  const buttons = seatMapEl.querySelectorAll(".seat-btn:not(.booked)");
  buttons.forEach(btn => {
    const label = btn.dataset.label;
    const isSelected = selectedSeats.some(s => s.label === label);
    btn.classList.toggle("selected", isSelected);
  });
}

async function loadSnacks() {
  try {
    const { data } = await api.get("/get_snacks");
    const snacks = data.snacks;

    snacksListEl.innerHTML = "";

    snacks.forEach(snack => {
      const wrapper = document.createElement("div");
      wrapper.className = "snack-item";

      wrapper.innerHTML = `
        <img class="snack-image" src="${baseURL}${snack.image}" alt="${
        snack.name
      }" />
        <div class="snack-info">
          <label>${snack.name} ($${snack.price.toFixed(2)})</label>
          <input type="number" min="0" value="0"
            data-id="${snack.id}"
            data-price="${snack.price}" />
        </div>
      `;

      snacksListEl.appendChild(wrapper);
    });

    snacksListEl.addEventListener("input", handleSnackChange);
  } catch (err) {
    console.error("Failed to load snacks:", err);
  }
}

function handleSnackChange() {
  const inputs = snacksListEl.querySelectorAll("input[type='number']");
  selectedSnacks = [];

  inputs.forEach(input => {
    const quantity = parseInt(input.value);
    const snackId = parseInt(input.dataset.id);
    const price = parseFloat(input.dataset.price);

    if (quantity > 0) {
      selectedSnacks.push({ snack_id: snackId, quantity, price });
    }
  });

  updateTotalPrice();
}

function updateTotalPrice() {
  const seatTotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const snackTotal = selectedSnacks.reduce(
    (sum, s) => sum + s.quantity * s.price,
    0
  );
  const total = seatTotal + snackTotal;

  totalPriceEl.textContent = `$${total.toFixed(2)}`;
}

document
  .getElementById("submit-booking")
  .addEventListener("click", async () => {
    if (!userId || !showtimeId || selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    try {
      const payload = {
        user_id: parseInt(userId),
        showtime_id: parseInt(showtimeId),
        seat_ids: selectedSeats.map(s => s.seat_id),
        snacks: selectedSnacks.map(s => ({
          snack_id: s.snack_id,
          quantity: s.quantity,
        })),
        coupon_code: couponInput.value.trim() || null,
        payment_method: paymentSelect.value,
      };

      console.log(payload);
      const res = await api.post("/create_booking", payload);
      alert("Booking successful!");
      window.location.href = "/index.html";
    } catch (err) {
      console.error("Booking failed:", err);
      alert(
        "Booking failed: " +
          (err.response?.data?.message || "Unexpected error.")
      );
    }
  });

loadSeats();
loadSnacks();
