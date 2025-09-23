const express = require('express');
const router = express.Router();
const db = require('../../database');

// Get manager dashboard stats
router.get('/stats', async (req, res) => {
  try {
    // Get total products
    const productsResult = await db.query('SELECT COUNT(*) as count FROM products WHERE is_active = true');
    const totalProducts = parseInt(productsResult.rows[0].count);
    
    // Get low stock items
    const lowStockResult = await db.query('SELECT COUNT(*) as count FROM products WHERE stock_quantity <= min_stock_level AND is_active = true');
    const lowStockItems = parseInt(lowStockResult.rows[0].count);
    
    // Get out of stock items
    const outOfStockResult = await db.query('SELECT COUNT(*) as count FROM products WHERE stock_quantity = 0 AND is_active = true');
    const outOfStockItems = parseInt(outOfStockResult.rows[0].count);
    
    // Get total inventory value
    const valueResult = await db.query('SELECT SUM(stock_quantity * unit_price) as total_value FROM products WHERE is_active = true');
    const totalValue = valueResult.rows[0].total_value || 0;
    
    // Get total sales for current month
    const salesResult = await db.query(`
      SELECT COALESCE(SUM(final_amount), 0) as total_sales, COUNT(*) as total_orders
      FROM sales 
      WHERE DATE_TRUNC('month', sale_date) = DATE_TRUNC('month', CURRENT_DATE)
      AND status = 'completed'
    `);
    const totalSales = salesResult.rows[0].total_sales || 0;
    const totalOrders = parseInt(salesResult.rows[0].total_orders);
    
    // Get total staff
    const staffResult = await db.query('SELECT COUNT(*) as count FROM users WHERE is_active = true');
    const totalStaff = parseInt(staffResult.rows[0].count);
    
    res.json({
      totalProducts,
      lowStockItems,
      outOfStockItems,
      totalValue,
      totalSales,
      totalOrders,
      totalStaff
    });
  } catch (error) {
    console.error('Error fetching manager stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get sales report data
router.get('/reports/sales', async (req, res) => {
  try {
    // Get monthly sales for last 6 months
    const monthlySales = await db.query(`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', sale_date), 'Mon') as month,
        SUM(final_amount) as sales,
        COUNT(*) as orders
      FROM sales 
      WHERE sale_date >= CURRENT_DATE - INTERVAL '6 months'
      AND status = 'completed'
      GROUP BY DATE_TRUNC('month', sale_date)
      ORDER BY DATE_TRUNC('month', sale_date)
    `);
    
    // Get top selling products
    const topProducts = await db.query(`
      SELECT 
        p.name,
        SUM(si.quantity) as sales,
        SUM(si.quantity) as quantity,
        SUM(si.total_price) as revenue
      FROM sales_items si
      JOIN products p ON si.product_id = p.id
      JOIN sales s ON si.sale_id = s.id
      WHERE s.status = 'completed'
      AND s.sale_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY p.id, p.name
      ORDER BY revenue DESC
      LIMIT 5
    `);
    
    // Calculate totals
    const totalsResult = await db.query(`
      SELECT 
        SUM(final_amount) as total_sales,
        COUNT(*) as total_orders,
        AVG(final_amount) as average_order_value
      FROM sales 
      WHERE DATE_TRUNC('month', sale_date) = DATE_TRUNC('month', CURRENT_DATE)
      AND status = 'completed'
    `);
    
    const totals = totalsResult.rows[0];
    
    res.json({
      salesReport: {
        totalSales: totals.total_sales || 0,
        totalOrders: parseInt(totals.total_orders) || 0,
        averageOrderValue: totals.average_order_value || 0,
        salesGrowth: 12.5, // Calculate this based on previous month comparison
        monthlySales: monthlySales.rows,
        topProducts: topProducts.rows
      }
    });
  } catch (error) {
    console.error('Error fetching sales report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get inventory report data
router.get('/reports/inventory', async (req, res) => {
  try {
    // Get category breakdown
    const categoryBreakdown = await db.query(`
      SELECT 
        c.name as category,
        COUNT(p.id) as count,
        SUM(p.stock_quantity * p.unit_price) as value
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      WHERE c.is_active = true
      GROUP BY c.id, c.name
      ORDER BY value DESC
    `);
    
    // Get recent stock movements
    const recentMovements = await db.query(`
      SELECT 
        sm.id,
        p.name as product_name,
        sm.movement_type,
        sm.quantity,
        sm.created_at::date as date
      FROM stock_movements sm
      JOIN products p ON sm.product_id = p.id
      ORDER BY sm.created_at DESC
      LIMIT 10
    `);
    
    // Get totals
    const totalsResult = await db.query(`
      SELECT 
        COUNT(*) as total_products,
        SUM(CASE WHEN stock_quantity <= min_stock_level THEN 1 ELSE 0 END) as low_stock_items,
        SUM(CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END) as out_of_stock_items,
        SUM(stock_quantity * unit_price) as total_value
      FROM products 
      WHERE is_active = true
    `);
    
    const totals = totalsResult.rows[0];
    
    res.json({
      inventoryReport: {
        totalProducts: parseInt(totals.total_products),
        lowStockItems: parseInt(totals.low_stock_items),
        outOfStockItems: parseInt(totals.out_of_stock_items),
        totalValue: totals.total_value || 0,
        categoryBreakdown: categoryBreakdown.rows,
        recentMovements: recentMovements.rows
      }
    });
  } catch (error) {
    console.error('Error fetching inventory report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get staff report data
router.get('/reports/staff', async (req, res) => {
  try {
    // Get staff list with basic info
    const staffList = await db.query(`
      SELECT 
        id,
        CONCAT(first_name, ' ', last_name) as name,
        role,
        85 as performance, -- Mock performance data
        42 as tasks_completed -- Mock tasks data
      FROM users 
      WHERE is_active = true
      ORDER BY role, first_name
    `);
    
    // Get staff totals
    const totalsResult = await db.query(`
      SELECT 
        COUNT(*) as total_staff,
        SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active_staff
      FROM users
    `);
    
    const totals = totalsResult.rows[0];
    
    // Mock department performance data
    const departmentPerformance = [
      { department: 'Warehouse', staff: 3, performance: 88, tasksCompleted: 65 },
      { department: 'Inventory', staff: 2, performance: 92, tasksCompleted: 45 },
      { department: 'Receiving', staff: 2, performance: 78, tasksCompleted: 32 },
      { department: 'Quality Control', staff: 1, performance: 85, tasksCompleted: 14 }
    ];
    
    res.json({
      staffReport: {
        totalStaff: parseInt(totals.total_staff),
        activeStaff: parseInt(totals.active_staff),
        tasksCompleted: 156, // Mock data
        averagePerformance: 85.5, // Mock data
        staffList: staffList.rows,
        departmentPerformance
      }
    });
  } catch (error) {
    console.error('Error fetching staff report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all suppliers for management
router.get('/suppliers', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        s.*,
        COUNT(p.id) as product_count
      FROM suppliers s
      LEFT JOIN products p ON s.id = p.supplier_id AND p.is_active = true
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `);
    
    res.json({ suppliers: rows });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create supplier
router.post('/suppliers', async (req, res) => {
  try {
    const {
      name,
      contact_person,
      email,
      phone,
      address,
      is_active = true,
      created_by = 1 // Should come from auth
    } = req.body;

    const { rows } = await db.query(
      `INSERT INTO suppliers (name, contact_person, email, phone, address, is_active, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, contact_person, email, phone, address, is_active, created_by]
    );

    res.status(201).json({ supplier: rows[0] });
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update supplier
router.put('/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      contact_person,
      email,
      phone,
      address,
      is_active
    } = req.body;

    const { rows } = await db.query(
      `UPDATE suppliers SET
        name = $1,
        contact_person = $2,
        email = $3,
        phone = $4,
        address = $5,
        is_active = $6,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [name, contact_person, email, phone, address, is_active, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({ supplier: rows[0] });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete supplier
router.delete('/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if supplier is used by any products
    const productCheck = await db.query('SELECT COUNT(*) as count FROM products WHERE supplier_id = $1', [id]);
    if (parseInt(productCheck.rows[0].count) > 0) {
      return res.status(400).json({ message: 'Cannot delete supplier that is used by products' });
    }

    const { rowCount } = await db.query('DELETE FROM suppliers WHERE id = $1', [id]);
    
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({ message: 'Supplier deleted' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
