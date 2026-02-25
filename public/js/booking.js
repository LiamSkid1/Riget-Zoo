console.log('booking.js loaded');

// Check if user is logged in and display their info
const userId = localStorage.getItem('userId');
const userEmail = localStorage.getItem('userEmail');
const userEmailDisplay = document.getElementById('userEmailDisplay');
const userPointsDisplay = document.getElementById('userPointsDisplay');

if (!userId || !userEmail) {
    // User is not logged in - redirect to login page
    alert('Please log in to make bookings!');
    window.location.href = 'login.html';
} else {
    // Display user email
    userEmailDisplay.textContent = userEmail;
    
    // Fetch and display current loyalty points
    fetchUserPoints();
}

// Function to fetch user's current loyalty points
async function fetchUserPoints() {
    try {
        const response = await fetch(`/api/user/${userId}`);
        if (response.ok) {
            const data = await response.json();
            userPointsDisplay.textContent = data.loyaltyPoints || 0;
        }
    } catch (error) {
        console.error('Error fetching user points:', error);
    }
}

// Price mappings
const ticketPrices = {
    "Adult": 25.00,
    "Child": 15.00,
    "Senior": 20.00,
    "Family": 70.00
};

const roomPrices = {
    "Standard": 100.00,
    "Deluxe": 150.00,
    "Suite": 250.00,
    "Family": 180.00
};

// Get all ticket quantity inputs
const adultQtyInput = document.getElementById('adultQty');
const childQtyInput = document.getElementById('childQty');
const seniorQtyInput = document.getElementById('seniorQty');
const familyQtyInput = document.getElementById('familyQty');
const totalTicketsDisplay = document.getElementById('totalTickets');
const zooTotalDisplay = document.getElementById('zooTotal');
const zooPointsDisplay = document.getElementById('zooPoints');

// Update zoo calculation when any quantity changes
function updateZooCalculation() {
    const adultQty = parseInt(adultQtyInput.value) || 0;
    const childQty = parseInt(childQtyInput.value) || 0;
    const seniorQty = parseInt(seniorQtyInput.value) || 0;
    const familyQty = parseInt(familyQtyInput.value) || 0;

    // Calculate total tickets
    const totalTickets = adultQty + childQty + seniorQty + familyQty;

    // Calculate total price
    const totalPrice = 
        (adultQty * ticketPrices.Adult) +
        (childQty * ticketPrices.Child) +
        (seniorQty * ticketPrices.Senior) +
        (familyQty * ticketPrices.Family);

    // Calculate points (10 points per £1)
    const points = totalPrice * 10;

    // Update displays
    totalTicketsDisplay.textContent = totalTickets;
    zooTotalDisplay.textContent = totalPrice.toFixed(2);
    zooPointsDisplay.textContent = points;
}

// Add event listeners to all quantity inputs
adultQtyInput.addEventListener('input', updateZooCalculation);
childQtyInput.addEventListener('input', updateZooCalculation);
seniorQtyInput.addEventListener('input', updateZooCalculation);
familyQtyInput.addEventListener('input', updateZooCalculation);

// Update hotel total and points when room type or dates change
const roomTypeSelect = document.getElementById('roomType');
const checkInInput = document.getElementById('checkIn');
const checkOutInput = document.getElementById('checkOut');
const hotelTotalDisplay = document.getElementById('hotelTotal');
const hotelPointsDisplay = document.getElementById('hotelPoints');

function updateHotelCalculation() {
    const selectedRoom = roomTypeSelect.value;
    const checkIn = new Date(checkInInput.value);
    const checkOut = new Date(checkOutInput.value);

    if (selectedRoom && checkInInput.value && checkOutInput.value && checkOut > checkIn) {
        const pricePerNight = roomPrices[selectedRoom];
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const totalPrice = pricePerNight * nights;
        const points = totalPrice * 20; // 20 points per £1 for hotels

        hotelTotalDisplay.textContent = totalPrice.toFixed(2);
        hotelPointsDisplay.textContent = points;
    } else {
        hotelTotalDisplay.textContent = '0.00';
        hotelPointsDisplay.textContent = '0';
    }
}

