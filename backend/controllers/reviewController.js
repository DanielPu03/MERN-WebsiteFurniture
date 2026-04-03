const DanhGia = require('../models/DanhGia');
const SanPham = require('../models/SanPham');

// Get reviews for a product
const getProductReviews = async (req, res) => {
  const { page = 1, limit = 10, rating } = req.query;
  const { sanPhamId } = req.params;

  const query = { sanPhamId };
  if (rating) query.soSao = parseInt(rating);

  const reviews = await DanhGia.find(query)
    .populate('nguoiDungId', 'hoTen')
    .sort({ ngayTao: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await DanhGia.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
};

// Create review
const createReview = async (req, res) => {
  const { sanPhamId, soSao, binhLuan } = req.body;
  const userId = req.user._id;

  // Check if user already reviewed
  const existingReview = await DanhGia.findOne({ sanPhamId, nguoiDungId: userId });
  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: 'You have already reviewed this product'
    });
  }

  const review = await DanhGia.create({
    sanPhamId,
    nguoiDungId: userId,
    soSao,
    binhLuan
  });

  // Update product rating
  const product = await SanPham.findById(sanPhamId);
  await product.updateAverageRating();

  const populatedReview = await DanhGia.findById(review._id)
    .populate('nguoiDungId', 'hoTen');

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: { review: populatedReview }
  });
};

// Update review
const updateReview = async (req, res) => {
  const { soSao, binhLuan } = req.body;
  const reviewId = req.params.id;

  const review = await DanhGia.findOne({ _id: reviewId, nguoiDungId: req.user._id });
  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  review.soSao = soSao;
  review.binhLuan = binhLuan;
  await review.save();

  // Update product rating
  const product = await SanPham.findById(review.sanPhamId);
  await product.updateAverageRating();

  const updatedReview = await DanhGia.findById(review._id)
    .populate('nguoiDungId', 'hoTen');

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: { review: updatedReview }
  });
};

// Delete review
const deleteReview = async (req, res) => {
  const reviewId = req.params.id;

  const review = await DanhGia.findOne({ _id: reviewId, nguoiDungId: req.user._id });
  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  const sanPhamId = review.sanPhamId;
  await review.deleteOne();

  // Update product rating
  const product = await SanPham.findById(sanPhamId);
  await product.updateAverageRating();

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully'
  });
};

// Get user's reviews
const getUserReviews = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const reviews = await DanhGia.find({ nguoiDungId: req.user._id })
    .populate('sanPhamId', 'tenSanPham hinhAnh')
    .sort({ ngayTao: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await DanhGia.countDocuments({ nguoiDungId: req.user._id });

  res.status(200).json({
    success: true,
    data: {
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
};

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews
};
