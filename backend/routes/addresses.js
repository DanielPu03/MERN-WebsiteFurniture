const express = require('express');
const router = express.Router();
const {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress
} = require('../controllers/addressController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getAddresses)
  .post(createAddress);

router.route('/:id')
  .get(getAddressById)
  .put(updateAddress)
  .delete(deleteAddress);

router.put('/:id/default', setDefaultAddress);

module.exports = router;
