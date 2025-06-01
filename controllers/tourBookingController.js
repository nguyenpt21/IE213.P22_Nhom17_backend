import Ticket from "../models/ticket.js";
import TourBooking from "../models/tourBooking.js";

const createTourBooking = async (req, res) => {
    try {
        const {
            quantities,
            ticketId,
            paymentMethod,
            name,
            email,
            phone,
            useDate,
            tourId,
            userId
        } = req.body;

        console.log(req.body)

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(400).json({ error: "Vé không tồn tại" });
        }

        const totalPrice = ticket.prices.reduce(
            (sum, p) => sum + p.price * quantities[p.priceType],
            0
        );

        const tourBooking = new TourBooking({
            userId,
            tourId,
            ticketId,
            paymentMethod,
            name,
            email,
            phone,
            useDate,
            totalPrice,
        });

        const createdTourBooing = await tourBooking.save();
        res.status(201).json(createdTourBooing);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Lấy danh sách booking của user hiện tại
const getMyTourBookings = async (req, res) => {
    try {
        const bookings = await TourBooking.find({ userId: req.user._id })
            .populate("tourId", "name images")
            .populate("ticketId", "title")
            .sort({ createdAt: -1 });
        
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi server" });
    }
}

// Lấy danh sách booking theo tour ID
const getBookingsByTour = async (req, res) => {
    try {
        const { tourId } = req.params;
        const { limit = 10, page = 1 } = req.query;
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const bookings = await TourBooking.find({ tourId })
            .populate("userId", "firstName lastName email")
            .populate("tourId", "name location")
            .populate("ticketId", "title")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const total = await TourBooking.countDocuments({ tourId });
        
        res.json({
            bookings,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi server" });
    }
}

const cancelTourBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await TourBooking.findById(id);
        if (!booking) {
            return res.status(403).json({ message: "Không cho phép huỷ" });
        }

        booking.bookingStatus = "canceled";
        await booking.save();
        res.json({ message: "Huỷ thành công", booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi server" });
    }
}


export { createTourBooking, getMyTourBookings, getBookingsByTour, cancelTourBooking };
