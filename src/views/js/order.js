$(document).ready(function() {
    $('.order-status').change(function() {
        const orderId = $(this).data('order-id');
        const newStatus = $(this).val();

        $.ajax({
            url: `/order/${orderId}`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ status: newStatus }),
            success: function(response) {
            },
            error: function(error) {
                console.error('Error:', error);
                alert('An error occurred while updating the order status');
            }
        });
    });
});