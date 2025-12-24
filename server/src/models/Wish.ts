import mongoose from 'mongoose';

const wishSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    wish: {
        type: String,
        required: true
    },
    sentiment: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'denied'],
        default: 'pending'
    },
    imageUrl: {
        type: String,
        required: true
    },
    modelUrl: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Wish = mongoose.model('Wish', wishSchema);
export default Wish;
