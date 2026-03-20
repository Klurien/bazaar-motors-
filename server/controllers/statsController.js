import db from '../db/db.js';

export const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Revenue
        const [revenueRes] = await db.query('SELECT SUM(total_amount) as total FROM orders WHERE status != "Cancelled"');
        const totalRevenue = revenueRes[0].total || 0;

        // 2. Active Orders (Not Delivered or Cancelled)
        const [activeOrdersRes] = await db.query('SELECT COUNT(*) as count FROM orders WHERE status NOT IN ("Delivered", "Cancelled")');
        const activeOrders = activeOrdersRes[0].count || 0;

        // 3. Site Visitors (from our counter table)
        const [visitorsRes] = await db.query('SELECT stat_value FROM site_stats WHERE stat_name = "visitors"');
        const visitors = visitorsRes[0]?.stat_value || 0;

        // 4. Inventory Items (Total unique products)
        const [inventoryRes] = await db.query('SELECT COUNT(*) as count FROM products');
        const inventoryCount = inventoryRes[0].count || 0;

        res.json({
            totalRevenue,
            activeOrders,
            visitors,
            inventoryCount
        });
    } catch (error) {
        console.error('Stats controller error:', error);
        res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
};

export const getSalesChart = async (req, res) => {
    try {
        // Fetch last 7 days of sales
        // Handling both MySQL and SQLite date formats
        const [sales] = await db.query(`
            SELECT 
                DATE(created_at) as date, 
                SUM(total_amount) as amount 
            FROM orders 
            WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
            AND status != "Cancelled"
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `);

        // If empty, return some default structure for the chart
        res.json(sales);
    } catch (error) {
        // Fallback for SQLite which doesn't have DATE_SUB in that exact syntax
        try {
            const [sales] = await db.query(`
                SELECT 
                    strftime('%Y-%m-%d', created_at) as date, 
                    SUM(total_amount) as amount 
                FROM orders 
                WHERE created_at >= date('now', '-7 days')
                AND status != "Cancelled"
                GROUP BY date
                ORDER BY date ASC
            `);
            res.json(sales);
        } catch (sqliteErr) {
            console.error('Sales chart error:', sqliteErr);
            res.status(500).json({ message: 'Error fetching sales chart' });
        }
    }
};

export const getTopCategories = async (req, res) => {
    try {
        const [categories] = await db.query(`
            SELECT p.category, SUM(oi.quantity * oi.price_at_purchase) as total_sales
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            GROUP BY p.category
            ORDER BY total_sales DESC
            LIMIT 5
        `);
        res.json(categories);
    } catch (error) {
        console.error('Top categories error:', error);
        res.status(500).json({ message: 'Error fetching top categories' });
    }
};

export const incrementVisitors = async (req, res) => {
    try {
        await db.execute('UPDATE site_stats SET stat_value = stat_value + 1 WHERE stat_name = "visitors"');
        res.sendStatus(200);
    } catch (error) {
        console.error('Increment visitors error:', error);
        res.sendStatus(500);
    }
};
