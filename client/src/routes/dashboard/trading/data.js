/**
 * agency data
 */

// chart config
import ChartConfig from 'Constants/chart-config';

// visitors data
export const visitorsData = {
    chartData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        data: [600, 500, 650, 470, 520, 700, 500, 650, 580, 500, 650, 700]
    },
    monthly: 7233,
    weekly: 5529
}

// sales data
export const salesData = {
    chartData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        data: [600, 500, 650, 470, 520, 700, 500, 650, 580, 500, 650, 700]
    },
    today: 6544,
    totalRevenue: 9125
}

// orders data
export const ordersData = {
    chartData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        data: [600, 500, 650, 470, 520, 700, 500, 650, 580, 500, 650, 700]
    },
    today: 5652,
    totalRevenue: 8520
}

// top selling products
export const topSellingProducts = {
    totalSales: '12,550',
    earning: '$35,000',
    products: [
        {
            id: 1,
            productName: 'HD Classic Gold Headphone',
            price: '300',
            productImage: require('Assets/img/device-1.jpg')
        },
        {
            id: 2,
            productName: 'HD Classic Gold Headphone',
            price: '300',
            productImage: require('Assets/img/device-2.jpg')
        },
        {
            id: 3,
            productName: 'HD Classic Gold Headphone',
            price: '300',
            productImage: require('Assets/img/device-3.jpg')
        }
    ]
}

// traffic Status
export const trafficStatus = {
    chartLabels: ['0.00', '1.0', '2.0', '3.0', '4.0', '5.0', '6.0'],
    chartDatasets: [
        {
            label: 'Series A',
            backgroundColor: ChartConfig.color.primary,
            borderColor: ChartConfig.color.primary,
            borderWidth: 1,
            hoverBackgroundColor: ChartConfig.color.primary,
            hoverBorderColor: ChartConfig.color.primary,
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: 'Series B',
            backgroundColor: ChartConfig.color.default,
            borderColor: ChartConfig.color.default,
            borderWidth: 1,
            hoverBackgroundColor: ChartConfig.color.default,
            hoverBorderColor: ChartConfig.color.default,
            data: [45, 39, 40, 60, 35, 25, 60]
        }
    ],
    onlineSources: '3500',
    today: '17,020',
    lastMonth: '20.30%'
}

// online visitors data
export const onlineVisitorsData = {
    markers: [
        { latLng: [41.90, 12.45], name: 'Vatican City' },
        { latLng: [43.73, 7.41], name: 'Monaco' },
        { latLng: [-0.52, 166.93], name: 'Nauru' },
        { latLng: [-8.51, 179.21], name: 'Tuvalu' },
        { latLng: [43.93, 12.46], name: 'San Marino' },
        { latLng: [47.14, 9.52], name: 'Liechtenstein' },
        { latLng: [7.11, 171.06], name: 'Marshall Islands' },
        { latLng: [17.3, -62.73], name: 'Saint Kitts and Nevis' },
        { latLng: [3.2, 73.22], name: 'Maldives' },
        { latLng: [35.88, 14.5], name: 'Malta' },
        { latLng: [12.05, -61.75], name: 'Grenada' },
        { latLng: [13.16, -61.23], name: 'Saint Vincent and the Grenadines' },
        { latLng: [13.16, -59.55], name: 'Barbados' },
        { latLng: [17.11, -61.85], name: 'Antigua and Barbuda' },
        { latLng: [-4.61, 55.45], name: 'Seychelles' },
        { latLng: [7.35, 134.46], name: 'Palau' },
        { latLng: [42.5, 1.51], name: 'Andorra' },
        { latLng: [14.01, -60.98], name: 'Saint Lucia' },
        { latLng: [6.91, 158.18], name: 'Federated States of Micronesia' },
        { latLng: [1.3, 103.8], name: 'Singapore' },
        { latLng: [1.46, 173.03], name: 'Kiribati' },
        { latLng: [-21.13, -175.2], name: 'Tonga' },
        { latLng: [15.3, -61.38], name: 'Dominica' },
        { latLng: [-20.2, 57.5], name: 'Mauritius' },
        { latLng: [26.02, 50.55], name: 'Bahrain' },
        { latLng: [0.33, 6.73], name: 'São Tomé and Príncipe' }
    ],
    totalVisitors: '1655'
}


//marketData 

export const marketData = [
    {
        "firstCurrency": "LTC",
        "secondCurrency": "BTC",
        "name": "LiteCoin",
        "price": 0.15848,
        "change": 0.000021,
        "high": 0.15933,
        "low": 0.15677,
        "volume": 2311.69
    }
]


//marketData 

export const myHoldings = [
    {
        "currency": "BitCoin",
        "symbol": "BTC",
        "balance": 34.645545,
        "buying": 0.15848,
        "price": 0.000021,
        "profit_lose": 0.15933,
        "current_value": 0.15677,
        "buyin_date": "2015-02-20"
    },
    {
        "currency": "BitCoin",
        "symbol": "BTC",
        "balance": 34.645545,
        "buying": 0.15848,
        "price": 0.000021,
        "profit_lose": 0.15933,
        "current_value": 0.15677,
        "buyin_date": "2015-02-20"
    },
    {
        "currency": "BitCoin",
        "symbol": "BTC",
        "balance": 34.645545,
        "buying": 0.15848,
        "price": 0.000021,
        "profit_lose": 0.15933,
        "current_value": 0.15677,
        "buyin_date": "2015-02-20"
    },
    {
        "currency": "BitCoin",
        "symbol": "BTC",
        "balance": 34.645545,
        "buying": 0.15848,
        "price": 0.000021,
        "profit_lose": 0.15933,
        "current_value": 0.15677,
        "buyin_date": "2015-02-20"
    }

]


