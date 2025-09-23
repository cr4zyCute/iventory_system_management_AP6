const express = require('express');
const router = express.Router();
const db = require('../../database');

// Get all users (Admin only)
router.get('/users', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT id, email, role, first_name, last_name, is_active, created_at, last_login 
      FROM users 
      ORDER BY created_at DESC
    `);
    
    res.json({ users: rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle user active status
router.patch('/users/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    
    const { rows } = await db.query(
      'UPDATE users SET is_active = $1 WHERE id = $2 RETURNING *',
      [is_active, id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user: rows[0] });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);
    
    res.json({ products: rows });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total products
    const productsResult = await db.query('SELECT COUNT(*) as count FROM products WHERE is_active = true');
    const totalProducts = parseInt(productsResult.rows[0].count);
    
    // Get total users
    const usersResult = await db.query('SELECT COUNT(*) as count FROM users WHERE is_active = true');
    const totalUsers = parseInt(usersResult.rows[0].count);
    
    // Get low stock items
    const lowStockResult = await db.query(`
      SELECT COUNT(*) as count 
      FROM products 
      WHERE stock_quantity <= min_stock_level AND is_active = true
    `);
    const lowStockItems = parseInt(lowStockResult.rows[0].count);
    
    // Get total sales (mock for now)
    const totalSales = 45230;
    
    res.json({
      totalProducts,
      totalUsers,
      lowStockItems,
      totalSales
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reports data
router.get('/reports', async (req, res) => {
  try {
    // Get basic stats
    const statsResult = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM products WHERE is_active = true) as total_products,
        (SELECT COUNT(*) FROM users WHERE is_active = true) as total_users,
        (SELECT COUNT(*) FROM products WHERE stock_quantity <= min_stock_level AND is_active = true) as low_stock_items
    `);
    
    const stats = statsResult.rows[0];
    
    // Get top products (mock data for now)
    const topProducts = [
      { id: 1, name: 'Laptop Dell XPS 13', sales: 25, revenue: 32499.75 },
      { id: 2, name: 'Wireless Mouse', sales: 85, revenue: 2549.15 },
      { id: 3, name: 'Office Chair', sales: 15, revenue: 4499.85 },
      { id: 4, name: 'A4 Paper Ream', sales: 120, revenue: 1078.80 },
      { id: 5, name: 'Printer Ink Cartridge', sales: 45, revenue: 1799.55 }
    ];
    
    // Get recent stock movements
    const movementsResult = await db.query(`
      SELECT sm.*, p.name as product_name
      FROM stock_movements sm
      JOIN products p ON sm.product_id = p.id
      ORDER BY sm.created_at DESC
      LIMIT 10
    `);
    
    res.json({
      totalProducts: parseInt(stats.total_products),
      totalUsers: parseInt(stats.total_users),
      lowStockItems: parseInt(stats.low_stock_items),
      totalSales: 342,
      monthlyRevenue: 45230,
      topProducts,
      stockMovements: movementsResult.rows
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get system settings
router.get('/settings', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT * FROM system_settings 
      ORDER BY setting_key
    `);
    
    res.json({ settings: rows });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update system settings
router.put('/settings', async (req, res) => {
  try {
    const { settings } = req.body;
    
    // Update each setting
    for (const setting of settings) {
      await db.query(
        'UPDATE system_settings SET setting_value = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [setting.setting_value, setting.id]
      );
    }
    
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
