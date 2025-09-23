const express = require('express');
const router = express.Router();
const db = require('../../database');

// Get staff dashboard stats
router.get('/stats', async (req, res) => {
  try {
    // Get total products
    const productsResult = await db.query('SELECT COUNT(*) as count FROM products WHERE is_active = true');
    const totalProducts = parseInt(productsResult.rows[0].count);
    
    // Get low stock items
    const lowStockResult = await db.query('SELECT COUNT(*) as count FROM products WHERE stock_quantity <= min_stock_level AND is_active = true');
    const lowStockItems = parseInt(lowStockResult.rows[0].count);
    
    // Get recent stock movements
    const movementsResult = await db.query(`
      SELECT COUNT(*) as count 
      FROM stock_movements 
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
    `);
    const recentMovements = parseInt(movementsResult.rows[0].count);
    
    // Get pending tasks (mock data for now)
    const pendingTasks = 5;
    
    res.json({
      totalProducts,
      lowStockItems,
      recentMovements,
      pendingTasks
    });
  } catch (error) {
    console.error('Error fetching staff stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get products for viewing (staff can only view)
router.get('/products', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        p.*,
        c.name as category_name,
        s.name as supplier_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.is_active = true
      ORDER BY p.name
    `);
    
    res.json({ products: rows });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get low stock items
router.get('/low-stock', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        p.*,
        c.name as category_name,
        s.name as supplier_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.stock_quantity <= p.min_stock_level 
      AND p.is_active = true
      ORDER BY (p.stock_quantity::float / p.min_stock_level) ASC
    `);
    
    res.json({ products: rows });
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent stock movements
router.get('/stock-movements', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        sm.*,
        p.name as product_name,
        p.sku,
        u.first_name || ' ' || u.last_name as created_by_name
      FROM stock_movements sm
      JOIN products p ON sm.product_id = p.id
      LEFT JOIN users u ON sm.created_by = u.id
      ORDER BY sm.created_at DESC
      LIMIT 50
    `);
    
    res.json({ movements: rows });
  } catch (error) {
    console.error('Error fetching stock movements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create stock adjustment (staff can adjust stock)
router.post('/stock-adjustment', async (req, res) => {
  try {
    const {
      product_id,
      quantity,
      movement_type, // 'adjustment', 'damaged', 'expired'
      reason,
      created_by = 1 // Should come from auth
    } = req.body;

    // Get current stock
    const productResult = await db.query('SELECT stock_quantity FROM products WHERE id = $1', [product_id]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const currentStock = parseInt(productResult.rows[0].stock_quantity);
    let newStock;

    if (movement_type === 'adjustment') {
      newStock = quantity; // Direct adjustment to specific quantity
    } else {
      newStock = currentStock - Math.abs(quantity); // Reduce stock for damaged/expired
    }

    // Ensure stock doesn't go negative
    if (newStock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    // Start transaction
    await db.query('BEGIN');

    try {
      // Update product stock
      await db.query(
        'UPDATE products SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [newStock, product_id]
      );

      // Record stock movement
      await db.query(
        `INSERT INTO stock_movements 
         (product_id, movement_type, quantity, reason, previous_stock, new_stock, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [product_id, movement_type, Math.abs(quantity), reason, currentStock, newStock, created_by]
      );

      await db.query('COMMIT');
      res.json({ message: 'Stock adjustment recorded successfully' });
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error creating stock adjustment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get staff tasks (mock data for now)
router.get('/tasks', async (req, res) => {
  try {
    // Mock tasks data - in a real system, you'd have a tasks table
    const tasks = [
      {
        id: 1,
        title: 'Check inventory levels',
        description: 'Review and update stock levels for electronics category',
        priority: 'high',
        status: 'pending',
        due_date: '2025-09-24',
        assigned_by: 'Manager'
      },
      {
        id: 2,
        title: 'Process damaged items',
        description: 'Record damaged laptops from yesterday\'s shipment',
        priority: 'medium',
        status: 'in_progress',
        due_date: '2025-09-23',
        assigned_by: 'Manager'
      },
      {
        id: 3,
        title: 'Update product locations',
        description: 'Update warehouse locations for new furniture items',
        priority: 'low',
        status: 'pending',
        due_date: '2025-09-25',
        assigned_by: 'Manager'
      }
    ];
    
    res.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task status
router.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Mock response - in a real system, you'd update the tasks table
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
