document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fee-chart').style.display = 'none';
    document.getElementById('fee-percentage-chart').style.display = 'none';

    
    // Get references to input elements
    const orderPriceInput = document.getElementById('order-price');
    const taxRateInput = document.getElementById('tax-rate');
    const taxRateDisplay = document.getElementById('tax-rate-display');
    
    // Get references to output elements
    const preFeeTaxOutput = document.getElementById('pre-fee-tax');
    const orderTotalOutput = document.getElementById('order-total');
    const buyerFeeOutput = document.getElementById('buyer-fee');
    const sellerFeeOutput = document.getElementById('seller-fee');
    const afterFeeTaxOutput = document.getElementById('after-fee-tax');
    const totalPaidByBuyerOutput = document.getElementById('total-paid-by-buyer');
    const totalEarnedBySellerOutput = document.getElementById('total-earned-by-seller');

    // Get references to formula elements
    const preFeeTaxFormula = document.getElementById('pre-fee-tax-formula');
    const orderTotalFormula = document.getElementById('order-total-formula');
    const buyerFeeFormula = document.getElementById('buyer-fee-formula');
    const sellerFeeFormula = document.getElementById('seller-fee-formula');
    const afterFeeTaxFormula = document.getElementById('after-fee-tax-formula');
    const totalPaidByBuyerFormula = document.getElementById('total-paid-by-buyer-formula');
    const totalEarnedBySellerFormula = document.getElementById('total-earned-by-seller-formula');
    const totalFeesCollectedNewOutput = document.getElementById('total-fees-collected-new');

    // Get references to old fee system output elements
    const oldSellerFeeOutput = document.getElementById('old-seller-fee');
    const oldBuyerFeeOutput = document.getElementById('old-buyer-fee');
    const oldTotalPaidByBuyerOutput = document.getElementById('old-total-paid-by-buyer');
    const oldTotalEarnedBySellerOutput = document.getElementById('old-total-earned-by-seller');
    const totalFeesCollectedOldOutput = document.getElementById('total-fees-collected-old');

    // Get references to old fee system formula elements
    const oldSellerFeeFormula = document.getElementById('old-seller-fee-formula');
    const oldBuyerFeeFormula = document.getElementById('old-buyer-fee-formula');
    const oldTotalPaidByBuyerFormula = document.getElementById('old-total-paid-by-buyer-formula');
    const oldTotalEarnedBySellerFormula = document.getElementById('old-total-earned-by-seller-formula');

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

    // Function to calculate and display values
    function calculateValues() {
        const orderPrice = parseFloat(orderPriceInput.value);
        const taxRate = parseFloat(taxRateInput.value) / 100;

        // Calculate pre-fee sales tax
        const preFeeTax = (orderPrice + shippingFee) * taxRate;

        // Calculate order total
        const orderTotal = orderPrice + shippingFee + preFeeTax;

        // Calculate fees based on order total
        let buyerFee = 0;
        if (orderTotal < 15) {
            buyerFee = 1 + 0.0599 * orderTotal;
        } else if (orderTotal < 50) {
            buyerFee = 2 + 0.0599 * orderTotal;
        } else {
            buyerFee = 3 + 0.0599 * orderTotal;
        }

        const sellerFee = buyerFee; // Same as buyer fee

        // Calculate after-fee sales tax for buyer
        const afterFeeTax = (orderPrice + shippingFee + buyerFee) * taxRate;

        // Calculate total paid by buyer
        const totalPaidByBuyer = orderPrice + shippingFee + buyerFee + afterFeeTax;

        // Calculate total earned by seller
        const totalEarnedBySeller = orderPrice - sellerFee;

        // Calculate new total fees collected by Poshmark (new system)
        const totalFeesCollectedNew = buyerFee + sellerFee;

        // Display outputs
        preFeeTaxOutput.textContent = preFeeTax.toFixed(2);
        orderTotalOutput.textContent = orderTotal.toFixed(2);
        buyerFeeOutput.textContent = buyerFee.toFixed(2);
        sellerFeeOutput.textContent = sellerFee.toFixed(2);
        afterFeeTaxOutput.textContent = afterFeeTax.toFixed(2);
        totalPaidByBuyerOutput.textContent = totalPaidByBuyer.toFixed(2);
        totalEarnedBySellerOutput.textContent = totalEarnedBySeller.toFixed(2);

        // Display formulas
        preFeeTaxFormula.textContent = `Pre-fee Sales Tax = (Order Price + Shipping Fee) * Tax Rate = (${orderPrice.toFixed(2)} + ${shippingFee.toFixed(2)}) * ${taxRateInput.value}%`;
        orderTotalFormula.textContent = `Order Total = Order Price + Shipping Fee + Pre-fee Sales Tax = ${orderPrice.toFixed(2)} + ${shippingFee.toFixed(2)} + ${preFeeTax.toFixed(2)}`;
        buyerFeeFormula.textContent = `Buyer Fee = ${orderTotal < 15 ? "1 + 0.0599 * Order Total" : orderTotal < 50 ? "2 + 0.0599 * Order Total" : "3 + 0.0599 * Order Total"} = ${buyerFee.toFixed(2)}`;
        sellerFeeFormula.textContent = `Seller Fee = Buyer Fee = ${buyerFee.toFixed(2)}`;
        afterFeeTaxFormula.textContent = `After-fee Sales Tax = (Order Price + Shipping Fee + Buyer Fee) * Tax Rate = (${orderPrice.toFixed(2)} + ${shippingFee.toFixed(2)} + ${buyerFee.toFixed(2)}) * ${taxRateInput.value}%`;
        totalPaidByBuyerFormula.textContent = `Total Paid by Buyer = Order Price + Shipping Fee + Buyer Fee + After-fee Sales Tax = ${orderPrice.toFixed(2)} + ${shippingFee.toFixed(2)} + ${buyerFee.toFixed(2)} + ${afterFeeTax.toFixed(2)}`;
        totalEarnedBySellerFormula.textContent = `Total Earned by Seller = Order Price - Seller Fee = ${orderPrice.toFixed(2)} - ${sellerFee.toFixed(2)}`;
        totalFeesCollectedNewOutput.textContent = totalFeesCollectedNew.toFixed(2); // New total fees

        // Old Seller Fee (20% of order price)
        const oldSellerFee = 0.20 * orderPrice;
        // Old total fees collected by Poshmark (old system)
        const totalFeesCollectedOld = oldSellerFee;
        // Old Buyer Fee (0 in the old system)
        const oldBuyerFee = 0;
        // Old Total Paid by Buyer = (order price + shipping fee) * (1 + tax rate)
        const oldTotalPaidByBuyer = (orderPrice + shippingFee) * (1 + taxRate);
        // Old Total Earned by Seller = order price * 80%
        const oldTotalEarnedBySeller = orderPrice * 0.80;
        // Display Old Fee System Outputs
        oldSellerFeeOutput.textContent = oldSellerFee.toFixed(2);
        oldBuyerFeeOutput.textContent = oldBuyerFee.toFixed(2);
        oldTotalPaidByBuyerOutput.textContent = oldTotalPaidByBuyer.toFixed(2);
        oldTotalEarnedBySellerOutput.textContent = oldTotalEarnedBySeller.toFixed(2);

        // Display Old Fee System Formulas
        oldSellerFeeFormula.textContent = `Old Seller Fee = 20% of Order Price = 0.20 * ${orderPrice.toFixed(2)} = ${oldSellerFee.toFixed(2)}`;
        oldBuyerFeeFormula.textContent = `Old Buyer Fee = $0 (no buyer fee)`;
        oldTotalPaidByBuyerFormula.textContent = `Old Total Paid by Buyer = (Order Price + Shipping Fee) * (1 + Tax Rate) = (${orderPrice.toFixed(2)} + ${shippingFee.toFixed(2)}) * (1 + ${taxRateInput.value}%) = ${oldTotalPaidByBuyer.toFixed(2)}`;
        oldTotalEarnedBySellerFormula.textContent = `Old Total Earned by Seller = Order Price * 80% = ${orderPrice.toFixed(2)} * 0.80 = ${oldTotalEarnedBySeller.toFixed(2)}`;
        // Display old outputs
        oldSellerFeeOutput.textContent = oldSellerFee.toFixed(2);
        totalFeesCollectedOldOutput.textContent = totalFeesCollectedOld.toFixed(2); // Old total fees

        // Update the chart
        updateChartData();
        
    }

    // Add event listeners for input changes
    orderPriceInput.addEventListener('input', calculateValues);
    taxRateInput.addEventListener('input', () => {
        taxRateDisplay.textContent = `${taxRateInput.value}%`;
        calculateValues();
        updateChartData(); 
    });

    // Add event listeners for quick price buttons
    document.querySelectorAll('.quick-price-btn').forEach(button => {
        button.addEventListener('click', () => {
            const price = parseFloat(button.getAttribute('data-price'));
            orderPriceInput.value = price;
            calculateValues();
        });
    });

    // Add event listeners for quick sales tax buttons
    document.querySelectorAll('.quick-tax-btn').forEach(button => {
        button.addEventListener('click', () => {
            const taxRate = parseFloat(button.getAttribute('data-tax'));
            taxRateInput.value = taxRate;
            taxRateDisplay.textContent = `${taxRate}%`;
            calculateValues();
            updateChartData(); 
        });
    });
    
    // Initial calculation and chart update
    calculateValues();
    updateChartData();
});
