let revenueChart1;
let revenueChart2;

$(document).ready(function() {
    function fetchRevenueReport(timeRange) {
        $.ajax({
            url: '/home/revenue',
            type: 'GET',
            data: { timeRange: timeRange },
            success: function(data) {
                const labels = data.map(report => report.timeRange);
                const revenues = data.map(report => report.totalRevenue);

                console.log(labels);
                console.log(revenues);

                const ctx = document.getElementById('revenue-chart').getContext('2d');

                // Destroy the existing chart instance if it exists
                if (revenueChart1) {
                    revenueChart1.destroy();
                }

                const backgroundColors = revenues.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`);
                const borderColors = revenues.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`);

                // Create a new chart instance
                revenueChart1 = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Total Revenue',
                            data: revenues,
                            backgroundColor: backgroundColors,
                            borderColor: borderColors,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        barThickness: 123
                    }
                });
            },
        });
    }

    function fetchTopRevenueProducts(timeRange) {
        $.ajax({
            url: '/home/top-product',
            type: 'GET',
            data: { timeRange: timeRange },
            success: function(data) {
                const labels = data.map(product => product.productName);
                const revenues = data.map(product => product.totalRevenue);

                console.log(labels);
                console.log(revenues);

                const ctx = document.getElementById('top-product-revenue-chart').getContext('2d');

                // Destroy the existing chart instance if it exists
                if (revenueChart2) {
                    revenueChart2.destroy();
                }

                // Generate random colors for each column
                const backgroundColors = revenues.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`);
                const borderColors = revenues.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`);

                // Create a new chart instance
                revenueChart2 = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Total Revenue',
                            data: revenues,
                            backgroundColor: backgroundColors,
                            borderColor: borderColors,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        barThickness: 123
                    }
                });
            },
        });
    }

    // Auto-fetch the revenue report when the page loads
    fetchRevenueReport('day'); // Default time range
    fetchTopRevenueProducts('day'); // Default time range

    // Handle form submission to fetch the revenue report based on selected time range
    $('#revenue-report-form').submit(function(event) {
        event.preventDefault();
        const timeRange = $(this).find('select[name="timeRange"]').val();
        fetchRevenueReport(timeRange);
    });

    $('#top-revenue-product-form').submit(function(event) {
        event.preventDefault();
        const timeRange = $(this).find('select[name="timeRange"]').val();
        fetchTopRevenueProducts(timeRange);
    });
});