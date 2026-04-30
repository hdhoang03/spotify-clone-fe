import React from 'react';
import { Send, AlertCircle, Loader2 } from 'lucide-react';
import CustomSelect from '../Settings/CustomSelect';
import { useUserProfile } from '../../hooks/useUserProfile'; // Hook lấy thông tin user của bạn
import { useSupportLogic } from './useSupportLogic'; // Hook xử lý logic mới tạo

const REQUEST_TYPES = [
    { value: 'bug', label: 'Báo lỗi kỹ thuật' },
    { value: 'feature', label: 'Đề xuất tính năng mới' },
    { value: 'account', label: 'Vấn đề tài khoản' },
    { value: 'other', label: 'Khác' }
];

const ContactForm = () => {
    const { user } = useUserProfile();

    // 2. Lấy logic xử lý Form
    const { formData, setFormData, isLoading, submitSupportRequest } = useSupportLogic();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const isSuccess = await submitSupportRequest();
        if (isSuccess) {
            alert("Cảm ơn bạn! Chúng tôi đã nhận được phản hồi. Vui lòng kiểm tra email của bạn.");
        } else {
            alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Loại yêu cầu */}
            <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-1.5">Bạn cần hỗ trợ về?</label>
                <CustomSelect
                    value={formData.type}
                    onChange={(val) => setFormData({ ...formData, type: val })}
                    options={REQUEST_TYPES}
                />
            </div>

            {/* Email (Disabled - Chỉ hiển thị cho người dùng biết hệ thống dùng email nào) */}
            <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-1.5">Email liên hệ</label>
                <input
                    type="email"
                    disabled
                    value={user?.email || 'Đang tải dữ liệu...'}
                    className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-lg outline-none cursor-not-allowed text-sm border border-transparent"
                    title="Hệ thống sẽ tự động dùng email đăng ký của bạn"
                />
            </div>

            {/* Nội dung */}
            <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-1.5">Nội dung chi tiết</label>
                <textarea
                    required
                    rows={5}
                    placeholder="Mô tả chi tiết vấn đề bạn gặp phải hoặc tính năng bạn mong muốn..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm placeholder-zinc-400 resize-none border border-zinc-200 dark:border-zinc-700 transition-all"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading || !user} // Disable nếu đang gửi hoặc chưa có user
                className="w-full py-3 mt-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                {isLoading ? 'Đang xử lý...' : 'Gửi yêu cầu'}
            </button>

            <div className="flex items-start gap-2 text-xs text-zinc-500 mt-4 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-700">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-blue-500" />
                <p>Mọi thông báo cập nhật tình trạng xử lý sẽ được gửi trực tiếp vào email <strong>{user?.email}</strong> của bạn.</p>
            </div>
        </form>
    );
};

export default ContactForm;