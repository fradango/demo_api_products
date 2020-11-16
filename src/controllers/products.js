const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/Product');

//@desc     Get all products
//@route     GET /api/v1/products
exports.getProducts = async (req, res, next) => {
  try {
    //Definding query
    let query;

    //Copy req.query
    const reqQuery = { ...req.query };

    //Remove fields
    delete reqQuery.limit;
    delete reqQuery.page;
    delete reqQuery.sort;
    delete reqQuery.select;

    //Finding resources
    query = Product.find(reqQuery);

    const totalResults = (await query).length;

    //Select
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    //Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //Pagination
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = page * limit - limit;
    let totalPages;
    let pagination = {};
    const residuo = totalResults % limit;

    if (residuo === 0) {
      totalPages = totalResults / limit;
    } else {
      totalPages = Math.trunc(totalResults / limit) + 1;
    }

    query = query.limit(limit).skip(skip);

    if (totalResults < limit) {
      pagination.page = page;
      pagination.prevPage = 'No prev page';
      pagination.nextPage = 'No next page';
      pagination.totalPages = 1;
    } else {
      if (page > totalPages) {
        return next(new ErrorResponse(`Page doesn't exist`, 404));
      } else {
        pagination.page = page;
        if (page === 1) {
          pagination.prevPage = 'No prev page';
        } else {
          pagination.prevPage = page - 1;
        }
        if (page === totalPages) {
          pagination.nextPage = 'No next page';
        } else {
          pagination.nextPage = page + 1;
        }
        pagination.totalPages = totalPages;
      }
    }

    //Executing query
    const products = await query;

    //Response data
    res.status(200).json({
      success: true,
      totalDocs: products.length,
      pagination: pagination,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

//@desc     Get one product
//@route     GET /api/v1/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

//@desc     Create a new product
//@route     POST /api/v1/products
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

//@desc     Update one product
//@route     PUT /api/v1/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

//@desc     Delete one product
//@route     DELETE /api/v1/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
