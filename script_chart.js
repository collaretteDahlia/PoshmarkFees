document.addEventListener('DOMContentLoaded', function() {
    // Get references to input elements
    const taxRateInput = document.getElementById('tax-rate');
    const taxRateDisplay = document.getElementById('tax-rate-display');
    
    // Set up the chart
    const ctx = document.getElementById('fee-chart').getContext('2d');

    // Set up the chart
    let feeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 201 }, (_, i) => i), // X values from 0 to 300
            datasets: [{
                label: 'New Buyer Fees / Seller Fees ($) (Note that both buyer and seller pay the same amount of fees under the new fee structure.)',
                data: [], // Initial empty data
                borderColor: 'blue',
                fill: false
            },
                {
                    label: 'Old Seller Fees (20% of Price) ($) (Note that old buyer fee is $0)',
                    data: [], // Initial empty data for old fee structure
                    borderColor: 'red',
                    fill: false
                },
                {
                    label: 'Total New Fees (Buyer + Seller) ($) (This equals 2*BuyerFees or 2*SellerFees or Buyer+Seller fees)',
                    data: [], // Initial empty data
                    borderColor: 'green',
                    fill: false
                }
                
        ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Item Price ($)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Fees ($)'
                    }
                }
            }
        }
    });

    // Set up the chart for percentage values
    const percentageCtx = document.getElementById('fee-percentage-chart').getContext('2d');
    let feePercentageChart = new Chart(percentageCtx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 201 }, (_, i) => i), // X values from 0 to 300
            datasets: [
                {
                    label: 'New Buyer Fees / Seller Fees (%)',
                    data: [], // Initial empty data for new fee structure percentage
                    borderColor: 'blue',
                    fill: false
                },
                {
                    label: 'Old Seller Fees (20% of Price) (%)',
                    data: [], // Initial empty data for old fee percentage
                    borderColor: 'red',
                    fill: false
                },
                {
                    label: 'Total New Fees (Buyer + Seller) (%)',
                    data: [], // Initial empty data for total new fees percentage
                    borderColor: 'green',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Item Price ($)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Fees as Percentage of Item Price (%)'
                    }
                }
            }
        }
    });


    // Fixed shipping fee
    const shippingFee = 7.97;


    function updateChartData() {
        const taxRate = parseFloat(taxRateInput.value) / 100;
    
        // Calculate the buyer/seller fees for each item price from 0 to 300
        const newFeeData = Array.from({ length: 201 }, (_, price) => {
            // const orderTotal = price + shippingFee;
            const preFeeTax = (price + shippingFee) * taxRate;
            const orderTotal = price + shippingFee + preFeeTax;
            let buyerFee = 0;

            if (orderTotal < 15) {
                buyerFee = 1 + 0.0599 * orderTotal;
            } else if (orderTotal < 50) {
                buyerFee = 2 + 0.0599 * orderTotal;
            } else {
                buyerFee = 3 + 0.0599 * orderTotal;
            }

            return buyerFee;
        });

        // Calculate the old seller fees for each item price from 0 to 200
        const oldFeeData = Array.from({ length: 201 }, (_, price) => 0.20 * price);
        // Calculate total new fees for each item price from 0 to 300 (new buyer fees + seller fees)
        const totalNewFeeData = newFeeData.map(fee => fee * 2);

        // Calculate percentages for each item price from 0 to 200
        const newFeePercentageData = Array.from({ length: 201 }, (_, price) => price === 0 ? 0 : (newFeeData[price] / price) * 100);
        const oldFeePercentageData = Array.from({ length: 201 }, (_, price) => price === 0 ? 0 : (oldFeeData[price] / price) * 100);
        const totalNewFeePercentageData = Array.from({ length: 201 }, (_, price) => price === 0 ? 0 : (totalNewFeeData[price] / price) * 100);

        // Update the chart data
        feeChart.data.datasets[0].data = newFeeData;
        feeChart.data.datasets[1].data = oldFeeData;
        feeChart.data.datasets[2].data = totalNewFeeData;

        feePercentageChart.data.datasets[0].data = newFeePercentageData;
        feePercentageChart.data.datasets[1].data = oldFeePercentageData;
        feePercentageChart.data.datasets[2].data = totalNewFeePercentageData;

        feeChart.update();
        feePercentageChart.update();
    }

    // Add event listeners for input changes
    
    taxRateInput.addEventListener('input', () => {
        taxRateDisplay.textContent = `${taxRateInput.value}%`;
        updateChartData(); 
    });

    // Add event listeners for quick sales tax buttons
    document.querySelectorAll('.quick-tax-btn').forEach(button => {
        button.addEventListener('click', () => {
            const taxRate = parseFloat(button.getAttribute('data-tax'));
            taxRateInput.value = taxRate;
            taxRateDisplay.textContent = `${taxRate}%`;
            updateChartData(); 
        });
    });
    
    // Initial calculation and chart update
    updateChartData();
});
