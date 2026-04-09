const BoSuuTap = require('../models/BoSuuTap');
const SanPham = require('../models/SanPham');

// Get all collections
const getCollections = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = { trangThai: true };

    if (search) {
      query.$text = { $search: search };
    }

    const collections = await BoSuuTap.find(query)
      .populate('sanPhams', 'tenSanPham gia hinhAnh')
      .sort({ ngayTao: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BoSuuTap.countDocuments(query);

    res.json({
      success: true,
      data: {
        collections,
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

// Get collection by ID
const getCollectionById = async (req, res) => {
  try {
    const collection = await BoSuuTap.findById(req.params.id)
      .populate({
        path: 'sanPhams',
        populate: [
          { path: 'danhMucId', select: 'tenDanhMuc' },
          { path: 'thuongHieuId', select: 'tenThuongHieu' }
        ]
      });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    res.json({
      success: true,
      data: { collection }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new collection
const createCollection = async (req, res) => {
  try {
    const { tenBoSuuTap, moTa, hinhAnh, sanPhams } = req.body;

    // Validate products if provided
    if (sanPhams && sanPhams.length > 0) {
      const validProducts = await SanPham.find({ 
        _id: { $in: sanPhams },
        trangThai: true 
      });
      
      if (validProducts.length !== sanPhams.length) {
        return res.status(400).json({
          success: false,
          message: 'Some products are not found or inactive'
        });
      }
    }

    const collection = await BoSuuTap.create({
      tenBoSuuTap,
      moTa,
      hinhAnh,
      sanPhams: sanPhams || []
    });

    // Update products to include this collection
    if (sanPhams && sanPhams.length > 0) {
      await SanPham.updateMany(
        { _id: { $in: sanPhams } },
        { $addToSet: { boSuuTapIds: collection._id } }
      );
    }

    const populatedCollection = await BoSuuTap.findById(collection._id)
      .populate('sanPhams', 'tenSanPham gia hinhAnh');

    res.status(201).json({
      success: true,
      message: 'Collection created successfully',
      data: { collection: populatedCollection }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update collection
const updateCollection = async (req, res) => {
  try {
    const { sanPhams, ...updateData } = req.body;
    const collectionId = req.params.id;

    // Get current collection to compare products
    const currentCollection = await BoSuuTap.findById(collectionId);
    if (!currentCollection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    const oldProductIds = currentCollection.sanPhams || [];
    let newProductIds = [];

    // Validate products if provided
    if (sanPhams && sanPhams.length > 0) {
      const validProducts = await SanPham.find({ 
        _id: { $in: sanPhams },
        trangThai: true 
      });
      
      if (validProducts.length !== sanPhams.length) {
        return res.status(400).json({
          success: false,
          message: 'Some products are not found or inactive'
        });
      }
      newProductIds = sanPhams;
      updateData.sanPhams = sanPhams;
    }

    // Find products to remove (in old but not in new)
    const productsToRemove = oldProductIds.filter(id => !newProductIds.includes(id));
    
    // Find products to add (in new but not in old)
    const productsToAdd = newProductIds.filter(id => !oldProductIds.includes(id));

    // Update collection
    const collection = await BoSuuTap.findByIdAndUpdate(
      collectionId,
      updateData,
      { new: true, runValidators: true }
    ).populate('sanPhams', 'tenSanPham gia hinhAnh');

    // Update products to remove this collection reference
    if (productsToRemove.length > 0) {
      await SanPham.updateMany(
        { _id: { $in: productsToRemove } },
        { $pull: { boSuuTapIds: collectionId } }
      );
    }

    // Update products to add this collection reference
    if (productsToAdd.length > 0) {
      await SanPham.updateMany(
        { _id: { $in: productsToAdd } },
        { $addToSet: { boSuuTapIds: collectionId } }
      );
    }

    res.json({
      success: true,
      message: 'Collection updated successfully',
      data: { collection }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete collection
const deleteCollection = async (req, res) => {
  try {
    const collection = await BoSuuTap.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    // Remove this collection reference from all products
    if (collection.sanPhams && collection.sanPhams.length > 0) {
      await SanPham.updateMany(
        { _id: { $in: collection.sanPhams } },
        { $pull: { boSuuTapIds: collection._id } }
      );
    }

    await collection.deleteOne();

    res.json({
      success: true,
      message: 'Collection deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add product to collection
const addProductToCollection = async (req, res) => {
  try {
    const { collectionId, sanPhamId } = req.params;

    const collection = await BoSuuTap.findById(collectionId);
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    const product = await SanPham.findById(sanPhamId);
    if (!product || !product.trangThai) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or inactive'
      });
    }

    if (collection.sanPhams.includes(sanPhamId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in collection'
      });
    }

    collection.sanPhams.push(sanPhamId);
    await collection.save();

    const updatedCollection = await BoSuuTap.findById(collectionId)
      .populate('sanPhams', 'tenSanPham gia hinhAnh');

    res.json({
      success: true,
      message: 'Product added to collection successfully',
      data: { collection: updatedCollection }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Remove product from collection
const removeProductFromCollection = async (req, res) => {
  try {
    const { collectionId, sanPhamId } = req.params;

    const collection = await BoSuuTap.findById(collectionId);
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    collection.sanPhams = collection.sanPhams.filter(
      id => id.toString() !== sanPhamId
    );
    await collection.save();

    const updatedCollection = await BoSuuTap.findById(collectionId)
      .populate('sanPhams', 'tenSanPham gia hinhAnh');

    res.json({
      success: true,
      message: 'Product removed from collection successfully',
      data: { collection: updatedCollection }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  addProductToCollection,
  removeProductFromCollection
};
