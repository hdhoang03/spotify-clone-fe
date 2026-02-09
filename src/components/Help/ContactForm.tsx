// src/components/Help/components/ContactForm.tsx
import { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import CustomSelect from '../Settings/CustomSelect';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        type: 'bug', // bug | feature | other
        email: '',
        content: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Sau này gọi API gửi mail ở đây
        console.log("Gửi yêu cầu:", formData);
        alert("Cảm ơn bạn! Chúng tôi đã nhận được phản hồi.");
        setFormData({ type: 'bug', email: '', content: '' }); // Reset form
    };

    const REQUEST_TYPES = [
        { value: 'bug', label: 'Báo lỗi kỹ thuật' },
        { value: 'feature', label: 'Đề xuất tính năng mới' },
        { value: 'account', label: 'Vấn đề tài khoản' },
        { value: 'other', label: 'Khác' }
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Loại yêu cầu */}
            <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-1.5">Bạn cần hỗ trợ về?</label>
                <CustomSelect
                    value={formData.type}
                    options={REQUEST_TYPES}
                    onChange={(val) => setFormData({ ...formData, type: val })}
                />
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-1.5">Email liên hệ</label>
                <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm placeholder-zinc-400"
                />
            </div>

            {/* Nội dung */}
            <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-1.5">Nội dung chi tiết</label>
                <textarea
                    required
                    rows={4}
                    placeholder="Mô tả vấn đề bạn gặp phải hoặc tính năng bạn mong muốn..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm placeholder-zinc-400 resize-none"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
                <Send size={18} />
                Gửi phản hồi
            </button>

            <div className="flex items-start gap-2 text-xs text-zinc-500 mt-2 bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <p>Chúng tôi thường phản hồi trong vòng 24h qua email. Vui lòng kiểm tra cả hộp thư Spam.</p>
            </div>
        </form>
    );
};

export default ContactForm;