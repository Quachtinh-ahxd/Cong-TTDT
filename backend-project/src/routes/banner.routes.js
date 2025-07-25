const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/banner.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Public routes
router.get('/', bannerController.getAllBanners);
router.get('/index', bannerController.getAllBanners);
router.get('/show/:id', bannerController.getBannerById);
router.get('/position/:position', bannerController.getBannersByPosition);
router.get('/status/:id', bannerController.changeBannerStatus);

// Protected routes (admin only)
router.post('/store', 
  upload.single('image'), 
  bannerController.createBanner
);

router.post('/', 
  upload.single('image'), 
  bannerController.createBanner
);

router.post('/update/:id', 
  upload.single('image'), 
  bannerController.updateBanner
);

router.put('/:id', 
  upload.single('image'), 
  bannerController.updateBanner
);

router.delete('/destroy/:id', bannerController.deleteBanner);
router.delete('/:id', bannerController.deleteBanner);

// This must be last to avoid catching other routes
router.get('/:id', bannerController.getBannerById);

module.exports = router;



