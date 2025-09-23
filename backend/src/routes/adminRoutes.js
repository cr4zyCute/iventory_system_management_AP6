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
      SELECT p.*, c.name as category_name, s.name as supplier_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY p.created_at DESC
    `);
    
    res.json({ products: rows });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product
router.post('/products', async (req, res) => {
  try {
    const {
      name,
      description,
      sku,
      barcode,
      category_id,
      supplier_id,
      unit_price,
      cost_price,
      stock_quantity,
      min_stock_level,
      max_stock_level,
      unit_of_measure = 'pcs',
      is_active = true,
      created_by = 1 // Default to admin user, should come from auth
    } = req.body;

    const { rows } = await db.query(
      `INSERT INTO products
        (name, description, sku, barcode, category_id, supplier_id, unit_price, cost_price, 
         stock_quantity, min_stock_level, max_stock_level, unit_of_measure, is_active, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING *` ,
      [name, description, sku, barcode, category_id, supplier_id, unit_price, cost_price, 
       stock_quantity, min_stock_level, max_stock_level, unit_of_measure, is_active, created_by]
    );

    res.status(201).json({ product: rows[0] });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      sku,
      barcode,
      category_id,
      supplier_id,
      unit_price,
      cost_price,
      stock_quantity,
      min_stock_level,
      max_stock_level,
      unit_of_measure,
      is_active
    } = req.body;

    const { rows } = await db.query(
      `UPDATE products SET
        name = $1,
        description = $2,
        sku = $3,
        barcode = $4,
        category_id = $5,
        supplier_id = $6,
        unit_price = $7,
        cost_price = $8,
        stock_quantity = $9,
        min_stock_level = $10,
        max_stock_level = $11,
        unit_of_measure = $12,
        is_active = $13,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $14
       RETURNING *`,
      [name, description, sku, barcode, category_id, supplier_id, unit_price, cost_price, 
       stock_quantity, min_stock_level, max_stock_level, unit_of_measure, is_active, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product: rows[0] });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM products WHERE id = $1', [id]);
    // result.rowCount can indicate deletion
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// List categories for forms
router.get('/categories', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, name FROM categories WHERE is_active = true ORDER BY name');
    res.json({ categories: rows });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all categories (for management)
router.get('/categories/all', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM categories ORDER BY created_at DESC');
    res.json({ categories: rows });
  } catch (error) {
    console.error('Error fetching all categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create category
router.post('/categories', async (req, res) => {
  try {
    const { name, description, is_active = true, created_by = 1 } = req.body;

    const { rows } = await db.query(
      `INSERT INTO categories (name, description, is_active, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description, is_active, created_by]
    );

    res.status(201).json({ category: rows[0] });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update category
router.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, is_active } = req.body;

    const { rows } = await db.query(
      `UPDATE categories SET
        name = $1,
        description = $2,
        is_active = $3,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [name, description, is_active, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ category: rows[0] });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete category
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category is used by any products
    const productCheck = await db.query('SELECT COUNT(*) as count FROM products WHERE category_id = $1', [id]);
    if (parseInt(productCheck.rows[0].count) > 0) {
      return res.status(400).json({ message: 'Cannot delete category that is used by products' });
    }

    const { rowCount } = await db.query('DELETE FROM categories WHERE id = $1', [id]);
    
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// List suppliers for forms
router.get('/suppliers', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, name FROM suppliers WHERE is_active = true ORDER BY name');
    res.json({ suppliers: rows });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
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
