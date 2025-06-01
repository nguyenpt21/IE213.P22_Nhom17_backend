import express from "express";
import multer from 'multer';
import {
    listCity,
    addCity,
    addPopularPlace,
    removeCity,
    removePopularPlace,
    updateCity,
    getCityById
} from "../controllers/cityController.js";
import { verifyAdminToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Cấu hình multer để xử lý upload file trong memory
const upload = multer({ storage: multer.memoryStorage() });

// Route public: lấy chi tiết thành phố
router.get('/:cityId', getCityById);

// Áp dụng middleware xác thực admin cho các routes cần bảo vệ
router.use(verifyAdminToken);

// Routes
router.get("/", listCity); // Lấy danh sách thành phố
router.post("/", upload.array('images'), addCity); // Thêm thành phố mới

router.route('/:cityId')
    .delete(removeCity); // Xóa thành phố

router.route('/:cityId/popular-places')
    .post(upload.single('image'), addPopularPlace); // Thêm địa điểm nổi tiếng

router.route('/:cityId/popular-places/:placeId')
    .delete(removePopularPlace); // Xóa địa điểm nổi tiếng

router.put('/update/:cityId', updateCity); // Thêm route update city

export default router;