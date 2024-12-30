$(document).ready(function() {
    $('.ban-unban-btn').click(function() {
        const button = $(this);
        const accountId = button.data('id');
        const currentStatus = button.data('status');
        const newStatus = currentStatus === 'Inactive' ? 'Active' : 'Inactive';

        $.ajax({
            url: `/account/${accountId}`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ status: newStatus }),
            success: function(data) {
                button.text(newStatus === 'Inactive' ? 'Unban' : 'Ban');
                button.data('status', newStatus);
                button.closest('tr').find('td:nth-child(6)').text(newStatus);
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    });
});