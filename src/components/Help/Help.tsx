// src/components/Help/HelpPage.tsx
import { HelpCircle, MessageSquare } from 'lucide-react';
import Footer from '../HomePage/Footer';
import FAQItem from '../Help/FAQItem';
import ContactForm from '../Help/ContactForm';
import BackButton from '../../components/common/BackButton';

const FAQ_DATA = [
    { q: "Làm sao để nâng cấp lên Premium?", a: "Bạn có thể vào mục 'Nâng cấp' trong menu tài khoản, chọn gói dịch vụ phù hợp và thanh toán qua MoMo, ZaloPay hoặc thẻ ngân hàng." },
    { q: "Tôi có thể tải nhạc về nghe offline không?", a: "Có. Tính năng này dành riêng cho tài khoản Premium. Bạn chỉ cần nhấn vào biểu tượng Download cạnh bài hát hoặc playlist." },
    { q: "Tại sao nhạc bị giật/lag?", a: "Vui lòng kiểm tra kết nối mạng của bạn. Bạn cũng có thể thử giảm Chất lượng nhạc trong phần Cài đặt > Chất lượng âm thanh." },
    { q: "Làm thế nào để đổi mật khẩu?", a: "Truy cập vào Avatar > Tài khoản > Bảo mật để thay đổi mật khẩu." },
];

const HelpPage = () => {
    return (
        <div>
            <div className="p-4 md:p-10 pb-32 max-w-5xl mx-auto text-zinc-900 dark:text-white">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <div className="md:hidden">
                        <BackButton className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" />
                    </div>
                    <h1 className="text-3xl font-bold">Trung tâm trợ giúp</h1>
                </div>
                {/* <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Trung tâm trợ giúp</h1>
                    <p className="text-zinc-500 text-lg">Chúng tôi có thể giúp gì cho bạn?</p>
                </div> */}

                <div className="grid md:grid-cols-12 gap-8 md:gap-12">

                    {/* CỘT TRÁI: FAQ (Chiếm 7 phần) */}
                    <div className="md:col-span-7 space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <HelpCircle className="text-green-500" />
                            <h2 className="text-xl font-bold">Câu hỏi thường gặp</h2>
                        </div>

                        <div className="bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                            {FAQ_DATA.map((item, idx) => (
                                <FAQItem key={idx} question={item.q} answer={item.a} />
                            ))}
                        </div>
                    </div>

                    {/* CỘT PHẢI: FORM LIÊN HỆ (Chiếm 5 phần) */}
                    <div className="md:col-span-5">
                        <div className="sticky top-24"> {/* Sticky để form luôn chạy theo khi cuộn */}
                            <div className="flex items-center gap-2 mb-4">
                                <MessageSquare className="text-blue-500" />
                                <h2 className="text-xl font-bold">Gửi yêu cầu hỗ trợ</h2>
                            </div>

                            <div className="bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HelpPage;