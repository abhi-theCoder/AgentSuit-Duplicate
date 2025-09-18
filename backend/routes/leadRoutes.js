const express = require('express');
const router = express.Router();
const multer = require('multer');
const leadController = require('../controllers/leadController');
const aiLeadController = require('../controllers/aileadController');
const authenticateToken = require('../middleware/auth');
const validate = require('../middleware/validation');
const { addLeadSchema } = require('../schemas/leadSchema');
const { bulkUploadLeads, saveFilteredLeadsController } = require('../controllers/leadController');
const checkDuplicatePhoneOrEmail = require('../middleware/checkDuplicatePhoneOrEmail');

// Configure multer for file storage
// Using memory storage for smaller files or disk storage for larger ones
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', authenticateToken, validate(addLeadSchema), checkDuplicatePhoneOrEmail, leadController.addLead);

router.post('/add-lead-by-ai', aiLeadController.addLeadByAI);

// Route to handle bulk lead upload
router.post('/bulk-upload', authenticateToken, upload.single('file'), bulkUploadLeads);

// Route to get all leads with pagination
// Example: /api/leads?page=1&limit=10
router.get('/', authenticateToken, leadController.getAllLeads);

// Route to get leads by status and/or source
// Example: /api/leads/filtered?status=cold&source=website
router.get('/filtered', authenticateToken, leadController.getFilteredLeads);

// Route to get a single lead by ID
// Example: /api/leads/123e4567-e89b-12d3-a456-426614174000
router.get('/:id', authenticateToken, leadController.getLeadById);

// POST /api/saved-leads
router.post('/saved-leads', authenticateToken, saveFilteredLeadsController);


module.exports = router;