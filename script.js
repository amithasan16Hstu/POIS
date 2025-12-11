let items = [];
let total = 0;
let shopID = Math.floor(Math.random() * 1000000); // Generate a random Shop ID
let customerName = '';
let customerMobile = '';

document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();

    let shopName = document.getElementById('shopName').value;
    let mobileNumber = document.getElementById('mobileNumber').value;

    if (shopName && mobileNumber) {
        // Display shop name and generated ID
        document.getElementById('displayShopName').textContent = shopName;
        document.getElementById('displayShopID').textContent = `#${shopID}`;

        // Show Shop Info and Hide Registration Form
        document.getElementById('shopInfo').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
    } else {
        alert('Please enter valid shop details.');
    }
});

document.getElementById('customerForm').addEventListener('submit', function (event) {
    event.preventDefault();

    customerName = document.getElementById('customerName').value;
    customerMobile = document.getElementById('customerMobile').value;

    if (customerName && customerMobile) {
        alert('Customer information saved successfully!');
    } else {
        alert('Please enter valid customer details.');
    }
});

document.getElementById('cashMemoForm').addEventListener('submit', function (event) {
    event.preventDefault();

    let itemName = document.getElementById('itemName').value;
    let itemPrice = parseFloat(document.getElementById('itemPrice').value);
    let itemQuantity = parseInt(document.getElementById('itemQuantity').value);

    if (itemName && itemPrice && itemQuantity) {
        let itemTotal = itemPrice * itemQuantity;

        items.push({ name: itemName, price: itemPrice, quantity: itemQuantity, total: itemTotal });
        updateItemsTable();
        updateTotal();
    } else {
        alert('Please enter valid item details.');
    }
});

function updateItemsTable() {
    let tbody = document.getElementById('itemsTableBody');
    tbody.innerHTML = '';

    items.forEach(item => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
            <td>${item.total}</td>
        `;
        tbody.appendChild(row);
    });
}

function updateTotal() {
    total = items.reduce((sum, item) => sum + item.total, 0);

    let discount = parseFloat(document.getElementById('discount').value) || 0;
    let vat = parseFloat(document.getElementById('vat').value) || 0;

    let discountedTotal = total - (total * discount / 100);
    let vatAmount = discountedTotal * vat / 100;  // Calculate VAT amount
    let finalTotal = discountedTotal + vatAmount;  // Final total including VAT

    document.getElementById('totalAmount').textContent = finalTotal.toFixed(2);
    document.getElementById('vatAmount').textContent = vatAmount.toFixed(2);  // Display VAT amount
}

// Generate and download receipt as PDF with celebration animation
document.getElementById('downloadSlip').addEventListener('click', function () {
    // Trigger confetti animation for celebration
    confetti({
        particleCount: 200,
        spread: 70,
        origin: { x: 0.5, y: 0.5 }
    });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add shop details
    doc.setFontSize(16);
    doc.text(`Shop Name: ${document.getElementById('displayShopName').textContent}`, 10, 20);
    doc.text(`Shop ID: ${document.getElementById('displayShopID').textContent}`, 10, 30);
    doc.text(`Mobile: ${document.getElementById('mobileNumber').value}`, 10, 40);

    doc.text('----------------------------------------', 10, 50);

    // Add customer details
    doc.text(`Customer Name: ${customerName}`, 10, 60);
    doc.text(`Customer Mobile: ${customerMobile}`, 10, 70);

    doc.text('----------------------------------------', 10, 80);

    // Add item details
    doc.setFontSize(12);
    let y = 90;
    items.forEach(item => {
        doc.text(`Item: ${item.name}`, 10, y);
        doc.text(`Price: ${item.price} ৳`, 100, y);
        doc.text(`Quantity: ${item.quantity}`, 140, y);
        doc.text(`Total: ${item.total} ৳`, 180, y);
        y += 10;
    });

    // Add discount and VAT details
    doc.text('----------------------------------------', 10, y);
    y += 10;
    doc.text(`Discount: ${document.getElementById('discount').value}%`, 10, y);
    doc.text(`VAT: ${document.getElementById('vat').value}%`, 100, y);
    y += 10;
    doc.text(`VAT Amount: ${document.getElementById('vatAmount').textContent} ৳`, 10, y);
    doc.text(`Total Amount: ${document.getElementById('totalAmount').textContent} ৳`, 100, y);

    // Save the PDF
    doc.save('cash-memo.pdf');
});