//marketData 

export const pairListData = [
    {
        "pair": "LTC/BTC",
        "price": 0.000021,
        "change": 0.15933,
        "volume": 0.15677,
    },
    {
        "pair": "BNT/BTC",
        "price": 0.000021,
        "change": 0.15933,
        "volume": 0.15677,
    },
    {
        "pair": "DLT/BTC",
        "price": 0.000021,
        "change": -0.15933,
        "volume": 0.15677,
    },
    {
        "pair": "COT/BTC",
        "price": 0.000021,
        "change": -0.15933,
        "volume": 0.15677,
    }

]

//marketData 

export const sellOrderData = [
    {
        "price": 0.000021,
        "amount": 0.15933,
        "total": 0.15677,
    },
    {
        "price": 0.000021,
        "amount": 0.15933,
        "total": 0.15677,
    },
    {
        "price": 0.000021,
        "amount": -0.15933,
        "total": 0.15677,
    },
    {
        "price": 0.000021,
        "amount": -0.15933,
        "total": 0.15677,
    }

]

//marketData 

export const buyOrderData = [
    {
        "price": 0.000021,
        "amount": 0.15933,
        "total": 0.15677,
    },
    {
        "price": 0.000021,
        "amount": 0.15933,
        "total": 0.15677,
    },
    {
        "price": 0.000021,
        "amount": -0.15933,
        "total": 0.15677,
    },
    {
        "price": 0.000021,
        "amount": -0.15933,
        "total": 0.15677,
    }
]


//marketData 

export const MarketTradeData = [
    {
        "price": 0.000021,
        "amount": 0.15933,
        "time": "18:09:50",
    },
    {
        "price": 0.000021,
        "amount": 0.15933,
        "time": "18:09:50",
    },
    {
        "price": 0.000021,
        "amount": -0.15933,
        "time": "18:09:50",
    },
    {
        "price": 0.000021,
        "amount": -0.15933,
        "time": "18:09:50",
    }
]

//marketData 

export const OpenOrderData = [
    {
        "pair": "LTC/BTC",
        "price": 0.000021,
        "type": "Buy",
        "amount": 0.15933,
        "total": 0.15677,
        "date": "2015-02-20",
        "filled": "15%"

    },
    {
        "pair": "LTC/BTC",
        "price": 0.000021,
        "type": "Buy",
        "amount": 0.15933,
        "total": 0.15677,
        "date": "2015-02-20",
        "filled": "15%"

    },
    {
        "pair": "LTC/BTC",
        "price": 0.000021,
        "type": "Buy",
        "amount": 0.15933,
        "total": 0.15677,
        "date": "2015-02-20",
        "filled": "15%"

    },
    {
        "pair": "LTC/BTC",
        "price": 0.000021,
        "type": "Buy",
        "amount": 0.15933,
        "total": 0.15677,
        "date": "2015-02-20",
        "filled": "15%"

    },
]

//marketData 

export const MyOrderData = [
    {
        "pair": "LTC/BTC",
        "price": 0.000021,
        "type": "Buy",
        "amount": 0.15933,
        "total": 0.15677,
        "date": "2015-02-20",
        "status": "Open",
        "fee": 0.00
    },
    {
        "pair": "LTC/BTC",
        "price": 0.000021,
        "type": "Buy",
        "amount": 0.15933,
        "total": 0.15677,
        "date": "2015-02-20",
        "status": "Open",
        "fee": 0.00
    },
    {
        "pair": "LTC/BTC",
        "price": 0.000021,
        "type": "Buy",
        "amount": 0.15933,
        "total": 0.15677,
        "date": "2015-02-20",
        "status": "Open",
        "fee": 0.00
    },
    {
        "pair": "LTC/BTC",
        "price": 0.000021,
        "type": "Buy",
        "amount": 0.15933,
        "total": 0.15677,
        "date": "2015-02-20",
        "status": "Open",
        "fee": 0.00
    },
    {
        "pair": "LTC/BTC",
        "price": 0.000021,
        "type": "Buy",
        "amount": 0.15933,
        "total": 0.15677,
        "date": "2015-02-20",
        "status": "Open",
        "fee": 0.00
    }
]

// total sales
export const totalSales = {
    label: 'Sales',
    chartdata: [250, 310, 150, 420, 250, 450],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'],
}

// net profit
export const netProfit = {
    label: 'Net Profit',
    chartdata: [250, 310, 150, 420, 250, 450],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'],
}

// tax stats
export const taxStats = {
    label: 'Tax',
    chartdata: [250, 310, 150, 420, 250, 450],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'],
}

// expenses stats
export const expenses = {
    label: 'Expenses',
    chartdata: [250, 310, 150, 420, 250, 450],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'],
}

// expenses stats
export const tickersData = {
    totalInvestmentCurrency: 24.6540000,
    totalInvestmentBalance: 24.6540000,

    currentBalancecurrency: 24.6540000,
    currentBalance: 24.6540000,

    profitFiatCurrency: 24.6540000,
    profitFiatCurrencyBalance: 24.6540000,

    profitCurrency: 24.6540000,
    profitCurrencyBalance: 24.6540000,
}


// news tikcer data
export const newsText = {
    text: 'Welcome to New Era of Trading'
}