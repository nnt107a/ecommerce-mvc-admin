$(document).ready(function() {
  function updateTotal() {
    let total = 10;
    $('.total').each(function() {
      total += parseFloat($(this).text().replace('$', ''));
    });
    const subTotal = total - 10.00;
    $('.sub-value').text('$' + subTotal.toFixed(2));
    $('.total-value').text('$' + total.toFixed(2));
  }

  updateTotal();

  $('.remove-from-cart').click(function() {
    const productId = $(this).data('product-id');
    const row = $(this).closest('tr');

    $.ajax({
      url: '/cart-remove-product',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ productId: productId }),
      success: function(response) {
        row.remove();
        updateTotal();
      },
      error: function(error) {
        alert('Error removing product from cart.');
      }
    });
  });

  $('.btn-minus').off('click').on('click', function() {
    const productId = $(this).data('product-id');
    const productPrice = $(this).data('product-price');
    const input = $(this).closest('.quantity').find('input');
    let quantity = parseInt(input.val());
    console.log(productId);

    if (quantity > 1) {
      quantity--;
      input.val(quantity);

      $.ajax({
        url: '/cart-update',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({product: { product_id: productId, quantity: quantity, price: productPrice, type: 1 }}),
        success: function(response) {
          const row = input.closest('tr');
          const price = parseFloat(row.find('td:nth-child(2)').text().replace('$', ''));
          row.find('.total').text('$' + (price * quantity).toFixed(2));
          updateTotal();
        },
        error: function(error) {
          alert('Error updating cart.');
        }
      });
    }
  }); // 300ms delay

  $('.btn-plus').off('click').on('click', function() {
    const productId = $(this).data('product-id');
    const productPrice = $(this).data('product-price');
    const input = $(this).closest('.quantity').find('input');
    let quantity = parseInt(input.val());
    
    console.log(productId);

    quantity++;
    input.val(quantity);

    $.ajax({
      url: '/cart-update',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({product: { product_id: productId, quantity: quantity, price: productPrice, type: 1 }}),
      success: function(response) {
        const row = input.closest('tr');
        const price = parseFloat(row.find('td:nth-child(2)').text().replace('$', ''));
        row.find('.total').text('$' + (price * quantity).toFixed(2));
        updateTotal();
      },
      error: function(error) {
        alert('Error updating cart.');
      }
    });
  }); // 300ms delay

  // Update the hidden input with the total value before form submission
  $('#cart-summary-form').submit(function() {
    const totalValue = $('.total-value').last().text().replace('$', '');
    $('#totalPrice').val(totalValue);
  });
});
