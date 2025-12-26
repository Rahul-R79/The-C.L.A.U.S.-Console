import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    senderId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        enum: ['user', 'santa', 'system'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    }
});

export const Message = mongoose.model('Message', messageSchema);
