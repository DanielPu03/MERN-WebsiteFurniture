const SanPham = require('../models/SanPham');
const DanhMuc = require('../models/DanhMuc');
const ThuongHieu = require('../models/ThuongHieu');
const BoSuuTap = require('../models/BoSuuTap');
const multer = require('multer');
const path = require('path');

// Helper function to update product status based on stock
const updateProductStatusBasedOnStock = async (productId) => {
  try {
    const product = await SanPham.findById(productId);
    if (product) {
      // If stock is 0, automatically set status to inactive
      if (product.soLuongTon === 0 && product.trangThai) {
        product.trangThai = false;
        await product.save();
      }
      // If stock is > 0 and status is inactive, optionally auto-enable (commented out by default)
      // Uncomment the following lines if you want auto-enable when stock is available
      // else if (product.soLuongTon > 0 && !product.trangThai) {
      //   product.trangThai = true;
      //   await product.save();
      // }
    }
  } catch (error) {
    console.error('Error updating product status based on stock:', error);
  }
};

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      brand,
      collection,
      minPrice,
      maxPrice,
      search,
      sortBy = 'ngayTao',
      sortOrder = 'desc',
      featured,
      trangThai
    } = req.query;

    // Build query - only filter by trangThai if explicitly provided
    // Admin can see all products by default, regular users only see active products
    const query = {};
    
    // Check if this is an admin request (via query parameter)
    const isAdminRequest = req.query.admin === 'true';
    
    // If trangThai is explicitly provided in query, use it regardless of admin status
    if (trangThai !== undefined) {
      query.trangThai = trangThai === 'true';
    } else {
      // Default: only show active products for regular users
      // Admin can see all products if they don't specify trangThai
      if (!isAdminRequest) {
        // Regular user - only show active products
        query.trangThai = true;
      }
    }

    // Featured filter
    if (featured !== undefined) {
      query.noiBat = featured === 'true';
    }

    // Category filter
    if (category) {
      const danhMuc = await DanhMuc.findOne({ tenDanhMuc: category });
      if (danhMuc) {
        query.danhMucId = danhMuc._id;
      }
    }

    // Brand filter
    if (brand) {
      const thuongHieu = await ThuongHieu.findOne({ tenThuongHieu: brand });
      if (thuongHieu) {
        query.thuongHieuId = thuongHieu._id;
      }
    }

    // Collection filter
    if (collection) {
      // Check if collection is an ID (ObjectId format) or a name
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(collection);
      let collectionId;
      
      if (isObjectId) {
        collectionId = collection;
      } else {
        const boSuuTap = await BoSuuTap.findOne({ tenBoSuuTap: collection });
        if (boSuuTap) {
          collectionId = boSuuTap._id;
        }
      }

      if (collectionId) {
        // Handle both old boSuuTapId and new boSuuTapIds for backward compatibility
        const ObjectId = require('mongoose').Types.ObjectId;
        const collectionObjectId = new ObjectId(collectionId);
        
        query.$or = [
          { boSuuTapIds: { $in: [collectionObjectId] } },
          { boSuuTapId: collectionObjectId }
        ];
      }
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.gia = {};
      if (minPrice) query.gia.$gte = parseFloat(minPrice);
      if (maxPrice) query.gia.$lte = parseFloat(maxPrice);
    }

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    const sortOptions = {};
    if (sortBy === 'gia') {
      sortOptions.gia = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'tenSanPham') {
      sortOptions.tenSanPham = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions.ngayTao = sortOrder === 'asc' ? 1 : -1;
    }

    const products = await SanPham.find(query)
      .populate('danhMucId', 'tenDanhMuc')
      .populate('thuongHieuId', 'tenThuongHieu')
      .populate('boSuuTapIds', 'tenBoSuuTap')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SanPham.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await SanPham.findById(req.params.id)
      .populate('danhMucId', 'tenDanhMuc')
      .populate('thuongHieuId', 'tenThuongHieu')
      .populate('boSuuTapIds', 'tenBoSuuTap');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      tenSanPham,
      gia,
      soLuongTon,
      danhMucId,
      thuongHieuId,
      boSuuTapIds,
      moTa,
      hinhAnh
    } = req.body;

    // Validate category (required)
    const danhMuc = await DanhMuc.findById(danhMucId);
    if (!danhMuc) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Validate brand if provided
    if (thuongHieuId) {
      const thuongHieu = await ThuongHieu.findById(thuongHieuId);
      if (!thuongHieu) {
        return res.status(400).json({
          success: false,
          message: 'Brand not found'
        });
      }
    }

    // Validate collections if provided
    if (boSuuTapIds && boSuuTapIds.length > 0) {
      const collections = await BoSuuTap.find({ _id: { $in: boSuuTapIds } });
      if (collections.length !== boSuuTapIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more collections not found'
        });
      }
    }

    // Process images - handle both URL and file uploads
    let processedImages = [];
    if (hinhAnh && Array.isArray(hinhAnh)) {
      processedImages = hinhAnh.map(img => ({
        url: img.url,
        laAnhChinh: img.laAnhChinh || false
      }));
    }

    const product = await SanPham.create({
      tenSanPham,
      gia,
      soLuongTon,
      danhMucId,
      thuongHieuId,
      boSuuTapIds,
      moTa,
      hinhAnh: processedImages
    });

    const populatedProduct = await SanPham.findById(product._id)
      .populate('danhMucId', 'tenDanhMuc')
      .populate('thuongHieuId', 'tenThuongHieu')
      .populate('boSuuTapIds', 'tenBoSuuTap');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product: populatedProduct }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { hinhAnh, thuongHieuId, boSuuTapIds, ...otherData } = req.body;

    // Validate collections if provided
    if (boSuuTapIds && boSuuTapIds.length > 0) {
      const collections = await BoSuuTap.find({ _id: { $in: boSuuTapIds } });
      if (collections.length !== boSuuTapIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more collections not found'
        });
      }
    }

    // Process images - handle both URL and file uploads
    let processedImages = [];
    if (hinhAnh && Array.isArray(hinhAnh)) {
      processedImages = hinhAnh.map(img => ({
        url: img.url,
        laAnhChinh: img.laAnhChinh || false
      }));
    }

    // Validate brand (optional)
    if (thuongHieuId && thuongHieuId !== '') {
      const thuongHieu = await ThuongHieu.findById(thuongHieuId);
      if (!thuongHieu) {
        return res.status(400).json({
          success: false,
          message: 'Brand not found'
        });
      }
    }

    const updateData = {
      ...otherData,
      thuongHieuId: thuongHieuId ? thuongHieuId : undefined,
      boSuuTapIds: boSuuTapIds || [],
    };

    // Only update hinhAnh if it's provided
    if (hinhAnh && Array.isArray(hinhAnh)) {
      updateData.hinhAnh = processedImages;
    }

    const product = await SanPham.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('danhMucId', 'tenDanhMuc')
     .populate('thuongHieuId', 'tenThuongHieu')
     .populate('boSuuTapIds', 'tenBoSuuTap');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Auto-update status based on stock if stock was changed
    if (updateData.soLuongTon !== undefined) {
      await updateProductStatusBasedOnStock(req.params.id);
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await SanPham.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all collections
const getProductCollections = async (req, res) => {
  try {
    const collections = await BoSuuTap.find({ trangThai: true })
      .populate('sanPhams', 'tenSanPham gia hinhAnh')
      .sort({ ngayTao: -1 });

    // Add product count to each collection
    const collectionsWithCount = collections.map(collection => ({
      _id: collection._id,
      tenBoSuuTap: collection.tenBoSuuTap,
      moTa: collection.moTa,
      hinhAnh: collection.hinhAnh,
      trangThai: collection.trangThai,
      soLuongSanPham: collection.sanPhams ? collection.sanPhams.length : 0,
      ngayTao: collection.ngayTao,
      ngayCapNhat: collection.ngayCapNhat
    }));

    res.json({
      success: true,
      data: {
        collections: collectionsWithCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getRelatedProducts = async (req, res) => {
  try {
    const product = await SanPham.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const relatedProducts = await SanPham.find({
      _id: { $ne: req.params.id },
      danhMucId: product.danhMucId,
      trangThai: true
    })
    .populate('danhMucId', 'tenDanhMuc')
    .populate('thuongHieuId', 'tenThuongHieu')
    .populate('boSuuTapIds', 'tenBoSuuTap')
    .limit(6);

    res.json({
      success: true,
      data: { products: relatedProducts }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Upload product images
const uploadProductImages = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await SanPham.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Handle multiple image uploads
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    // Process uploaded images
    const newImages = req.files.map((file, index) => ({
      url: `/uploads/products/${file.filename}`,
      laAnhChinh: index === 0 // First image is main
    }));

    // Add new images to existing ones
    const existingImages = product.hinhAnh || [];
    const updatedImages = [...existingImages, ...newImages];

    // Update product with new images
    await SanPham.findByIdAndUpdate(productId, {
      hinhAnh: updatedImages
    });

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: { images: updatedImages }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete product image
const deleteProductImage = async (req, res) => {
  try {
    const { productId, imageIndex } = req.params;
    const product = await SanPham.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.hinhAnh || product.hinhAnh.length <= imageIndex) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Remove the image at specified index
    const updatedImages = product.hinhAnh.filter((_, index) => index !== parseInt(imageIndex));
    
    // If deleting main image, set first remaining image as main
    if (updatedImages.length > 0 && updatedImages[0]) {
      updatedImages[0].laAnhChinh = true;
    }

    await SanPham.findByIdAndUpdate(productId, {
      hinhAnh: updatedImages
    });

    res.json({
      success: true,
      message: 'Image deleted successfully',
      data: { images: updatedImages }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Set main product image
const setMainProductImage = async (req, res) => {
  try {
    const { productId, imageIndex } = req.params;
    const product = await SanPham.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.hinhAnh || product.hinhAnh.length <= imageIndex) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Reset all images to secondary, then set specified image as main
    const updatedImages = product.hinhAnh.map((img, index) => ({
      ...img,
      laAnhChinh: index === parseInt(imageIndex)
    }));

    await SanPham.findByIdAndUpdate(productId, {
      hinhAnh: updatedImages
    });

    res.json({
      success: true,
      message: 'Main image set successfully',
      data: { images: updatedImages }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc   // Update product status
const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { trangThai } = req.body;

    const product = await SanPham.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.trangThai = trangThai;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product status updated successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Error in updateProductStatus:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCollections,
  getRelatedProducts,
  uploadProductImages,
  deleteProductImage,
  setMainProductImage,
  upload,
  updateProductStatus,
  updateProductStatusBasedOnStock
};
