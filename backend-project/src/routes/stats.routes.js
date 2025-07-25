router.get('/products', statsController.getProductStats);
router.get('/products/:productId', statsController.getProductDetailStats);