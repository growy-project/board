import React, { useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface SalesData {
    date: string;
    earnings: number;
    expenses: number;
}

const SalesOverview = () => {
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    const [month, setMonth] = useState('1');

    const mockSalesData: { [key: string]: SalesData[] } = { // Mock data
        '1': [
            { date: '16/08', earnings: 355, expenses: 280 },
            { date: '17/08', earnings: 390, expenses: 250 },
            { date: '18/08', earnings: 300, expenses: 325 },
            { date: '19/08', earnings: 350, expenses: 215 },
            { date: '20/08', earnings: 390, expenses: 250 },
            { date: '21/08', earnings: 180, expenses: 310 },
            { date: '22/08', earnings: 355, expenses: 280 },
            { date: '23/08', earnings: 390, expenses: 250 },
        ],
        '2': [ // Example data for another month
            { date: '16/09', earnings: 400, expenses: 300 },
            { date: '17/09', earnings: 450, expenses: 280 },
            // ... more data
        ],
        '3': [
            { date: '16/10', earnings: 420, expenses: 320 },
            { date: '17/10', earnings: 470, expenses: 300 },
            // ... more data
        ]
    };

    const salesData = mockSalesData[month] || []; // Get data for selected month or empty array

    const handleChange = (event: any) => {
        setMonth(event.target.value);
    };

    const optionslinechart = {
        // ... (chart options - same as before)
        xaxis: {
            categories: salesData.map(item => item.date),
            title: { text: 'Date' },
        },
        yaxis: {
            title: { text: 'Amount' },
        },
        // ...
    };

    const serieslinechart = [
        {
            name: 'Earnings',
            data: salesData.map(item => item.earnings),
        },
        {
            name: 'Expenses',
            data: salesData.map(item => item.expenses),
        },
    ];


    return (
        <DashboardCard title="Sales Overview" action={
            <Select
                labelId="month-dd"
                id="month-dd"
                value={month}
                size="small"
                onChange={handleChange}
            >
                <MenuItem value={'1'}>March 2023</MenuItem>
                <MenuItem value={'2'}>April 2023</MenuItem>
                <MenuItem value={'3'}>May 2023</MenuItem>
            </Select>
        }>
            <Chart
                options={optionslinechart}
                series={serieslinechart}
                type="line"
                height={370}
                width={"100%"}
            />
        </DashboardCard>
    );
};

export default SalesOverview;