roomTypeSelect.addEventListener('change', updateHotelCalculation);
checkInInput.addEventListener('change', updateHotelCalculation);
checkOutInput.addEventListener('change', updateHotelCalculation);


// ZOO BOOKING FORM SUBMISSION
const zooBookingForm = document.getElementById('zooBookingForm');
const zooMessage = document.getElementById('zooMessage');

zooBookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const adultQty = parseInt(adultQtyInput.value) || 0;
    const childQty = parseInt(childQtyInput.value) || 0;
    const seniorQty = parseInt(seniorQtyInput.value) || 0;
    const familyQty = parseInt(familyQtyInput.value) || 0;

    // Check if at least one ticket is selected
    const totalTickets = adultQty + childQty + seniorQty + familyQty;
    if (totalTickets === 0) {
        zooMessage.textContent = 'Please select at least one ticket!';
        zooMessage.className = 'booking-message error';
        return;
    }

    // Build ticket type string
    const ticketTypes = [];
    if (adultQty > 0) ticketTypes.push(`${adultQty} Adult`);
    if (childQty > 0) ticketTypes.push(`${childQty} Child`);
    if (seniorQty > 0) ticketTypes.push(`${seniorQty} Senior`);
    if (familyQty > 0) ticketTypes.push(`${familyQty} Family`);
    const ticketTypeString = ticketTypes.join(', ');

    // Calculate total price
    const totalPrice = 
        (adultQty * ticketPrices.Adult) +
        (childQty * ticketPrices.Child) +
        (seniorQty * ticketPrices.Senior) +
        (familyQty * ticketPrices.Family);

    const visitDate = document.getElementById('visitDate').value;

    const bookingData = {
        userId: userId,
        ticketType: ticketTypeString,
        price: totalPrice,
        visitDate: visitDate
    };

    try {
        const response = await fetch('/api/book-zoo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();

        if (response.ok) {
            zooMessage.textContent = `${data.message} You earned ${data.pointsAdded} points!`;
            zooMessage.className = 'booking-message success';
            zooBookingForm.reset();
            updateZooCalculation(); // Reset displays
            
            // Refresh the loyalty points display
            fetchUserPoints();
        } else {
            zooMessage.textContent = data.message;
            zooMessage.className = 'booking-message error';
        }
    } catch (error) {
        console.error('Booking error:', error);
        zooMessage.textContent = 'Booking failed. Please try again.';
        zooMessage.className = 'booking-message error';
    }
});


// HOTEL BOOKING FORM SUBMISSION
const hotelBookingForm = document.getElementById('hotelBookingForm');
const hotelMessage = document.getElementById('hotelMessage');

hotelBookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const roomType = roomTypeSelect.value;
    const checkIn = checkInInput.value;
    const checkOut = checkOutInput.value;
    const totalPrice = parseFloat(hotelTotalDisplay.textContent);

    const bookingData = {
        userId: userId,
        roomType: roomType,
        totalPrice: totalPrice,
        checkIn: checkIn,
        checkOut: checkOut
    };

    try {
        const response = await fetch('/api/book-hotel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();

        if (response.ok) {
            hotelMessage.textContent = `${data.message} You earned ${data.pointsAdded} points!`;
            hotelMessage.className = 'booking-message success';
            hotelBookingForm.reset();
            hotelTotalDisplay.textContent = '0.00';
            hotelPointsDisplay.textContent = '0';
            
            // Refresh the loyalty points display
            fetchUserPoints();
        } else {
            hotelMessage.textContent = data.message;
            hotelMessage.className = 'booking-message error';
        }
    } catch (error) {
        console.error('Booking error:', error);
        hotelMessage.textContent = 'Hotel booking failed. Please try again.';
        hotelMessage.className = 'booking-message error';
    }
});