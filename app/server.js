const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('redis');
const { Pool } = require('pg');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const CONTAINER_ID = os.hostname();

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

const pgPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'appdb',
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'apppass123',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pgPool.on('connect', () => console.log('Connected to PostgreSQL'));
pgPool.on('error', (err) => console.error('PostgreSQL error:', err));

async function initializeConnections() {
  try {
    await redisClient.connect();
    await pgPool.query('SELECT NOW()');
    console.log('All database connections established');
  } catch (err) {
    console.error('Failed to initialize connections:', err);
    process.exit(1);
  }
}

app.get('/', (req, res) => {
  res.json({
    message: 'Scalable Application is Running!',
    container_id: CONTAINER_ID,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', container: CONTAINER_ID });
});

app.get('/api/visits', async (req, res) => {
  try {
    const cached = await redisClient.get('visit_count');
    if (cached) {
      return res.json({
        visits: parseInt(cached),
        source: 'cache',
        container: CONTAINER_ID
      });
    }
    const result = await pgPool.query('SELECT COUNT(*) as count FROM visits');
    const count = parseInt(result.rows[0].count);
    await redisClient.setEx('visit_count', 10, count.toString());
    res.json({
      visits: count,
      source: 'database',
      container: CONTAINER_ID
    });
  } catch (err) {
    console.error('Error getting visits:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/visit', async (req, res) => {
  try {
    const { user_agent = 'unknown', ip = req.ip } = req.body;
    const result = await pgPool.query(
      'INSERT INTO visits (user_agent, ip_address) VALUES ($1, $2) RETURNING id, visit_time',
      [user_agent, ip]
    );
    await redisClient.del('visit_count');
    res.status(201).json({
      success: true,
      visit: result.rows[0],
      container: CONTAINER_ID
    });
  } catch (err) {
    console.error('Error recording visit:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/heavy', async (req, res) => {
  const start = Date.now();
  let sum = 0;
  for (let i = 0; i < 10000000; i++) {
    sum += Math.sqrt(i);
  }
  const duration = Date.now() - start;
  res.json({
    message: 'Heavy computation completed',
    duration_ms: duration,
    result: sum,
    container: CONTAINER_ID
  });
});

app.get('/api/visits/all', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const result = await pgPool.query(
      'SELECT id, user_agent, ip_address, visit_time FROM visits ORDER BY visit_time DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    const countResult = await pgPool.query('SELECT COUNT(*) as total FROM visits');
    const total = parseInt(countResult.rows[0].total);
    res.json({
      visits: result.rows,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit)
      },
      container: CONTAINER_ID
    });
  } catch (err) {
    console.error('Error getting all visits:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    container: CONTAINER_ID
  });
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(async () => {
    await redisClient.quit();
    await pgPool.end();
    process.exit(0);
  });
});

const server = app.listen(PORT, async () => {
  await initializeConnections();
  console.log(`Server running on port ${PORT} (Container: ${CONTAINER_ID})`);
});
