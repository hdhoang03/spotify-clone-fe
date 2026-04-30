// src/components/Help/hooks/useSupportLogic.ts
import { useState } from 'react';
import api from '../../services/api';

export const useSupportLogic = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: 'bug',
        content: ''
    });

    const submitSupportRequest = async () => {
        if (!formData.content.trim()) return false;

        setIsLoading(true);
        try {
            const res = await api.post('/user/support', formData);
            if (res.data.code === 1000) {
                // Xóa rỗng form sau khi gửi thành công
                setFormData({ type: 'bug', content: '' });
                return true;
            }
            return false;
        } catch (error) {
            console.error("Lỗi gửi yêu cầu hỗ trợ:", error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        setFormData,
        isLoading,
        submitSupportRequest
    };
};